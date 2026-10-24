import React from 'react';
import { Award, CheckCircle2, AlertCircle, FileCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function SchemeCard({ matchResult, onApplyAutoFill }) {
  const { scheme, matchScore, matchedReasons = [], heldDocuments = [], missingDocuments = [] } = matchResult;

  let scoreBadgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
  if (matchScore < 70) {
    scoreBadgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
      
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gov-blue dark:text-blue-400 bg-blue-50 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-blue-100 dark:border-slate-700">
              {scheme.category}
            </span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 leading-snug">
              {scheme.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-medium">
              {scheme.nodalMinistry || 'Government of India'}
            </p>
          </div>

          {/* Match Score Badge */}
          <div className={`px-3.5 py-2 rounded-2xl border text-center font-extrabold shadow-sm ${scoreBadgeColor}`}>
            <span className="text-xl font-black block leading-none">{matchScore}%</span>
            <span className="text-[9px] uppercase tracking-wider mt-0.5 block">Match</span>
          </div>
        </div>

        <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
          {scheme.description}
        </p>

        {/* Benefits Highlight */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
          <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">Scheme Financial Benefits:</span>
          <p className="text-emerald-900 dark:text-emerald-200 font-semibold">{scheme.benefits}</p>
        </div>

        {/* Qualification Reasons Breakdown */}
        {matchedReasons.length > 0 && (
          <div className="space-y-1.5 pt-1 text-xs">
            <span className="font-bold text-gray-700 dark:text-slate-300 block">Why You Qualify:</span>
            <ul className="space-y-1 text-gray-600 dark:text-slate-400">
              {matchedReasons.slice(0, 3).map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Held vs Needed Documents breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          {/* Held Docs */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
              ✔ Held Documents ({heldDocuments.length}):
            </span>
            {heldDocuments.length > 0 ? (
              <ul className="space-y-1 text-gray-600 dark:text-slate-300 text-[11px]">
                {heldDocuments.map((doc, idx) => (
                  <li key={idx}>• {doc}</li>
                ))}
              </ul>
            ) : (
              <span className="text-[11px] text-gray-400">None in Vault</span>
            )}
          </div>

          {/* Missing Docs */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700">
            <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">
              ⚠️ Missing Documents ({missingDocuments.length}):
            </span>
            {missingDocuments.length > 0 ? (
              <ul className="space-y-1 text-gray-600 dark:text-slate-300 text-[11px]">
                {missingDocuments.map((doc, idx) => (
                  <li key={idx}>• {doc}</li>
                ))}
              </ul>
            ) : (
              <span className="text-[11px] text-emerald-600 font-bold">All Required Docs Available!</span>
            )}
          </div>
        </div>

      </div>

      {/* Footer Actions: 1-Click Auto Fill Apply & Official Portal Link */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-slate-700/60">
        <button
          onClick={() => onApplyAutoFill(scheme, matchResult)}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gov-blue to-blue-700 hover:from-blue-800 hover:to-blue-900 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <FileCheck className="w-4 h-4" />
          <span>Apply Now (Auto-Fill Vault)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {scheme.applicationLink && (
          <a
            href={scheme.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors"
            title="Visit Official Ministry Portal"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

    </div>
  );
}
