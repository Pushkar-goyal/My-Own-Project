import React from 'react';
import { FileText, Eye, Download, Trash2, CheckCircle, Clock, RefreshCw, Building } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function DocumentCard({ document: doc, onPreview, onDelete, onReplace }) {
  const isVerified = doc.status === 'Verified';

  const handleDownload = () => {
    if (doc.previewUrl) {
      const a = document.createElement('a');
      a.href = doc.previewUrl;
      a.download = doc.name || `${doc.documentType}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
      
      {/* Top Details & Status */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-700 text-gov-blue dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                {doc.documentType || doc.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                {doc.category || 'Government Document'}
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            isVerified 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}>
            {isVerified ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            <span>{doc.status || 'Verified'}</span>
          </span>
        </div>

        {/* Issuing Authority & File Info */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-gray-100 dark:border-slate-700/50">
          <div>
            <span className="text-gray-400 block font-semibold">Issuing Body</span>
            <span className="text-gray-700 dark:text-slate-300 font-medium truncate block">
              {doc.issuingAuthority || 'Govt Authority'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block font-semibold">Upload Date</span>
            <span className="text-gray-700 dark:text-slate-300 font-medium block">
              {formatDate(doc.uploadDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Preview, Download, Delete */}
      <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-700/60 pt-3 text-xs">
        <button
          onClick={() => onPreview(doc)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-bold hover:bg-gov-blue hover:text-white transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gov-blue hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            title="Download Document"
          >
            <Download className="w-4 h-4" />
          </button>
          
          {onReplace && (
            <button
              onClick={() => onReplace(doc)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gov-blue hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              title="Replace File"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onDelete(doc.id)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Delete Document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
