import React, { useState } from 'react';
import Modal from '../common/Modal';
import { CheckCircle2, AlertCircle, Upload, ShieldCheck, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { maskAadhaar, maskAccount } from '../../utils/formatters';
import { useApplicationHistory } from '../../context/ApplicationHistoryContext';
import { useDocumentVault } from '../../context/DocumentVaultContext';

export default function AutoFillModal({ isOpen, onClose, scheme, matchResult, userProfile, onApplicationSuccess }) {
  const { submitApplication } = useApplicationHistory();
  const { documents: vaultDocs, addDocument } = useDocumentVault();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingDocName, setUploadingDocName] = useState(null);

  if (!scheme || !userProfile) return null;

  const requiredDocs = scheme.requiredDocuments || [];
  const vaultDocNames = vaultDocs.map(d => (d.documentType || d.name || '').toLowerCase());
  const profileHeldDocs = (userProfile.documentsHeld || []).map(d => typeof d === 'string' ? d.toLowerCase() : '');

  // Calculate auto-attached vs missing documents
  const autoAttachedDocs = [];
  const missingDocs = [];

  requiredDocs.forEach(req => {
    const isPresent = vaultDocNames.some(d => d.includes(req.toLowerCase()) || req.toLowerCase().includes(d)) ||
                      profileHeldDocs.some(d => d.includes(req.toLowerCase()) || req.toLowerCase().includes(d));
    if (isPresent) {
      autoAttachedDocs.push(req);
    } else {
      missingDocs.push(req);
    }
  });

  const handleInlineUpload = async (docName, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingDocName(docName);
    try {
      await addDocument(file, {
        documentType: docName,
        category: 'Government Scheme Docs'
      });
      alert(`Uploaded ${docName} successfully to Citizen Vault!`);
    } catch (err) {
      alert('Failed to upload file.');
    } finally {
      setUploadingDocName(null);
    }
  };

  const handleConfirmSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const createdApp = submitApplication(scheme, userProfile, autoAttachedDocs);
      setIsSubmitting(false);
      onClose();
      if (onApplicationSuccess) {
        onApplicationSuccess(createdApp);
      }
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="IRCTC-Style Auto-Fill Scheme Application" maxWidth="max-w-3xl">
      <div className="space-y-6">
        
        {/* Banner */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-gov-blue dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-gov-navy dark:text-white">
              Auto-Filling Application for {scheme.name}
            </h4>
            <p className="text-gray-600 dark:text-slate-300">
              Your Citizen Vault profile and uploaded documents were matched automatically. Review details below before final submission.
            </p>
          </div>
        </div>

        {/* 1. Auto-Filled Demographic Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            1. Auto-Filled Demographic Data (From Citizen Vault)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-xs border border-gray-200 dark:border-slate-700">
            <div>
              <span className="text-gray-400 block font-medium">Applicant Name</span>
              <span className="font-bold text-gray-900 dark:text-white">{userProfile.fullName}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Date of Birth / Age</span>
              <span className="font-bold text-gray-900 dark:text-white">{userProfile.dob} ({userProfile.age} Yrs)</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Mobile Number</span>
              <span className="font-bold text-gray-900 dark:text-white">{userProfile.mobileNumber}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Aadhaar (eKYC Verified)</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{maskAadhaar(userProfile.aadhaarNumber)}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Domicile State</span>
              <span className="font-bold text-gray-900 dark:text-white">{userProfile.state}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">DBT Bank Account</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{maskAccount(userProfile.bankAccountNumber)}</span>
            </div>
          </div>
        </div>

        {/* 2. Auto-Attached Documents */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>2. Auto-Attached Vault Certificates ({autoAttachedDocs.length})</span>
            <span className="text-emerald-600 font-semibold">✔ Ready</span>
          </h4>
          
          <ul className="space-y-2 text-xs">
            {autoAttachedDocs.map((docName, idx) => (
              <li key={idx} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{docName}</span>
                </div>
                <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
                  Auto-Attached from Vault
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Missing Documents Warning & Inline Upload */}
        {missingDocs.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Missing Documents Required for Application ({missingDocs.length})</span>
            </h4>

            <ul className="space-y-2 text-xs">
              {missingDocs.map((docName, idx) => (
                <li key={idx} className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60">
                  <div className="flex items-center gap-2 text-red-900 dark:text-red-200 font-semibold">
                    <span className="text-red-500 font-bold">❌ {docName}</span>
                  </div>

                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-sm">
                    {uploadingDocName === docName ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload to Vault</span>
                    <input
                      type="file"
                      onChange={(e) => handleInlineUpload(docName, e)}
                      accept=".pdf,.jpg,.png"
                      className="hidden"
                    />
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-slate-700 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm Application & Generate Receipt</span>
              </>
            )}
          </button>
        </div>

      </div>
    </Modal>
  );
}
