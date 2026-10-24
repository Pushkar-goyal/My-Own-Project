import React, { useMemo, useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { useDocumentVault } from '../context/DocumentVaultContext';
import { matchSchemes } from '../utils/eligibilityMatcher';
import schemesData from '../data/schemes.json';
import SchemeCard from '../components/SchemeCard';
import { FileSearch, ShieldCheck, MapPin, Wallet, GraduationCap, Sprout, HeartPulse, Home, Briefcase, ClipboardList, AlertCircle } from 'lucide-react';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Puducherry', 'Chandigarh', 'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep'
];

const NEEDS = [
  { value: 'Any', label: 'Show all possible schemes', icon: ClipboardList },
  { value: 'Education & Scholarship', label: 'Education / Scholarship', icon: GraduationCap },
  { value: 'Farming / Agriculture', label: 'Farmer / Agriculture', icon: Sprout },
  { value: 'Healthcare', label: 'Healthcare / Insurance', icon: HeartPulse },
  { value: 'Housing', label: 'Housing / Home', icon: Home },
  { value: 'Employment & Livelihood', label: 'Employment / Livelihood', icon: Briefcase },
  { value: 'Financial Assistance', label: 'Financial help / Pension', icon: Wallet }
];

const DOC_INSIGHTS = [
  { label: 'Identity proof', docs: ['Aadhaar Card', 'PAN Card', 'Voter ID Card'] },
  { label: 'Caste / category proof', docs: ['Caste Certificate', 'OBC Certificate', 'EWS Certificate', 'SC Certificate', 'ST Certificate'] },
  { label: 'Income proof', docs: ['Income Certificate'] },
  { label: 'Residence proof', docs: ['Domicile Certificate', 'Residence Certificate'] },
  { label: 'Education proof', docs: ['Marksheet', 'Class 10 Marksheet', 'Class 12 Marksheet', 'College ID'] },
  { label: 'Bank proof', docs: ['Bank Passbook / Cancelled Cheque', 'Bank Passbook', 'Cancelled Cheque'] },
  { label: 'Land / farmer proof', docs: ['Land Patta / Khasra-Khatauni', 'Land Record', 'Khasra-Khatauni'] },
  { label: 'Family proof', docs: ['Ration Card (APL/BPL/AAY)', 'Ration Card', 'Family ID'] }
];

const fieldClass = 'mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white';

