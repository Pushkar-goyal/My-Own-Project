import React from 'react';

export default function StepLocation({ formData, onChange, onCheckboxChange }) {
  return (
    <div className="space-y-4 text-xs">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Step 3: State Domicile & Special Conditions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">State / Domicile</label>
          <input
            type="text"
            name="state"
            value={formData.state || ''}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
            placeholder="e.g. Haryana, Uttar Pradesh, Maharashtra"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">District</label>
          <input
            type="text"
            name="district"
            value={formData.district || ''}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
            placeholder="e.g. Karnal"
          />
        </div>

        <div className="sm:col-span-2 space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="disabilityStatusForm"
              name="disabilityStatus"
              checked={Boolean(formData.disabilityStatus)}
              onChange={(e) => onCheckboxChange('disabilityStatus', e.target.checked)}
              className="w-4 h-4 text-gov-blue rounded border-gray-300 focus:ring-gov-blue"
            />
            <label htmlFor="disabilityStatusForm" className="font-semibold text-gray-700 dark:text-slate-300 cursor-pointer">
              Person with Disability (PwD / UDID Card Holder)
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="landOwnershipForm"
              name="landOwnership"
              checked={Boolean(formData.landOwnership)}
              onChange={(e) => onCheckboxChange('landOwnership', e.target.checked)}
              className="w-4 h-4 text-gov-blue rounded border-gray-300 focus:ring-gov-blue"
            />
            <label htmlFor="landOwnershipForm" className="font-semibold text-gray-700 dark:text-slate-300 cursor-pointer">
              Agricultural Land Owner (Check for PM-KISAN & Farmer Subsidies)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
