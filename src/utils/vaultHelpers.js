/**
 * Calculates Profile Completion Percentage (0 - 100%)
 * based on required Citizen Vault sections and documents.
 */
export function calculateProfileCompletion(profile, vaultDocs = []) {
  if (!profile) return { percentage: 0, missingFields: [], missingDocs: [] };

  const requiredFields = [
    { key: 'fullName', label: 'Full Name', category: 'Personal' },
    { key: 'dob', label: 'Date of Birth', category: 'Personal' },
    { key: 'gender', label: 'Gender', category: 'Personal' },
    { key: 'mobileNumber', label: 'Mobile Number', category: 'Personal' },
    { key: 'email', label: 'Email Address', category: 'Personal' },
    { key: 'aadhaarNumber', label: 'Aadhaar Number', category: 'Personal' },
    { key: 'panNumber', label: 'PAN Number', category: 'Personal' },
    { key: 'maritalStatus', label: 'Marital Status', category: 'Personal' },
    { key: 'occupation', label: 'Occupation', category: 'Personal' },
    { key: 'annualIncome', label: 'Annual Income', category: 'Personal' },
    { key: 'casteCategory', label: 'Caste Category', category: 'Personal' },
    
    // Address
    { key: 'street', label: 'Street / Address', category: 'Address' },
    { key: 'city', label: 'City', category: 'Address' },
    { key: 'district', label: 'District', category: 'Address' },
    { key: 'state', label: 'State', category: 'Address' },
    { key: 'pinCode', label: 'PIN Code', category: 'Address' },

    // Bank
    { key: 'accountHolderName', label: 'Account Holder Name', category: 'Bank' },
    { key: 'bankName', label: 'Bank Name', category: 'Bank' },
    { key: 'bankAccountNumber', label: 'Bank Account Number', category: 'Bank' },
    { key: 'ifscCode', label: 'IFSC Code', category: 'Bank' },

    // Family
    { key: 'familyId', label: 'Family ID / Ration Card No', category: 'Family' }
  ];

  const coreDocsNeeded = [
    'Aadhaar Card',
    'PAN Card',
    'Income Certificate',
    'Caste Certificate',
    'Domicile / Residence Certificate',
    'Bank Passbook / Cancelled Cheque',
    'Passport Size Photograph'
  ];

  const missingFields = [];
  let filledFieldsCount = 0;

  requiredFields.forEach(f => {
    const val = profile[f.key];
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      filledFieldsCount++;
    } else {
      missingFields.push(f);
    }
  });

  const uploadedDocNames = vaultDocs.map(d => (d.name || d.documentType || '').toLowerCase());
  const missingDocs = [];
  let uploadedCoreDocsCount = 0;

  coreDocsNeeded.forEach(docName => {
    const exists = uploadedDocNames.some(d => d.includes(docName.toLowerCase()) || docName.toLowerCase().includes(d));
    if (exists) {
      uploadedCoreDocsCount++;
    } else {
      missingDocs.push(docName);
    }
  });

  const totalItems = requiredFields.length + coreDocsNeeded.length;
  const completedItems = filledFieldsCount + uploadedCoreDocsCount;
  const percentage = Math.min(100, Math.round((completedItems / totalItems) * 100));

  return {
    percentage,
    filledFieldsCount,
    totalFieldsCount: requiredFields.length,
    missingFields,
    uploadedCoreDocsCount,
    totalCoreDocsCount: coreDocsNeeded.length,
    missingDocs
  };
}