export default function FindSchemePage({ onCalculateResults }) {
  const { profile, updateProfile } = useUserProfile();
  const { documents } = useDocumentVault();
  const [quickInfo, setQuickInfo] = useState(() => ({
    state: profile.state || '',
    age: profile.age || (profile.dob ? String(Math.max(0, new Date().getFullYear() - new Date(profile.dob).getFullYear())) : ''),
    occupation: profile.occupation || '',
    annualFamilyIncome: profile.annualFamilyIncome || profile.annualIncome || '',
    casteCategory: profile.casteCategory || '',
    need: 'Any'
  }));
  const [hasSearched, setHasSearched] = useState(false);

  // Only real files count as documents in the Vault. Demo placeholders are intentionally ignored.
  const realVaultDocs = useMemo(
    () => documents.filter(doc => !doc.demoOnly && doc.fileName && doc.status === 'Available'),
    [documents]
  );
  const heldDocs = realVaultDocs.map(doc => doc.documentType);
  const docNames = heldDocs.map(name => String(name).toLowerCase());

  const detectedInsights = DOC_INSIGHTS.map(group => ({
    ...group,
    found: group.docs.some(name => docNames.some(saved => saved.includes(name.toLowerCase()) || name.toLowerCase().includes(saved)))
  }));
  const foundCount = detectedInsights.filter(group => group.found).length;
  const missingVault = detectedInsights.filter(group => !group.found);

  const profileForMatching = {
    ...profile,
    state: quickInfo.state,
    age: quickInfo.age === '' ? '' : Number(quickInfo.age),
    occupation: quickInfo.occupation,
    casteCategory: quickInfo.casteCategory,
    annualIncome: quickInfo.annualFamilyIncome === '' ? '' : Number(quickInfo.annualFamilyIncome),
    annualFamilyIncome: quickInfo.annualFamilyIncome === '' ? '' : Number(quickInfo.annualFamilyIncome)
  };

  const results = useMemo(() => {
    if (!hasSearched) return [];
    const matches = matchSchemes(profileForMatching, heldDocs, schemesData);
    if (quickInfo.need === 'Any') return matches;
    const keywordsByNeed = {
      'Education & Scholarship': ['education', 'student', 'scholarship', 'school', 'college'],
      'Farming / Agriculture': ['farm', 'agriculture', 'farmer', 'kisan', 'land'],
      Healthcare: ['health', 'medical', 'insurance', 'ayushman'],
      Housing: ['housing', 'Home', 'home', 'awas', 'shelter'],
      'Employment & Livelihood': ['employment', 'livelihood', 'job', 'worker', 'skill', 'business'],
      'Financial Assistance': ['financial', 'pension', 'income', 'assistance', 'welfare', 'social security']
    };
    const keywords = keywordsByNeed[quickInfo.need] || [];
    return matches.sort((a, b) => {
      const aText = `${a.scheme.category || ''} ${(a.scheme.lifeSituations || []).join(' ')} ${a.scheme.name || ''}`.toLowerCase();
      const bText = `${b.scheme.category || ''} ${(b.scheme.lifeSituations || []).join(' ')} ${b.scheme.name || ''}`.toLowerCase();
      const aRelevant = keywords.some(word => aText.includes(word));
      const bRelevant = keywords.some(word => bText.includes(word));
      return Number(bRelevant) - Number(aRelevant) || b.matchScore - a.matchScore;
    });
  }, [hasSearched, quickInfo, heldDocs, profile]);

  const essentialsComplete = Boolean(quickInfo.state && quickInfo.age !== '' && Number(quickInfo.age) >= 0 && quickInfo.occupation && quickInfo.annualFamilyIncome !== '' && Number(quickInfo.annualFamilyIncome) >= 0);

  const updateQuickInfo = (event) => {
    const { name, value } = event.target;
    setQuickInfo(prev => ({ ...prev, [name]: value }));
    setHasSearched(false);
  };

  const analyzeAndFind = (event) => {
    event.preventDefault();
    if (!essentialsComplete) return;
    updateProfile({
      state: quickInfo.state,
      age: Number(quickInfo.age),
      occupation: quickInfo.occupation,
      annualFamilyIncome: Number(quickInfo.annualFamilyIncome),
      annualIncome: Number(quickInfo.annualFamilyIncome),
      casteCategory: quickInfo.casteCategory
    });
    setHasSearched(true);
    onCalculateResults?.({ ...profileForMatching, state: quickInfo.state, age: Number(quickInfo.age), occupation: quickInfo.occupation, annualIncome: Number(quickInfo.annualFamilyIncome), annualFamilyIncome: Number(quickInfo.annualFamilyIncome), casteCategory: quickInfo.casteCategory });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <header className="max-w-3xl">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"><FileSearch className="h-4 w-4" /> SMART SCHEME MATCHING</div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Find schemes for you</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">Bas kuch basic details batao. Baaki available document types aur saved profile details ko use karke relevant schemes aur missing documents ki list banayenge.</p>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <form onSubmit={analyzeAndFind} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick details</h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">Only 4 required answers. Don't enter Aadhaar or bank account numbers here.</p>
          </div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">State / Union Territory <span className="text-rose-600">*</span>
            <select className={fieldClass} name="state" value={quickInfo.state} onChange={updateQuickInfo} required>
              <option value="">Choose your state</option>
              {STATES.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">Age (in years) <span className="text-rose-600">*</span>
            <input className={fieldClass} type="number" name="age" min="0" max="120" value={quickInfo.age} onChange={updateQuickInfo} placeholder="e.g. 19" required />
          </label>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">Current occupation <span className="text-rose-600">*</span>
            <select className={fieldClass} name="occupation" value={quickInfo.occupation} onChange={updateQuickInfo} required>
              <option value="">Choose occupation</option>
              {['Student', 'Farmer', 'Salaried employee', 'Self-employed / business', 'Daily-wage worker', 'Homemaker', 'Unemployed', 'Pensioner', 'Other'].map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">Annual family income (₹) <span className="text-rose-600">*</span>
            <input className={fieldClass} type="number" name="annualFamilyIncome" min="0" value={quickInfo.annualFamilyIncome} onChange={updateQuickInfo} placeholder="Approximate yearly amount" required />
          </label>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">Caste / reservation category <span className="font-normal text-gray-400">(optional)</span>
            <select className={fieldClass} name="casteCategory" value={quickInfo.casteCategory} onChange={updateQuickInfo}>
              <option value="">Prefer not to say / not sure</option>
              {['General', 'EWS', 'OBC-NCL', 'OBC (Creamy Layer)', 'SC', 'ST', 'Other'].map(item => <option key={item} value={item}>{item}</option>)}
            </select>
            <span className="mt-1 block text-xs font-normal text-gray-500 dark:text-slate-400">We use this only to filter potential schemes. A category or certificate is not verified automatically.</span>
          </label>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">What kind of help are you looking for? <span className="font-normal text-gray-400">(optional)</span>
            <select className={fieldClass} name="need" value={quickInfo.need} onChange={updateQuickInfo}>
              {NEEDS.map(need => <option key={need.value} value={need.value}>{need.label}</option>)}
            </select>
          </label>
          <button type="submit" disabled={!essentialsComplete} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-45"><FileSearch className="h-4 w-4" /> Analyze Vault & Find Schemes</button>
          <p className="text-xs leading-5 text-gray-500 dark:text-slate-400">Results are potential matches, not official eligibility approval. Check each scheme's current rules on its official portal.</p>
        </form>

        <div className="space-y-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Vault document analysis</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Based on actual files saved in this browser.</p>
              </div>
              <div className="rounded-xl bg-emerald-50 px-3 py-2 text-center dark:bg-emerald-950/40"><p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">{foundCount}/8</p><p className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">Groups found</p></div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {detectedInsights.map(group => <div key={group.label} className={`flex items-center gap-2 rounded-xl border p-3 text-sm ${group.found ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200' : 'border-gray-200 bg-gray-50 text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}><ShieldCheck className="h-4 w-4 shrink-0" /><span>{group.label}</span><span className="ml-auto text-xs font-bold">{group.found ? 'Found' : 'Missing'}</span></div>)}
            </div>
            {realVaultDocs.length === 0 && <div className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p>Abhi Vault mein koi real file saved nahi hai. Demo placeholders ko eligibility ke liye count nahi kiya jaayega. My Documents section mein documents add karo; phir yahan analysis update hoga.</p></div>}
            {realVaultDocs.length > 0 && <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">Detected document labels: {heldDocs.join(', ')}.</p>}
          </section>

          <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20">
            <h3 className="font-bold text-blue-950 dark:text-blue-100">What the Vault can analyse right now</h3>
            <ul className="mt-2 space-y-2 text-sm leading-5 text-blue-900 dark:text-blue-200">
              <li>• Which document types you have saved and which common document groups appear missing.</li>
              <li>• Details you already entered in Your Profile, where the scheme matcher uses those fields.</li>
              <li>• State, age, occupation, income and document requirements against the local scheme catalogue.</li>
            </ul>
            <p className="mt-3 text-xs leading-5 text-blue-800 dark:text-blue-300">Limitation: this version does not read or OCR the text inside PDFs/photos. A saved file label is not proof that the certificate is valid or that you qualify.</p>
          </section>
        </div>
      </div>

      <section className="space-y-4 pt-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{hasSearched ? 'Your potential scheme matches' : 'Your scheme matches will appear here'}</h2><p className="text-sm text-gray-600 dark:text-slate-300">{hasSearched ? `${results.length} schemes compared with your answers and Vault document list.` : 'Fill the four required details and run the analysis.'}</p></div>
          {hasSearched && <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-slate-400"><MapPin className="h-4 w-4" /> {quickInfo.state}</div>}
        </div>
        {!hasSearched ? <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800/50"><FileSearch className="mx-auto h-10 w-10 text-gray-400" /><p className="mt-3 font-bold text-gray-800 dark:text-white">Ready when you are</p><p className="mt-1 text-sm text-gray-500 dark:text-slate-400">We won't show results based on the old sample profile.</p></div> : results.length ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{results.map(result => <SchemeCard key={result.scheme.id} result={result} onClick={() => onCalculateResults?.(profileForMatching, result, results)} />)}</div> : <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800"><p className="font-bold text-gray-800 dark:text-white">No potential matches found yet.</p><p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Try changing your answers or add real documents to the Vault.</p></div>}
        {hasSearched && missingVault.length > 0 && <p className="text-xs text-gray-500 dark:text-slate-400">Vault groups not detected: {missingVault.map(item => item.label).join(', ')}. These are suggestions, not mandatory documents for every scheme.</p>}
      </section>
    </div>
  );
}
