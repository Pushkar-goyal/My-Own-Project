import React from 'react';

export default function ProgressBar({ value = 0, max = 100, label, colorClass = "bg-gov-blue", showPercentage = true }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className="w-full space-y-1.5">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-slate-300">
          <span>{label}</span>
          {showPercentage && <span className="font-mono">{percentage}%</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
