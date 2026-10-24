import React from 'react';
import { Search, FileText, Compass, List, ArrowRight, Activity, Users } from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { useDocumentVault } from '../context/DocumentVaultContext';
import { matchSchemes } from '../utils/eligibilityMatcher';
import schemesData from '../data/schemes.json';
import SchemeCard from '../components/SchemeCard';

export default function HomePage({ setActivePage, setEvaluatedResults }) {
  const { profile } = useUserProfile();
  const { documents } = useDocumentVault();

  // Evaluate schemes for the dashboard
  const heldDocs = documents.filter(d => d.status === 'Available').map(d => d.documentType);
  const results = matchSchemes(profile, heldDocs, schemesData);
  
  const readyCount = results.filter(r => r.status === 'Ready to Explore').length;
  const almostReadyCount = results.filter(r => r.status === 'Almost Ready').length;

  const handleFindBenefits = () => {
    setEvaluatedResults(results);
    setActivePage('find');
  };

  return (
    <div className="space-y-12 pb-12">
      
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 pt-16 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Find the benefits you're eligible to explore.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            One profile. Your documents. Relevant benefits. A clear path to apply.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={handleFindBenefits}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg transition-all"
            >
              Find My Benefits
            </button>
            <button
              onClick={() => setActivePage('vault')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-base shadow-sm transition-all"
            >
              Check My Documents
            </button>
          </div>
          
          <div className="pt-8 text-sm text-gray-500 font-medium">
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
              <span>Your Profile &rarr; Your Documents &rarr; Potential Benefits &rarr; Action Plan &rarr; Application Ready</span>
            </div>
            <p className="mt-4 text-xs">
              Privacy-conscious design. Eligibility should be verified with the official scheme source.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Dashboard Snapshot */}
        {profile && (
          <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Benefit Snapshot</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-3xl font-black text-gray-900">{results.length}</div>
                <div className="text-sm font-medium text-gray-600">Potential Benefits</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-3xl font-black text-emerald-700">{readyCount}</div>
                <div className="text-sm font-medium text-emerald-700">Ready to Explore</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="text-3xl font-black text-amber-700">{almostReadyCount}</div>
                <div className="text-sm font-medium text-amber-700">Almost Ready</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setActivePage('vault')}>
                <div className="text-3xl font-black text-blue-700">{heldDocs.length}</div>
                <div className="text-sm font-medium text-blue-700">Documents Available</div>
              </div>
            </div>
            <button onClick={handleFindBenefits} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
              View your personalized results <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        )}

        {/* Life Situations */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore by Life Situation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Starting College', 'Looking for a Job', 'Farming / Agriculture', 'Starting a Business'].map(situation => (
              <div key={situation} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer text-center">
                <Compass className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900">{situation}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
