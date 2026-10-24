import React, { useMemo, useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { Save, CheckCircle2, UserRound, MapPin, GraduationCap, Landmark, Users, BadgeCheck, FileText, ShieldAlert, RotateCcw } from 'lucide-react';

const groups = [
  {
    id: 'personal', title: 'Personal & Identity Details', description: 'Common identity fields used in scholarship, pension, housing and other application forms.', icon: UserRound,
    fields: [
      ['fullName', 'Full name (as on official ID)', 'text'], ['nameAsPerAadhaar', 'Name as on Aadhaar (optional)', 'text'], ['fatherName', "Father's name", 'text'], ['motherName', "Mother's name", 'text'], ['spouseName', "Spouse's name (if applicable)", 'text'],
      ['dob', 'Date of birth', 'date'], ['gender', 'Gender', 'select', ['Prefer not to say', 'Female', 'Male', 'Transgender', 'Other']], ['maritalStatus', 'Marital status', 'select', ['Prefer not to say', 'Single', 'Married', 'Widowed', 'Divorced', 'Separated']], ['nationality', 'Nationality', 'text'],
      ['mobileNumber', 'Mobile number', 'tel'], ['alternateMobile', 'Alternate mobile number', 'tel'], ['email', 'Email address', 'email'],
      ['aadhaarNumber', 'Aadhaar number (optional)', 'text'], ['panNumber', 'PAN number (optional)', 'text'], ['voterId', 'Voter ID / EPIC number', 'text'], ['passportNumber', 'Passport number', 'text'], ['drivingLicense', 'Driving licence number', 'text'], ['birthCertificateNumber', 'Birth certificate number', 'text']
    ]
  },
  {
    id: 'social', title: 'Caste, Category & Certificates', description: 'Keep certificate references and eligibility details together. Enter only what applies to you.', icon: BadgeCheck,
    fields: [
      ['casteCategory', 'Reservation category', 'select', ['Prefer not to say', 'General', 'EWS', 'OBC-NCL', 'OBC-CL', 'SC', 'ST', 'Other']], ['casteName', 'Caste / community name (optional)', 'text'], ['subCaste', 'Sub-caste (if applicable)', 'text'], ['casteCertificateNumber', 'Caste certificate number', 'text'], ['casteCertificateIssueDate', 'Caste certificate issue date', 'date'], ['casteCertificateIssuingState', 'Caste certificate issuing state', 'text'], ['casteCertificateIssuingAuthority', 'Issuing authority / tehsil', 'text'], ['nonCreamyLayerCertificateNumber', 'OBC Non-Creamy Layer certificate number', 'text'], ['nonCreamyLayerValidUntil', 'Non-Creamy Layer certificate valid until', 'date'],
      ['ewsCertificateNumber', 'EWS certificate number', 'text'], ['ewsCertificateValidUntil', 'EWS certificate valid until', 'date'], ['incomeCertificateNumber', 'Income certificate number', 'text'], ['incomeCertificateIssueDate', 'Income certificate issue date', 'date'], ['domicileCertificateNumber', 'Domicile / residence certificate number', 'text'], ['domicileCertificateIssueDate', 'Domicile certificate issue date', 'date'], ['disabilityStatus', 'Person with benchmark disability?', 'select', ['Prefer not to say', 'No', 'Yes']], ['disabilityType', 'Disability type (if applicable)', 'text'], ['disabilityPercentage', 'Disability percentage (if applicable)', 'number'], ['udidNumber', 'UDID card number (if applicable)', 'text'], ['minorityCommunity', 'Minority community (if applicable)', 'select', ['Prefer not to say', 'Not applicable', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Other']], ['exServicemanStatus', 'Ex-serviceman / defence family status', 'select', ['Prefer not to say', 'No', 'Ex-serviceman', 'Dependent of serving personnel', 'Dependent of ex-serviceman']]
    ]
  },
  {
    id: 'address', title: 'Address & Domicile', description: 'Use the address matching your supporting documents when a form requires it.', icon: MapPin,
    fields: [
      ['houseNumber', 'House / flat number', 'text'], ['street', 'Street / landmark', 'text'], ['village', 'Village / gram panchayat', 'text'], ['city', 'City / town', 'text'], ['district', 'District', 'text'], ['subDistrict', 'Tehsil / block / sub-district', 'text'], ['state', 'State / Union Territory', 'text'], ['pinCode', 'PIN code', 'text'], ['postOffice', 'Post office', 'text'], ['policeStation', 'Police station (if required)', 'text'], ['addressSameAsPermanent', 'Correspondence address same as permanent?', 'select', ['Yes', 'No']], ['correspondenceAddress', 'Correspondence address (if different)', 'text'], ['residenceSince', 'Years living at current address', 'number']
    ]
  },
  {
    id: 'education', title: 'Education & Student Details', description: 'Useful for scholarships, admissions, fee reimbursement and student benefits.', icon: GraduationCap,
    fields: [
      ['educationLevel', 'Highest education level', 'select', ['Not specified', 'Class 8 or below', 'Class 10', 'Class 12', 'Diploma / ITI', 'Undergraduate', 'Postgraduate', 'PhD', 'Other']], ['studentStatus', 'Current status', 'select', ['Not applicable', 'School student', 'College student', 'Research scholar', 'Not currently studying']], ['institutionName', 'School / college / university', 'text'], ['courseName', 'Course / class / programme', 'text'], ['courseYear', 'Current year / semester', 'text'], ['enrolmentNumber', 'Enrollment / registration number', 'text'], ['rollNumber', 'Roll number', 'text'], ['boardUniversity', 'Board / university', 'text'], ['passingYear', 'Last exam passing year', 'number'], ['marksPercentage', 'Marks / percentage (if required)', 'number'], ['scholarshipApplicationId', 'Existing scholarship application ID', 'text']
    ]
  },
  {
    id: 'income', title: 'Income, Work & Social Security', description: 'For income-based schemes, employment support and labour welfare applications.', icon: FileText,
    fields: [
      ['occupation', 'Occupation', 'select', ['Not specified', 'Student', 'Farmer', 'Salaried employee', 'Self-employed / business', 'Daily-wage worker', 'Artisan', 'Homemaker', 'Unemployed', 'Pensioner', 'Other']], ['annualIncome', 'Annual personal income (₹)', 'number'], ['annualFamilyIncome', 'Annual family income (₹)', 'number'], ['incomeCertificateIssuingAuthority', 'Income certificate issuing authority', 'text'], ['bplStatus', 'BPL status', 'select', ['Prefer not to say', 'No', 'Yes']], ['labourCardNumber', 'Labour / construction worker card number', 'text'], ['eShramNumber', 'e-Shram UAN (if applicable)', 'text'], ['uanNumber', 'EPFO UAN (if applicable)', 'text'], ['farmerRegistrationNumber', 'Farmer registration ID (if applicable)', 'text'], ['pmKisanId', 'PM-KISAN registration ID (if applicable)', 'text'], ['healthCardNumber', 'Ayushman Bharat / PM-JAY card number (if applicable)', 'text'], ['abhaNumber', 'ABHA health ID (optional)', 'text']
    ]
  },
  {
    id: 'family', title: 'Family & Household', description: 'Common details for ration cards, pensions, housing and family-benefit forms.', icon: Users,
    fields: [
      ['familyId', 'Family ID / Parivar Pehchan Patra (if applicable)', 'text'], ['rationCardNumber', 'Ration card number', 'text'], ['rationCardType', 'Ration card type', 'select', ['Not specified', 'AAY', 'BPL', 'PHH', 'APL / Other']], ['familyMembersCount', 'Number of family members', 'number'], ['dependentsCount', 'Number of dependents', 'number'], ['orphanStatus', 'Orphan / single-parent support category (if applicable)', 'select', ['Prefer not to say', 'Not applicable', 'Orphan', 'Single parent']], ['widowPensionStatus', 'Widow / destitute pension status (if applicable)', 'select', ['Not applicable', 'Applying', 'Receiving', 'Not receiving']], ['seniorCitizenStatus', 'Senior citizen status', 'select', ['Not applicable', 'Yes', 'No']]
    ]
  },
  {
    id: 'land', title: 'Agriculture & Property', description: 'Optional fields for farmer, housing and land-related schemes.', icon: Landmark,
    fields: [
      ['landOwnership', 'Own agricultural land?', 'select', ['Not specified', 'No', 'Yes']], ['landSizeAcres', 'Agricultural land size (acres)', 'number'], ['landRecordNumber', 'Khasra / Khatauni / survey number', 'text'], ['landRecordDistrict', 'Land record district', 'text'], ['landRecordVillage', 'Land record village', 'text'], ['propertyOwnership', 'Own a house / property?', 'select', ['Not specified', 'No', 'Yes']], ['pmAwasApplicationId', 'PMAY / housing application ID (if applicable)', 'text']
    ]
  },
  {
    id: 'bank', title: 'Bank & Direct Benefit Transfer (DBT)', description: 'Use details exactly as printed in your passbook. These fields are optional.', icon: Landmark,
    fields: [
      ['accountHolderName', 'Account holder name', 'text'], ['bankName', 'Bank name', 'text'], ['bankAccountNumber', 'Bank account number', 'text'], ['ifscCode', 'IFSC code', 'text'], ['branch', 'Bank branch', 'text'], ['accountType', 'Account type', 'select', ['Not specified', 'Savings', 'Current', 'Jan Dhan']], ['dbtEnabled', 'DBT enabled in this account?', 'select', ['Not sure', 'Yes', 'No']], ['aadhaarBankSeedingStatus', 'Aadhaar-bank seeding status', 'select', ['Not checked', 'Seeded', 'Not seeded', 'Not applicable']]
    ]
  }
];

const inputClass = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300';

function ProfileField({ field, value, onChange }) {
  const [name, label, type, options] = field;
  return <div className="min-w-0">
    <label className={labelClass} htmlFor={`profile-${name}`}>{label}</label>
    {type === 'select' ? <select id={`profile-${name}`} name={name} value={value ?? ''} onChange={onChange} className={inputClass}>
      <option value="">Select if applicable</option>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select> : <input id={`profile-${name}`} name={name} type={type} value={value ?? ''} onChange={onChange} className={inputClass} min={type === 'number' ? '0' : undefined} max={name === 'disabilityPercentage' || name === 'marksPercentage' ? '100' : undefined} maxLength={name === 'pinCode' ? 6 : undefined} placeholder={type === 'number' ? 'Enter value' : 'Enter if applicable'} />}
  </div>;
}

export default function YourProfilePage() {
  const { profile, updateProfile } = useUserProfile();
  const [formData, setFormData] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const [activeGroup, setActiveGroup] = useState('personal');
  const [showAll, setShowAll] = useState(false);
  const activeGroupData = useMemo(() => groups.find(group => group.id === activeGroup) || groups[0], [activeGroup]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    updateProfile(formData);
    setSaved(true);
  };

  const handleReset = () => {
    setFormData({ ...profile });
    setSaved(false);
  };

  const filledCount = groups.flatMap(group => group.fields).filter(([name]) => String(formData[name] ?? '').trim() !== '').length;
  const totalCount = groups.reduce((count, group) => count + group.fields.length, 0);

  return <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-200"><UserRound className="h-3.5 w-3.5" /> YOUR PROFILE</div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Government Form Profile</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-slate-300">Save commonly requested details once to make future form filling easier. Every field is optional unless a specific application requires it.</p>
        </div>
        <div className="min-w-44 rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">Profile fields filled</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-700 dark:text-blue-300">{filledCount}<span className="text-sm font-semibold text-gray-400"> / {totalCount}</span></p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${Math.round((filledCount / totalCount) * 100)}%` }} /></div>
        </div>
      </div>
    </div>

    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
      <div className="flex items-start gap-2"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" /><p><strong>Privacy note:</strong> This project currently saves profile data in this browser's local storage; it is not encrypted cloud storage. Only enter sensitive identifiers on a device you trust. Saving a certificate number here does not verify the certificate or replace uploading its actual file when a portal asks for it.</p></div>
    </div>

    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
        <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wide text-gray-400">Profile sections</p>
        <div className="space-y-1">
          {groups.map(group => {
            const Icon = group.icon;
            const selected = activeGroup === group.id;
            return <button key={group.id} type="button" onClick={() => setActiveGroup(group.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${selected ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700'}`}>
              <Icon className="h-4 w-4 shrink-0" /><span>{group.title}</span>
            </button>;
          })}
        </div>
        <button type="button" onClick={() => setShowAll(value => !value)} className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">{showAll ? 'Show one section' : 'Show all sections'}</button>
      </aside>

      <form onSubmit={handleSave} className="space-y-5">
        {(showAll ? groups : [activeGroupData]).map(group => {
          const Icon = group.icon;
          return <section key={group.id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="mb-5 flex items-start gap-3 border-b border-gray-100 pb-4 dark:border-slate-700">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Icon className="h-5 w-5" /></div>
              <div><h2 className="font-bold text-gray-900 dark:text-white">{group.title}</h2><p className="mt-1 text-xs leading-5 text-gray-500 dark:text-slate-400">{group.description}</p></div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {group.fields.map(field => <ProfileField key={field[0]} field={field} value={formData[field[0]]} onChange={handleChange} />)}
            </div>
          </section>;
        })}
        <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
          <div className="text-xs text-gray-500 dark:text-slate-400">{saved ? <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Profile saved in this browser</span> : 'Remember to save your changes.'}</div>
          <div className="flex gap-2">
            <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"><RotateCcw className="h-4 w-4" /> Reset unsaved edits</button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-800"><Save className="h-4 w-4" /> Save profile</button>
          </div>
        </div>
      </form>
    </div>
  </div>;
}
