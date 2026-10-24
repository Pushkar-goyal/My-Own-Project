import React, { useMemo, useState } from 'react';
import {
  AlertTriangle, BadgeCheck, CheckCircle2, ChevronDown, ChevronUp, FileCheck2,
  Globe2, Lightbulb, LockKeyhole, ShieldCheck, SlidersHorizontal, Sparkles,
  Target, TrendingUp
} from 'lucide-react';

function scoreTone(score) {
  if (score >= 80) return 'emerald';
  if (score >= 55) return 'amber';
  return 'rose';
}

export default function InnovationInsights({ result, allResults = [], profile }) {
  const { scheme } = result;
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [whatIfIncome, setWhatIfIncome] = useState(Number(profile?.annualIncome || 0));

  const similar = useMemo(() => allResults.filter(r => r.scheme.id !== scheme.id).slice(0, 3), [allResults, scheme.id]);
  const tone = scoreTone(result.matchScore);
  const colorMap = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    rose: 'bg-rose-50 border-rose-200 text-rose-800'
  };

  const currentWhatIf = { ...profile, annualIncome: whatIfIncome };
  const incomeRules = scheme.requirements?.filter(r => r.field === 'income') || [];
  const incomePasses = incomeRules.length === 0 || incomeRules.every(r => {
    if (r.operator === '<=') return whatIfIncome <= Number(r.value);
    if (r.operator === '>=') return whatIfIncome >= Number(r.value);
    return true;
  });

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-2xl border p-5 ${colorMap[tone]}`}>
          <div className="flex items-center justify-between mb-3"><span className="text-xs font-black uppercase tracking-wider">Match signal</span><Target className="w-5 h-5" /></div>
          <div className="flex items-end gap-2"><span className="text-4xl font-black">{result.matchScore}</span><span className="text-sm font-bold mb-1">/ 100</span></div>
          <p className="text-xs mt-2 opacity-80">A transparent product heuristic, not a government eligibility decision.</p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-900">
          <div className="flex items-center justify-between mb-3"><span className="text-xs font-black uppercase tracking-wider">Readiness</span><FileCheck2 className="w-5 h-5" /></div>
          <div className="text-2xl font-black">{result.documentScore}% documents</div>
          <p className="text-xs mt-2">{result.missingDocuments.length ? `${result.missingDocuments.length} document(s) still need attention.` : 'Required documents are present in your vault.'}</p>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-indigo-900">
          <div className="flex items-center justify-between mb-3"><span className="text-xs font-black uppercase tracking-wider">Trust layer</span><ShieldCheck className="w-5 h-5" /></div>
          <div className="text-lg font-black flex items-center gap-2"><BadgeCheck className="w-5 h-5" /> Source-linked</div>
          <p className="text-xs mt-2">Use the curated official portal link below. Verify current rules before applying.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-black text-gray-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-600" /> Why this is a potential match</h3>
          <div className="mt-4 space-y-2">
            {(result.strengths.length ? result.strengths : ['Your profile has some relevant signals for this scheme.']).map((item, i) => (
              <div key={i} className="flex gap-2 text-sm text-gray-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />{item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-black text-gray-900 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> What could block the application</h3>
          <div className="mt-4 space-y-2">
            {(result.blockers.length ? result.blockers : result.missingDocuments.length ? ['Documents need to be arranged.'] : ['No obvious blocker detected by this demo matcher.']).map((item, i) => (
              <div key={i} className="flex gap-2 text-sm text-gray-700 bg-amber-50 border border-amber-100 rounded-xl p-3"><AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />{item}</div>
            ))}
            {result.missingDocuments.slice(0, 3).map((doc) => <div key={doc} className="text-xs font-bold text-gray-500 pl-6">Missing document: {doc}</div>)}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button onClick={() => setShowWhatIf(!showWhatIf)} className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50">
          <div><div className="font-black text-gray-900 flex items-center gap-2"><SlidersHorizontal className="w-5 h-5 text-indigo-600" /> What-if eligibility simulator</div><p className="text-xs text-gray-500 mt-1">Explore how changing one profile factor affects this demo match. Your saved profile is not changed.</p></div>
          {showWhatIf ? <ChevronUp /> : <ChevronDown />}
        </button>
        {showWhatIf && (
          <div className="border-t p-5 bg-slate-50">
            <label className="text-xs font-black uppercase text-gray-500">Simulated annual income</label>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 items-center">
              <input type="range" min="0" max="1000000" step="10000" value={whatIfIncome} onChange={(e) => setWhatIfIncome(Number(e.target.value))} className="w-full" />
              <div className="font-black text-gray-900 min-w-[130px]">₹{whatIfIncome.toLocaleString('en-IN')}</div>
            </div>
            <div className={`mt-4 rounded-xl border p-3 text-sm font-bold ${incomePasses ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              {incomeRules.length ? (incomePasses ? 'Income condition passes in this simulation.' : 'Income condition does not pass in this simulation.') : 'This scheme does not use income as a matcher condition.'}
            </div>
          </div>
        )}
      </div>

      {similar.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-black text-gray-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" /> Other potential paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {similar.map(item => (
              <div key={item.scheme.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="text-sm font-bold text-gray-900 line-clamp-2">{item.scheme.name}</div>
                <div className="mt-3 flex justify-between text-xs"><span className="text-gray-500">Match signal</span><span className="font-black">{item.matchScore}/100</span></div>
                <div className="h-1.5 bg-gray-200 rounded-full mt-1"><div className="h-1.5 bg-blue-600 rounded-full" style={{width:`${item.matchScore}%`}} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-5">
        <div className="flex gap-3 items-start"><LockKeyhole className="w-5 h-5 text-emerald-300 shrink-0" /><div><div className="font-black">Citizen-first privacy note</div><p className="text-xs text-slate-300 mt-1">This prototype keeps profile/document matching on the client side. Do not enter real Aadhaar, bank or other sensitive numbers into a demo environment.</p></div></div>
      </div>
    </section>
  );
}
