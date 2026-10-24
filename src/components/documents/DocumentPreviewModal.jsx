import React from 'react';
import Modal from '../common/Modal';
import { FileText, Download, Building, Calendar, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function DocumentPreviewModal({ isOpen, onClose, document: doc }) {
  if (!doc) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Document Preview - ${doc.documentType || doc.name}`} maxWidth="max-w-3xl">
      <div className="space-y-6">
        
        {/* Document Header Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-xs border border-gray-200 dark:border-slate-700">
          <div>
            <span className="text-gray-400 block font-semibold">Document Title</span>
            <span className="font-bold text-gray-900 dark:text-white truncate block">{doc.documentType || doc.name}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-semibold">Category</span>
            <span className="font-bold text-gray-900 dark:text-white">{doc.category}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-semibold">Upload Date</span>
            <span className="font-bold text-gray-900 dark:text-white">{formatDate(doc.uploadDate)}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-semibold">Status</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {doc.status || 'Verified'}
            </span>
          </div>
        </div>

        {/* Document Viewer Frame */}
        <div className="w-full h-96 bg-slate-900 rounded-2xl border border-gray-300 dark:border-slate-700 flex items-center justify-center overflow-hidden p-2">
          {doc.previewUrl ? (
            <img
              src={doc.previewUrl}
              alt={doc.name}
              className="max-h-full max-w-full object-contain rounded-lg shadow-md"
            />
          ) : (
            <div className="text-center text-slate-400 space-y-2">
              <FileText className="w-16 h-16 mx-auto text-slate-500" />
              <p className="text-sm font-semibold">{doc.name}</p>
              <p className="text-xs">IndexedDB Stored Binary Blob</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500">
            Issuing Authority: <span className="font-semibold text-gray-800 dark:text-slate-200">{doc.issuingAuthority || 'UIDAI / State Revenue Body'}</span>
          </p>

          <a
            href={doc.previewUrl || '#'}
            download={doc.name || 'document.pdf'}
            className="flex items-center gap-2 px-4 py-2 bg-gov-blue text-white rounded-xl text-xs font-bold shadow hover:bg-blue-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Document</span>
          </a>
        </div>

      </div>
    </Modal>
  );
}
