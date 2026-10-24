import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Check, X, Clock, Calendar, CheckSquare, Info, Download, Copy, ChevronDown, ChevronUp, FileText, User, AlertTriangle } from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { useDocumentVault } from '../context/DocumentVaultContext';
import InnovationInsights from '../components/InnovationInsights';

const applicationStepsMap = {
  pm_kisan: [
    { step: 1, title: "Open Registration Page", action: "Click the big green button 'New Farmer Registration'", icon: "🖱️" },
    { step: 2, title: "Select Farmer Type", action: "Choose 'Rural Farmer' or 'Urban Farmer' as applicable", icon: "🌾" },
    { step: 3, title: "Enter Aadhaar Number", action: "Type your 12-digit Aadhaar number in the box and click 'Get OTP'", icon: "🔢" },
    { step: 4, title: "Verify OTP", action: "Enter the 6-digit OTP sent to your Aadhaar-linked mobile number", icon: "📱" },
    { step: 5, title: "Fill Personal Details", action: "Enter Name (as on Aadhaar), Date of Birth, Gender, Category", icon: "✏️" },
    { step: 6, title: "Fill Bank Details", action: "Enter Account Number, IFSC Code and Bank Name for DBT payment", icon: "🏦" },
    { step: 7, title: "Upload Documents", action: "Upload Land Patta / Khasra copy and Bank Passbook first page", icon: "📤" },
    { step: 8, title: "Submit & Save", action: "Click 'Save' button. Note down your Registration Number shown on screen", icon: "✅" },
  ],
  ayushman_bharat: [
    { step: 1, title: "Check Eligibility First", action: "Click 'Am I Eligible?' and enter your Ration Card or mobile number", icon: "🔍" },
    { step: 2, title: "Find Nearest Hospital", action: "Use 'Find Hospital' option to locate empanelled hospitals near you", icon: "🏥" },
    { step: 3, title: "Visit Hospital Help Desk", action: "Go to any empanelled hospital's Ayushman Bharat help desk with Aadhaar + Ration Card", icon: "🚶" },
    { step: 4, title: "Biometric Verification", action: "The hospital staff will verify your identity using Aadhaar biometrics", icon: "👆" },
    { step: 5, title: "Get Golden Card", action: "Your Ayushman Golden Card will be issued on the spot for free treatment", icon: "🥇" },
  ],
  post_matric_scholarship: [
    { step: 1, title: "Register as New Student", action: "Click 'Student Registration' → 'New Registration' on top menu", icon: "📝" },
    { step: 2, title: "Select State & Course", action: "Choose your State, then select your Course Type (Post-Matric)", icon: "🗺️" },
    { step: 3, title: "Fill Personal Details", action: "Enter Name, DOB, Aadhaar, Mobile, Email. All fields marked * are mandatory", icon: "✏️" },
    { step: 4, title: "Fill Academic Details", action: "Enter Institute Name, Course, Year, Roll Number, Marksheet details", icon: "🎓" },
    { step: 5, title: "Fill Income & Caste", action: "Enter Annual Family Income and upload Caste Certificate + Income Certificate", icon: "📄" },
    { step: 6, title: "Add Bank Details", action: "Enter your own Bank Account (not parent's) with IFSC code for scholarship credit", icon: "🏦" },
    { step: 7, title: "Upload All Documents", action: "Upload: Aadhaar, Marksheet, Caste Certificate, Income Certificate, Domicile, Bank Passbook", icon: "📤" },
    { step: 8, title: "Final Submit", action: "Click 'Final Submit' and take printout of your Application ID for tracking", icon: "✅" },
  ],
  pm_mudra_shishu: [
    { step: 1, title: "Open Udyami Mitra Portal", action: "Click 'Apply for Mudra Loan' on the homepage", icon: "🖱️" },
    { step: 2, title: "Select Loan Type", action: "Choose 'Shishu' (up to ₹50,000) for micro-enterprise", icon: "💰" },
    { step: 3, title: "Register / Login", action: "Click 'New User Registration' and fill your email and mobile number", icon: "👤" },
    { step: 4, title: "Fill Business Details", action: "Enter Business Name, Business Type, Business Address, and start date", icon: "🏪" },
    { step: 5, title: "Fill Personal Details", action: "Enter Aadhaar, PAN, Date of Birth, Category details", icon: "✏️" },
    { step: 6, title: "Enter Bank Details", action: "Enter your preferred bank where you want the loan credited", icon: "🏦" },
    { step: 7, title: "Upload Documents", action: "Upload: Aadhaar Card, PAN Card, Bank Statement (6 months)", icon: "📤" },
    { step: 8, title: "Submit & Track", action: "Submit application and note the Application Reference Number", icon: "✅" },
  ],
  nsap_old_age_pension: [
    { step: 1, title: "Go to NSAP Portal", action: "Click 'Apply for Pension' button on the homepage", icon: "🖱️" },
    { step: 2, title: "Select Scheme", action: "Choose 'IGNOAPS' (Old Age Pension) from the list of NSAP schemes", icon: "👴" },
    { step: 3, title: "Select State", action: "Choose your state - each state has its own application window", icon: "🗺️" },
    { step: 4, title: "Fill Applicant Details", action: "Enter Name, Age, Aadhaar, Address, Mobile Number", icon: "✏️" },
    { step: 5, title: "Upload Documents", action: "Upload: Aadhaar, Voter ID, Age Proof, Ration Card, Bank Passbook", icon: "📤" },
    { step: 6, title: "Submit at CSC / Gram Panchayat", action: "Many states require in-person submission at CSC or Gram Panchayat office. Print and carry this application", icon: "🏢" },
  ],
  pmay_gramin: [
    { step: 1, title: "Contact Gram Panchayat", action: "Visit your local Gram Panchayat office as PMAY-G enrollment is offline/survey-based", icon: "🏘️" },
    { step: 2, title: "Check SECC List", action: "On portal click 'Stakeholder' → 'IAY/PMAYG Beneficiary' to check if your name is in SECC-2011 list", icon: "📋" },
    { step: 3, title: "If name is listed", action: "Contact Block Development Officer (BDO) with Aadhaar + Bank Details for approval", icon: "✅" },
    { step: 4, title: "If name is not listed", action: "Submit application at Gram Panchayat with Aadhaar, Ration Card, Income Certificate for new inclusion", icon: "📝" },
    { step: 5, title: "Geo-tagging Required", action: "After approval, a field officer will visit to geo-tag your home site", icon: "📍" },
  ],
};

