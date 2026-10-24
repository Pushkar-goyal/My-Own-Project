import React from 'react';
import { Check } from 'lucide-react';

export default function StepIndicator({ currentStep, totalSteps = 5, steps = [], onStepClick }) {
  return (
    <div className="w-full space-y-4">
      {/* Progress Line */}
      <div className="relative flex items-center justify-between">
        {/* Connector Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 dark:bg-slate-700 z-0">
          <div
            className="h-full bg-gov-blue transition-all duration-300 ease-out"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Step Nodes */}
        {steps.map((s, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={idx}
              onClick={() => onStepClick && onStepClick(stepNum)}
              className="relative z-10 flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all duration-200 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-gov-blue text-white ring-4 ring-blue-100 dark:ring-slate-800 scale-110'
                    : 'bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
              </div>
              <span className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                isCurrent ? 'text-gov-blue dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
