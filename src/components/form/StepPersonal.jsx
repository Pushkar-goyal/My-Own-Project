import React from 'react';

export default function StepPersonal({ formData, onChange }) {
  return (
    <div className="space-y-4 text-xs">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Step 1: Personal Demographic Details</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
            placeholder="e.g. Rajesh Kumar Sharma"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Age (Years)</label>
          <input
            type="number"
            name="age"
            value={formData.age || ''}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
            placeholder="e.g. 32"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender || 'Male'}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Transgender">Transgender</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Marital Status</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus || 'Single'}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
            <option value="Divorced">Divorced</option>
          </select>
        </div>
      </div>
    </div>
  );
}
