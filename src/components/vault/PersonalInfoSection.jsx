import React, { useState } from 'react';
import { Eye, EyeOff, Save, Check } from 'lucide-react';
import { maskAadhaar, maskPAN } from '../../utils/formatters';

export default function PersonalInfoSection({ profile, onSave }) {
  const [formData, setFormData] = useState({ ...profile });
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showPAN, setShowPAN] = useState(false);
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
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Personal Identification & Identity</h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">Core citizen demographic data for scheme matching and auto-fill.</p>
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
        {/* Full Name */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
            required
          />
        </div>

        {/* Father's Name */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Father's Name</label>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        {/* Mother's Name */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Mother's Name</label>
          <input
            type="text"
            name="motherName"
            value={formData.motherName || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender || 'Male'}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Transgender">Transgender</option>
          </select>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Mobile Number</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        {/* Email */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        {/* Aadhaar Number (Masked toggle) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-gray-700 dark:text-slate-300">Aadhaar Number</label>
            <button
              type="button"
              onClick={() => setShowAadhaar(!showAadhaar)}
              className="text-[11px] text-gov-blue dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              {showAadhaar ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showAadhaar ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>
          <input
            type={showAadhaar ? 'text' : 'password'}
            name="aadhaarNumber"
            value={formData.aadhaarNumber || ''}
            onChange={handleChange}
            placeholder="12-digit UID"
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
          {!showAadhaar && (
            <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
              Masked: {maskAadhaar(formData.aadhaarNumber)}
            </span>
          )}
        </div>

        {/* PAN Number */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-gray-700 dark:text-slate-300">PAN Number</label>
            <button
              type="button"
              onClick={() => setShowPAN(!showPAN)}
              className="text-[11px] text-gov-blue dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              {showPAN ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showPAN ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>
          <input
            type={showPAN ? 'text' : 'password'}
            name="panNumber"
            value={formData.panNumber || ''}
            onChange={handleChange}
            placeholder="10-digit PAN"
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
          {!showPAN && (
            <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
              Masked: {maskPAN(formData.panNumber)}
            </span>
          )}
        </div>

        {/* Voter ID */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Voter ID (EPIC)</label>
          <input
            type="text"
            name="voterId"
            value={formData.voterId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        {/* Passport Number */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Passport Number</label>
          <input
            type="text"
            name="passportNumber"
            value={formData.passportNumber || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        {/* Driving Licence */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Driving Licence</label>
          <input
            type="text"
            name="drivingLicense"
            value={formData.drivingLicense || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        {/* Marital Status */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Marital Status</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus || 'Single'}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
            <option value="Divorced">Divorced</option>
          </select>
        </div>

        {/* Occupation */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Occupation</label>
          <select
            name="occupation"
            value={formData.occupation || 'Farmer'}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
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

        {/* Annual Income */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Annual Family Income (₹)</label>
          <input
            type="number"
            name="annualIncome"
            value={formData.annualIncome || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        {/* Caste Category */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Caste Category</label>
          <select
            name="casteCategory"
            value={formData.casteCategory || 'General'}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
          >
            <option value="General">General / Unreserved</option>
            <option value="OBC">OBC (Other Backward Classes)</option>
            <option value="SC">SC (Scheduled Caste)</option>
            <option value="ST">ST (Scheduled Tribe)</option>
            <option value="EWS">EWS (Economically Weaker Section)</option>
          </select>
        </div>

        {/* Disability Checkbox */}
        <div className="flex items-center gap-2 pt-5">
          <input
            type="checkbox"
            id="disabilityStatus"
            name="disabilityStatus"
            checked={formData.disabilityStatus || false}
            onChange={handleChange}
            className="w-4 h-4 text-gov-blue rounded border-gray-300 focus:ring-gov-blue"
          />
          <label htmlFor="disabilityStatus" className="font-semibold text-gray-700 dark:text-slate-300 cursor-pointer">
            Person with Disability (PwD / UDID card holder)
          </label>
        </div>

      </div>
    </form>
  );
}
