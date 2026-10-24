import React, { useState } from 'react';
import { Save, Check, Users } from 'lucide-react';

export default function FamilySection({ profile, onSave }) {
  const [formData, setFormData] = useState({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-gov-blue dark:text-blue-400" />
            <span>Family Composition & Agricultural Land Details</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">Required for ration card, PMAY housing, and PM-KISAN farmer schemes.</p>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-gov-blue text-white rounded-xl text-xs font-bold shadow hover:bg-blue-800 transition-colors"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Saved!' : 'Save Details'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Family ID Number</label>
          <input
            type="text"
            name="familyId"
            value={formData.familyId || ''}
            onChange={handleChange}
            placeholder="e.g. Parivar Pehchan Patra No."
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Ration Card Number</label>
          <input
            type="text"
            name="rationCardNumber"
            value={formData.rationCardNumber || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Number of Family Members</label>
          <input
            type="number"
            name="familyMembersCount"
            value={formData.familyMembersCount || 1}
            onChange={handleChange}
            min={1}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        {/* Agricultural Land Owner */}
        <div className="md:col-span-2 pt-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="landOwnership"
              name="landOwnership"
              checked={formData.landOwnership || false}
              onChange={handleChange}
              className="w-4 h-4 text-gov-blue rounded border-gray-300 focus:ring-gov-blue"
            />
            <label htmlFor="landOwnership" className="font-semibold text-gray-700 dark:text-slate-300 cursor-pointer">
              Owner of Agricultural Land (Required for PM-KISAN and farmer subsidies)
            </label>
          </div>
        </div>

        {formData.landOwnership && (
          <div>
            <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Land Size (Acres / Hectares)</label>
            <input
              type="number"
              step="0.1"
              name="landSizeAcres"
              value={formData.landSizeAcres || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
            />
          </div>
        )}

      </div>
    </form>
  );
}
