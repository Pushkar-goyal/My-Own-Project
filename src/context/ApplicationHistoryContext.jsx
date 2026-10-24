import React, { createContext, useContext, useState, useEffect } from 'react';

const ApplicationHistoryContext = createContext();

const seedApplications = [
  {
    id: 'APP-2026-89102',
    schemeId: 'pm_scholarship',
    schemeName: 'PM Scholarship Scheme for Higher Education',
    category: 'Education & Student Aid',
    appliedDate: '2026-07-12',
    status: 'Pending Verification',
    applicantName: 'Rajesh Kumar Sharma',
    mobileNumber: '9876543210',
    aadhaarMasked: 'XXXX-XXXX-9012',
    attachedDocuments: [
      'Aadhaar Card',
      'Class 10th Marksheet / Passing Certificate',
      'Income Certificate',
      'Bank Passbook / Cancelled Cheque'
    ],
    referenceNumber: 'REF-GOV-90812-IN',
    nodalMinistry: 'Ministry of Human Resource Development'
  }
];

export function ApplicationHistoryProvider({ children }) {
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('scheme_application_history_v1');
      return saved ? JSON.parse(saved) : seedApplications;
    } catch (e) {
      return seedApplications;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('scheme_application_history_v1', JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to save application history:', e);
    }
  }, [applications]);

  const submitApplication = (scheme, userProfile, attachedDocs = []) => {
    const newApp = {
      id: 'APP-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000),
      schemeId: scheme.id,
      schemeName: scheme.name,
      category: scheme.category || 'Government Welfare',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted / Under Verification',
      applicantName: userProfile.fullName || 'Citizen Applicant',
      mobileNumber: userProfile.mobileNumber || '9876543210',
      aadhaarMasked: `XXXX-XXXX-${(userProfile.aadhaarNumber || '9012').slice(-4)}`,
      attachedDocuments: attachedDocs.length > 0 ? attachedDocs : (scheme.requiredDocuments || []),
      referenceNumber: 'REF-' + Math.floor(100000 + Math.random() * 900000),
      nodalMinistry: scheme.nodalMinistry || 'Government of India'
    };

    setApplications(prev => [newApp, ...prev]);
    return newApp;
  };

  return (
    <ApplicationHistoryContext.Provider value={{ applications, submitApplication }}>
      {children}
    </ApplicationHistoryContext.Provider>
  );
}

export const useApplicationHistory = () => useContext(ApplicationHistoryContext);
