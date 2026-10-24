import React, { useState, useRef } from 'react';
import { useDocumentVault } from '../context/DocumentVaultContext';
import { Check, FileText, Info, UploadCloud, Trash2, Loader2 } from 'lucide-react';
import schemesData from '../data/schemes.json';

const ALL_DOCUMENTS = [
  { id: 'aadhaar', name: 'Aadhaar Card', category: 'Identity' },
  { id: 'pan_card', name: 'PAN Card', category: 'Identity' },
  { id: 'income_certificate', name: 'Income Certificate', category: 'Income' },
  { id: 'domicile_certificate', name: 'Domicile Certificate', category: 'Address' },
  { id: 'caste_certificate', name: 'Caste Certificate', category: 'Caste' },
  { id: 'marksheet', name: 'Marksheet', category: 'Education' },
  { id: 'bank_passbook', name: 'Bank Passbook / Cancelled Cheque', category: 'Financial' },
  { id: 'ration_card', name: 'Ration Card (APL/BPL/AAY)', category: 'Identity' },
  { id: 'voter_id', name: 'Voter ID Card', category: 'Identity' },
  { id: 'land_patta', name: 'Land Patta / Khasra-Khatauni', category: 'Agriculture' },
];

export default function CitizenVaultPage() {
  const { documents, addDocument, removeDocument } = useDocumentVault();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const fileInputRef = useRef(null);
  const [pendingUploadTarget, setPendingUploadTarget] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const getDoc = (docName) => documents.find(d => d.documentType === docName && d.status === 'Available');
  const getDocStatus = (docName) => getDoc(docName) ? 'Available' : 'Missing';

  const getConnectedBenefits = (docName) => {
    return schemesData.filter(s => s.documents.includes(docName));
  };

  const triggerUpload = (docName) => {
    setPendingUploadTarget(docName);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    const docName = pendingUploadTarget;
    e.target.value = null;
    if (!file || !docName) return;
    setUploadError('');
    const allowedFile = /\.(pdf|jpe?g|png)$/i.test(file.name) || ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
    if (!allowedFile) {
      setUploadError('Unsupported file type. Choose a PDF, JPG, or PNG file.');
      setPendingUploadTarget(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is larger than 10 MB. Choose a smaller PDF or image.');
      setPendingUploadTarget(null);
      return;
    }
    setUploadingDoc(docName);
    try {
      await addDocument({ documentType: docName, status: 'Available' }, file);
    } catch (error) {
      setUploadError('Could not save this file in browser storage. Check available storage and try again.');
    } finally {
      setUploadingDoc(null);
      setPendingUploadTarget(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Hidden file picker; the chosen file is saved to IndexedDB. */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
      />

      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">My Documents</h1>
        <p className="text-gray-600 mt-2">
          Save documents locally in this browser, then choose them from Portal Upload when you are ready.
          <br/>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded mt-2 inline-block">
            Files stay in this browser’s local storage. Supported types: PDF, JPG, PNG. Maximum 10 MB per file.
          </span>
        </p>
        {uploadError && <p role="alert" className="text-sm text-rose-700 mt-3">{uploadError}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {ALL_DOCUMENTS.map(doc => {
            const status = getDocStatus(doc.name);
            const isAvailable = status === 'Available';
            const savedDoc = getDoc(doc.name);
            const hasRealFile = Boolean(savedDoc && !savedDoc.demoOnly && savedDoc.fileName);
            const isUploading = uploadingDoc === doc.name;
            
            return (
              <div 
                key={doc.id} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border ${isAvailable ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-white'} transition-colors gap-4`}
              >
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedDoc(doc.name)}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 hover:text-blue-600">
                      {doc.name}
                    </div>
                    <div className="text-xs text-gray-500">{doc.category}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {isUploading ? (
                    <div className="flex items-center gap-2 text-blue-600 text-sm font-bold bg-blue-50 px-4 py-2 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </div>
                  ) : isAvailable ? (
                    <>
                      <div className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg border ${hasRealFile ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : 'text-amber-800 bg-amber-100 border-amber-200'}`}>
                        <Check className="w-4 h-4" />
                        {hasRealFile ? 'Saved locally' : 'Demo only'}
                      </div>
                      <button
                        onClick={() => triggerUpload(doc.name)}
                        className="text-xs font-bold text-blue-700 border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50"
                        title="Choose a real file for this document"
                      >
                        {hasRealFile ? 'Replace file' : 'Add file'}
                      </button>
                      <button 
                        onClick={() => removeDocument(doc.name)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                        title="Remove Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => triggerUpload(doc.name)}
                      className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-bold px-4 py-2 rounded-lg transition-colors border border-blue-200"
                    >
                      <UploadCloud className="w-4 h-4" />
                      Upload
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="md:col-span-1">
          {selectedDoc ? (
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 sticky top-6">
              <h3 className="font-bold text-xl text-blue-900 mb-2">{selectedDoc}</h3>
              <p className="text-sm text-blue-700 mb-6">Benefits connected to this document:</p>
              
              <div className="space-y-3">
                {getConnectedBenefits(selectedDoc).length > 0 ? (
                  getConnectedBenefits(selectedDoc).map(s => (
                    <div key={s.id} className="bg-white p-3 rounded-lg border border-blue-100 text-sm font-medium text-gray-800 shadow-sm">
                      {s.name}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic">No benefits currently mapped to this document.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center text-gray-500 h-full flex flex-col items-center justify-center">
              <Info className="w-8 h-8 mb-2 text-gray-400" />
              <p>Select a document name to see which benefits require it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
