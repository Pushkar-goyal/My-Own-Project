import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import HomePage from './pages/HomePage';
import DocumentGuidePage from './pages/DocumentGuidePage';
import FindSchemePage from './pages/FindSchemePage';
import ResultsPage from './pages/ResultsPage';
import CitizenVaultPage from './pages/CitizenVaultPage';
import ApplicationHistoryPage from './pages/ApplicationHistoryPage';
import PortalUploadPage from './pages/PortalUploadPage';
import YourProfilePage from './pages/YourProfilePage';
import AuthModal from './components/auth/AuthModal';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { UserProfileProvider } from './context/UserProfileContext';
import { DocumentVaultProvider } from './context/DocumentVaultContext';
import { ApplicationHistoryProvider } from './context/ApplicationHistoryContext';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [evaluatedResults, setEvaluatedResults] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  if (!isAuthenticated) {
    return <AuthModal forceOpen />;
  }

  const handleCalculateResults = (formDraft, result, allResults) => {
    if (result) {
      setEvaluatedResults(allResults || []);
      setSelectedResult(result);
      setActivePage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1 pt-6 pb-12">
        {activePage === 'home' && <HomePage setActivePage={setActivePage} setEvaluatedResults={setEvaluatedResults} />}

        {activePage === 'guide' && <DocumentGuidePage />}

        {activePage === 'find' && <FindSchemePage onCalculateResults={handleCalculateResults} />}

        {activePage === 'results' && selectedResult && (
          <ResultsPage
            result={selectedResult}
            allResults={evaluatedResults || []}
            onGoBack={() => setActivePage('find')}
          />
        )}

        {activePage === 'vault' && <CitizenVaultPage />}
        {activePage === 'profile' && <YourProfilePage />}
        {activePage === 'portal-upload' && <PortalUploadPage />}

        {activePage === 'history' && <ApplicationHistoryPage />}
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <UserProfileProvider>
            <DocumentVaultProvider>
              <ApplicationHistoryProvider>
                <AppContent />
              </ApplicationHistoryProvider>
            </DocumentVaultProvider>
          </UserProfileProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
