import React from 'react';
import { AlertCircle, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import { calculateProfileCompletion } from '../../utils/vaultHelpers';

export default function ProfileCompletionCard({ profile, vaultDocs = [], onGoToTab }) {
  const { percentage, missingFields, missingDocs } = calculateProfileCompletion(profile, vaultDocs);

  let badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
  let progressColor = 'bg-amber-500';

  if (percentage >= 80) {
    badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
    progressColor = 'bg-emerald-500';
  } else if (percentage < 40) {
    badgeColor = 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300';
    progressColor = 'bg-red-500';
  }

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-gray-200 dark:border-slate-700/80 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Citizen Profile Completion
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${badgeColor}`}>
              {percentage}% Complete
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Complete your profile once to enable 1-click IRCTC-style auto-filling across all schemes.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar value={percentage} colorClass={progressColor} showPercentage={false} />

      {/* Missing Information Checklist */}
      {(missingFields.length > 0 || missingDocs.length > 0) && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/60 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Missing Profile Data & Recommended Documents ({missingFields.length + missingDocs.length})</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Missing Data Fields */}
            {missingFields.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-semibold text-gray-700 dark:text-slate-300 block">
                  Missing Personal & Bank Fields:
                </span>
                <ul className="space-y-1">
                  {missingFields.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-center justify-between p-1.5 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300">
                      <span>❌ {f.label} ({f.category})</span>
                      <button
                        onClick={() => onGoToTab(f.category.toLowerCase())}
                        className="text-gov-blue dark:text-blue-400 font-bold text-[11px] hover:underline"
                      >
                        Fill Now
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Documents */}
            {missingDocs.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-semibold text-gray-700 dark:text-slate-300 block">
                  Missing Core Vault Documents:
                </span>
                <ul className="space-y-1">
                  {missingDocs.slice(0, 4).map((docName, i) => (
                    <li key={i} className="flex items-center justify-between p-1.5 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300">
                      <span>📄 {docName}</span>
                      <button
                        onClick={() => onGoToTab('documents')}
                        className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] hover:underline"
                      >
                        Upload
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {percentage === 100 && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Your Citizen Vault is 100% complete! All scheme applications will auto-fill with maximum precision.</span>
        </div>
      )}

    </div>
  );
}
