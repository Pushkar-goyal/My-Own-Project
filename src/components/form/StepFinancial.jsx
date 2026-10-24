import React from 'react';

export default function StepFinancial({ formData, onChange }) {
  return (
    <div className="space-y-4 text-xs">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Step 2: Income, Occupation & Caste Category</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Annual Family Income (₹)</label>
          <input
            type="number"
            name="annualIncome"
            value={formData.annualIncome || ''}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
            placeholder="e.g. 180000"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Occupation</label>
          <select
            name="occupation"
            value={formData.occupation || 'Farmer'}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
          >
            <option value="Farmer">Farmer / Agriculture</option>
            <option value="Student">Student</option>
            <option value="Self-Employed">Self-Employed / Vendor / Business</option>
            <option value="Artisan">Artisan / Traditional Craftsperson</option>
            <option value="Salaried">Salaried Worker / Employee</option>
            <option value="Unemployed">Unemployed / Pensioner</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Education Level</label>
          <select
            name="educationLevel"
            value={formData.educationLevel || 'Class 10th'}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
          >
            <option value="Below 10th">Below 10th</option>
            <option value="Class 10th">Class 10th Pass</option>
            <option value="Class 12th">Class 12th Pass</option>
            <option value="Graduate">Graduate / Diploma</option>
            <option value="Post Graduate">Post Graduate & Above</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Caste Category</label>
          <select
            name="casteCategory"
            value={formData.casteCategory || 'General'}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
          >
            <option value="General">General / Unreserved</option>
            <option value="OBC">OBC (Other Backward Classes)</option>
            <option value="SC">SC (Scheduled Caste)</option>
            <option value="ST">ST (Scheduled Tribe)</option>
            <option value="EWS">EWS (Economically Weaker Section)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
