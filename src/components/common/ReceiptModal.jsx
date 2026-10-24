import React from 'react';
import Modal from './Modal';
import { Shield, Printer, CheckCircle, Download, FileText, Calendar, Building } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function ReceiptModal({ isOpen, onClose, application }) {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Application Receipt" maxWidth="max-w-3xl">
      <div className="space-y-6">
        
        {/* Printable Area */}
        <div className="printable-area p-6 sm:p-8 bg-white text-slate-900 rounded-xl border border-gray-300 shadow-sm space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-300 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gov-blue text-white flex items-center justify-center font-bold shadow">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-gov-navy">
                  GOVERNMENT SCHEME APPLICATION RECEIPT
                </h2>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Digital Citizen Portal • Government of India
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle className="w-3.5 h-3.5" />
                {application.status || 'SUBMITTED'}
              </span>
              <p className="text-[11px] text-gray-500 font-mono mt-1">
                Ref: {application.referenceNumber || 'REF-901823'}
              </p>
            </div>
          </div>

          {/* Key Application Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
            <div>
              <span className="text-gray-500 font-semibold block">Application ID</span>
              <span className="font-mono font-bold text-gray-900">{application.id}</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold block">Submission Date</span>
              <span className="font-bold text-gray-900">{formatDate(application.appliedDate)}</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold block">Nodal Ministry</span>
              <span className="font-bold text-gray-900">{application.nodalMinistry || 'Ministry of Social Justice'}</span>
            </div>
          </div>

          {/* Scheme Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Applied Scheme Details
            </h4>
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
              <h3 className="text-base font-bold text-gov-navy">
                {application.schemeName}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Category: <span className="font-semibold">{application.category}</span>
              </p>
            </div>
          </div>

          {/* Applicant Credentials */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Applicant Credentials (Vault Synced)
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs border-t border-gray-200 pt-3">
              <div>
                <span className="text-gray-500 font-medium">Applicant Name:</span>
                <p className="font-bold text-gray-900">{application.applicantName}</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Mobile Number:</span>
                <p className="font-bold text-gray-900">{application.mobileNumber}</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Aadhaar (Masked):</span>
                <p className="font-mono font-bold text-gray-900">{application.aadhaarMasked}</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Verification Status:</span>
                <p className="font-semibold text-emerald-700">Digital Vault eKYC Verified</p>
              </div>
            </div>
          </div>

          {/* Submitted Documents Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Auto-Attached Digital Documents ({application.attachedDocuments?.length || 0})
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(application.attachedDocuments || []).map((doc, idx) => (
                <li key={idx} className="flex items-center gap-2 p-2 rounded bg-gray-50 border border-gray-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium text-gray-800">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer & QR Placeholder */}
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-[11px] text-gray-500">
            <div>
              <p className="font-semibold text-gray-700">Notice:</p>
              <p>This is a computer-generated receipt from the Digital Citizen Assistant application. No physical signature is required under Information Technology Act, 2000.</p>
            </div>
            <div className="text-center flex-shrink-0 ml-4">
              <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center font-mono text-[9px] rounded p-1">
                [QR CODE VERIFIED]
              </div>
            </div>
          </div>

        </div>

        {/* Buttons (Hidden when printing) */}
        <div className="no-print flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-gov-blue text-white shadow-lg shadow-gov-blue/20 hover:bg-blue-800 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>

      </div>
    </Modal>
  );
}