const defaultSteps = [
  { step: 1, title: "Open the Official Portal", action: "Click 'Apply on Official Portal' button below to open the registration page", icon: "🖱️" },
  { step: 2, title: "Register / Login", action: "Create new account or login with your existing credentials", icon: "👤" },
  { step: 3, title: "Fill Personal Details", action: "Enter Name, Aadhaar, Date of Birth, and contact details as required", icon: "✏️" },
  { step: 4, title: "Upload Documents", action: "Upload all required documents listed in the checklist below", icon: "📤" },
  { step: 5, title: "Submit Application", action: "Review all details and click Final Submit. Save the acknowledgment number", icon: "✅" },
];

export default function ResultsPage({ result, allResults = [], onGoBack }) {
  const { scheme, status, matchDetails, missDetails, heldDocuments, missingDocuments, metRequirements, totalRequirements } = result;
  const { profile } = useUserProfile();
  const { documents } = useDocumentVault();

  const [showKit, setShowKit] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const applicationSteps = applicationStepsMap[scheme.id] || defaultSteps;
  const availableDocs = documents.filter(d => d.status === 'Available').map(d => d.documentType);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const copyAllDetails = () => {
    const text = `
=== APPLICATION DETAILS FOR: ${scheme.name} ===

--- PERSONAL DETAILS ---
Full Name: ${profile.fullName || 'N/A'}
Date of Birth: ${profile.dob || 'N/A'}
Gender: ${profile.gender || 'N/A'}
Aadhaar Number: ${profile.aadhaarNumber || 'N/A'}
PAN Number: ${profile.panNumber || 'N/A'}
Mobile: ${profile.mobileNumber || 'N/A'}
Email: ${profile.email || 'N/A'}

--- ADDRESS ---
${profile.houseNumber || ''}, ${profile.street || ''}, ${profile.village || ''}
${profile.city || ''}, ${profile.district || ''}, ${profile.state || ''} - ${profile.pinCode || ''}

--- INCOME & OCCUPATION ---
Annual Income: ₹${profile.annualIncome || 'N/A'}
Occupation: ${profile.occupation || 'N/A'}
Caste Category: ${profile.casteCategory || 'N/A'}

--- BANK DETAILS ---
Account Holder: ${profile.accountHolderName || profile.fullName || 'N/A'}
Bank Name: ${profile.bankName || 'N/A'}
Account Number: ${profile.bankAccountNumber || 'N/A'}
IFSC Code: ${profile.ifscCode || 'N/A'}

--- AVAILABLE DOCUMENTS ---
${availableDocs.map(d => '✓ ' + d).join('\n') || 'None marked'}

--- MISSING DOCUMENTS ---
${missingDocuments.map(d => '✗ ' + d).join('\n') || 'None'}
    `.trim();
    copyToClipboard(text, 'all');
  };

  const fieldRows = [
    { label: "Full Name", value: profile.fullName, field: "fullName" },
    { label: "Date of Birth", value: profile.dob, field: "dob" },
    { label: "Aadhaar Number", value: profile.aadhaarNumber, field: "aadhaar" },
    { label: "PAN Number", value: profile.panNumber, field: "pan" },
    { label: "Mobile Number", value: profile.mobileNumber, field: "mobile" },
    { label: "Annual Income", value: profile.annualIncome ? `₹${profile.annualIncome}` : null, field: "income" },
    { label: "State", value: profile.state, field: "state" },
    { label: "District", value: profile.district, field: "district" },
    { label: "PIN Code", value: profile.pinCode, field: "pin" },
    { label: "Bank Account No.", value: profile.bankAccountNumber, field: "bank" },
    { label: "IFSC Code", value: profile.ifscCode, field: "ifsc" },
    { label: "Bank Name", value: profile.bankName, field: "bankname" },
    { label: "Caste Category", value: profile.casteCategory, field: "caste" },
  ].filter(r => r.value);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <button
        onClick={onGoBack}
        className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Benefits
      </button>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {scheme.category}
            </span>
            {scheme.level && (
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                {scheme.level}
              </span>
            )}
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              status === 'Ready to Explore' ? 'bg-emerald-100 text-emerald-700' :
              status === 'Almost Ready' ? 'bg-amber-100 text-amber-700' :
              'bg-rose-100 text-rose-700'
            }`}>
              {status}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">{scheme.name}</h1>
          <p className="text-gray-600 leading-relaxed">{scheme.description}</p>
          {scheme.benefits && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <span className="text-sm font-bold text-emerald-800">Benefit: {scheme.benefits}</span>
            </div>
          )}
        </div>

        {/* Innovation Layer */}
      <InnovationInsights result={result} allResults={allResults} profile={profile} />

      {/* Eligibility Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Check className="w-5 h-5 text-emerald-500" /> Why you qualify</h3>
            {matchDetails.map((d, i) => (
              <div key={i} className="flex gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-sm text-emerald-900 font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                {d.replace('✓ ', '')}
              </div>
            ))}
            {heldDocuments.map((doc, i) => (
              <div key={i} className="flex gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-sm text-emerald-900 font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ✅ {doc} — uploaded
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {(missDetails.length > 0 || missingDocuments.length > 0) && (
              <>
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> What is missing</h3>
                {missDetails.filter(d => !d.includes('Document needed')).map((d, i) => (
                  <div key={i} className="flex gap-3 bg-rose-50 p-3 rounded-xl border border-rose-100 text-sm text-rose-900 font-medium">
                    <X className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    {d.replace('✗ ', '')}
                  </div>
                ))}
                {missingDocuments.map((doc, i) => (
                  <div key={i} className="flex gap-3 bg-amber-50 p-3 rounded-xl border border-amber-100 text-sm text-amber-900 font-medium">
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    Document needed: {doc}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* STEP BY STEP GUIDE */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5">
          <h2 className="text-white font-extrabold text-xl flex items-center gap-3">
            <span className="text-2xl">🗺️</span>
            How to Apply — Step by Step Guide
          </h2>
          <p className="text-blue-100 text-sm mt-1">Exactly what to do on the government portal</p>
        </div>
        <div className="p-6 space-y-4">
          {applicationSteps.map((s, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm shadow">
                {s.step}
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{s.icon}</span>
                  <span className="font-bold text-gray-900 text-sm">{s.title}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{s.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APPLICATION KIT — PRE-FILLED DATA */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowKit(!showKit)}
          className="w-full flex items-center justify-between px-8 py-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div className="text-left">
              <div className="font-extrabold text-gray-900 text-lg">Your Application Kit</div>
              <div className="text-sm text-gray-500">Pre-filled details ready to copy-paste into the portal</div>
            </div>
          </div>
          {showKit ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {showKit && (
          <div className="border-t border-gray-100 p-6 space-y-6">
            {/* Copy All Button */}
            <button
              onClick={copyAllDetails}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${copiedField === 'all' ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {copiedField === 'all' ? <><Check className="w-4 h-4" /> Copied All Details!</> : <><Copy className="w-4 h-4" /> Copy All Details to Clipboard</>}
            </button>

            {/* Individual Fields */}
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="w-4 h-4" /> Your Details (click any field to copy)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fieldRows.map(row => (
                  <button
                    key={row.field}
                    onClick={() => copyToClipboard(row.value, row.field)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      copiedField === row.field
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">{row.label}</div>
                      <div className="text-sm font-bold text-gray-900 mt-0.5">{row.value}</div>
                    </div>
                    <div className={`flex-shrink-0 ml-2 ${copiedField === row.field ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {copiedField === row.field ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Status */}
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Documents Checklist for this Scheme
              </h4>
              <div className="space-y-2">
                {scheme.documents.map((doc, i) => {
                  const isAvailable = availableDocs.includes(doc);
                  return (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium ${
                      isAvailable ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}>
                      {isAvailable
                        ? <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        : <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                      <span>{doc}</span>
                      <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isAvailable ? 'Ready' : 'Need to arrange'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 font-medium">
                💡 <strong>Tip:</strong> Carry physical copies + digital copies (phone/pendrive) of all documents to the portal or CSC center. Most portals accept PDF or JPG under 1MB.
              </div>
            </div>

            {/* Deadline */}
            {scheme.deadline && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl">
                <Calendar className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-rose-500 uppercase">⚠️ Application Deadline</div>
                  <div className="text-sm font-extrabold text-rose-800">{scheme.deadline}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Readiness + Apply Button */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div>
          <div className="flex justify-between text-sm font-bold text-gray-900 mb-2">
            <span>Application Readiness</span>
            <span>{Math.round((metRequirements / (totalRequirements || 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${(metRequirements / (totalRequirements || 1)) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 text-right mt-1">{totalRequirements - metRequirements} requirements remaining</div>
        </div>

        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 text-base"
        >
          <span>Apply on Official Portal</span>
          <ExternalLink className="w-5 h-5" />
        </a>

        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
          <Info className="w-3 h-3" />
          Open the kit above and copy your details before clicking Apply.
        </p>
      </div>
    </div>
  );
}
