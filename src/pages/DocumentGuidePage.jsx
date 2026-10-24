import React, { useState, useMemo } from 'react';
import { Search, FileText, CheckCircle2, AlertCircle, Building, Smartphone, Check, X, ArrowRight } from 'lucide-react';
import documentsData from '../data/documents.json';
import schemesData from '../data/schemes.json';
import { useLanguage } from '../context/LanguageContext';
import { useDocumentVault } from '../context/DocumentVaultContext';

export default function DocumentGuidePage({ setActivePage }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { documents, addDocument, removeDocument } = useDocumentVault();

  // Extract all unique categories
  const categories = useMemo(() => {
    const set = new Set(documentsData.map(d => d.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documentsData.filter(doc => {
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const getDocStatus = (docName) => {
    return documents.find(d => d.documentType === docName && d.status === 'Available') ? 'Available' : 'Missing';
  };

  const toggleDocument = (docName) => {
    if (getDocStatus(docName) === 'Available') {
      removeDocument(docName);
    } else {
      addDocument({ documentType: docName, status: 'Available' });
    }
  };

  const getConnectedBenefits = (docName) => {
    return schemesData.filter(s => s.documents.includes(docName));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-12">
      
      {/* Page Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Interactive Document Guide
        </h1>
        <p className="text-sm text-gray-600 max-w-3xl">
          Explore required documents, mark what you have, and see which benefits you can unlock.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document name, issuing authority, or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {categories.map((cat, i) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => {
          const isAvailable = getDocStatus(doc.name) === 'Available';
          const connected = getConnectedBenefits(doc.name);

          return (
            <div
              key={doc.id}
              className={`bg-white rounded-2xl border ${isAvailable ? 'border-emerald-200 shadow-emerald-100' : 'border-gray-200'} p-6 shadow-sm transition-all flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 leading-tight">
                        {doc.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-gray-500">
                        {doc.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    What is it & Why it's needed
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {doc.purpose}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Issuing Authority
                  </span>
                  <p className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    {doc.issuingAuthority}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                    Connected Benefits ({connected.length})
                  </span>
                  {connected.length > 0 ? (
                    <ul className="text-xs text-gray-700 font-medium space-y-1 list-disc pl-4">
                      {connected.slice(0, 3).map(s => (
                        <li key={s.id}>{s.name}</li>
                      ))}
                      {connected.length > 3 && <li className="text-blue-600">+ {connected.length - 3} more</li>}
                    </ul>
                  ) : (
                    <div className="text-xs text-gray-500">No specific benefits mapped.</div>
                  )}
                </div>
              </div>

              <button
                onClick={() => toggleDocument(doc.name)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                  isAvailable 
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isAvailable ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span>{isAvailable ? 'Marked as Available' : 'Mark as Available'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 space-y-3">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No documents found</h3>
          <p className="text-xs text-gray-500">Try relaxing your search terms or clearing category filters.</p>
        </div>
      )}

    </div>
  );
}
