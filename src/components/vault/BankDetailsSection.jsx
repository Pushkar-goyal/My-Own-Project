import React, { useState } from 'react';
import { Save, Check, CreditCard, Eye, EyeOff } from 'lucide-react';
import { maskAccount } from '../../utils/formatters';

export default function BankDetailsSection({ profile, onSave }) {
  const [formData, setFormData] = useState({ ...profile });
  const [showAccount, setShowAccount] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            <CreditCard className="w-5 h-5 text-gov-blue dark:text-blue-400" />
            <span>Direct Benefit Transfer (DBT) Bank Account</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">Essential for receiving financial subsidies, pensions, and scholarship transfers directly.</p>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-gov-blue text-white rounded-xl text-xs font-bold shadow hover:bg-blue-800 transition-colors"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Saved!' : 'Save Bank Details'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Account Holder Name</label>
          <input
            type="text"
            name="accountHolderName"
            value={formData.accountHolderName || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName || ''}
            onChange={handleChange}
            placeholder="e.g. State Bank of India"
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
            required
          />
        </div>

        {/* Bank Account Number */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-gray-700 dark:text-slate-300">Bank Account Number</label>
            <button
              type="button"
              onClick={() => setShowAccount(!showAccount)}
              className="text-[11px] text-gov-blue dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              {showAccount ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showAccount ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>
          <input
            type={showAccount ? 'text' : 'password'}
            name="bankAccountNumber"
            value={formData.bankAccountNumber || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-gov-blue"
            required
          />
          {!showAccount && (
            <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
              Masked: {maskAccount(formData.bankAccountNumber)}
            </span>
          )}
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">IFSC Code</label>
          <input
            type="text"
            name="ifscCode"
            maxLength={11}
            value={formData.ifscCode || ''}
            onChange={handleChange}
            placeholder="11-character IFSC"
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gov-blue"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Branch Name</label>
          <input
            type="text"
            name="branch"
            value={formData.branch || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

      </div>
    </form>
  );
}
