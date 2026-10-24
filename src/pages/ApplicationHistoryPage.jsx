import React, { useState } from 'react';
import { useApplicationHistory } from '../context/ApplicationHistoryContext';
import { useLanguage } from '../context/LanguageContext';
import ReceiptModal from '../components/common/ReceiptModal';
import { History, FileText, CheckCircle2, Clock, Printer, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function ApplicationHistoryPage() {
  const { applications } = useApplicationHistory();
  const { t } = useLanguage();
  const [selectedAppForReceipt, setSelectedAppForReceipt] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gov-navy dark:text-white flex items-center gap-3">
          <History className="w-8 h-8 text-gov-blue dark:text-blue-400" />
          <span>{t('historyTitle')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">
          {t('historySubtitle')}
        </p>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300">
                  {app.id}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <Clock className="w-3 h-3" />
                  <span>{app.status || 'Pending'}</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {app.schemeName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  Applied Date: <strong className="text-gray-800 dark:text-slate-200">{formatDate(app.appliedDate)}</strong> • Applicant: <strong className="text-gray-800 dark:text-slate-200">{app.applicantName}</strong>
                </p>
              </div>

              {/* Attached Documents Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-gray-400 font-semibold">Attached Docs:</span>
                {(app.attachedDocuments || []).map((doc, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 text-gov-blue dark:text-blue-300 font-medium">
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Download Receipt Button */}
            <button
              onClick={() => setSelectedAppForReceipt(app)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors flex-shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>{t('receiptBtn')}</span>
            </button>
          </div>
        ))}

        {applications.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-3">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-gray-800 dark:text-slate-200">{t('noHistory')}</h3>
          </div>
        )}
      </div>

      {/* Application Receipt Modal */}
      {selectedAppForReceipt && (
        <ReceiptModal
          isOpen={Boolean(selectedAppForReceipt)}
          onClose={() => setSelectedAppForReceipt(null)}
          application={selectedAppForReceipt}
        />
      )}

    </div>
  );
}
