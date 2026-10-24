import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

export default function StepDocuments({ formData, onDocumentToggle }) {
  const commonDocsList = [
    "Aadhaar Card",
    "PAN Card",
    "Voter ID Card (EPIC)",
    "Ration Card (APL/BPL/AAY)",
    "Income Certificate",
    "Caste Certificate (SC/ST/OBC)",
    "Domicile / Residence Certificate",
    "Bank Passbook / Cancelled Cheque",
    "Land Patta / Khasra-Khatauni",
    "Disability Certificate (UDID)",
    "Class 10th Marksheet / Passing Certificate",
    "Passport Size Photograph"
  ];

  const currentDocs = formData.documentsHeld || [];

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Step 4: Select Documents You Already Possess</h3>
          <p className="text-gray-500 dark:text-slate-400">Used to calculate your document readiness score for each scheme.</p>
        </div>
        <span className="font-bold text-gov-blue dark:text-blue-400 bg-blue-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          {currentDocs.length} Selected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
        {commonDocsList.map((doc, idx) => {
          const isSelected = currentDocs.includes(doc);
          return (
            <div
              key={idx}
              onClick={() => onDocumentToggle(doc)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-50/80 dark:bg-slate-800 border-gov-blue text-gov-navy dark:text-white font-bold'
                  : 'bg-gray-50/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300'
              }`}
            >
              {isSelected ? (
                <CheckSquare className="w-4 h-4 text-gov-blue dark:text-blue-400 flex-shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              <span className="truncate">{doc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
