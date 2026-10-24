import React, { useState } from 'react';
import { Shield, Globe, Sun, Moon, Menu, X, CheckCircle, Search, FileText } from 'lucide-react';

export default function BharatSathiAIInterface() {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languageOptions = [
    { value: 'en', label: 'English', bg: 'bg-blue-100 dark:bg-blue-900' },
    { value: 'hi', label: 'हिन्दी', bg: 'bg-orange-100 dark:bg-orange-900' },
    { value: 'ta', label: 'தமிழ்', bg: 'bg-red-100 dark:bg-red-900' },
    { value: 'te', label: 'తెలుగు', bg: 'bg-green-100 dark:bg-green-900' },
    { value: 'bn', label: 'বাংলা', bg: 'bg-yellow-100 dark:bg-yellow-900' },
    { value: 'mr', label: 'मराठी', bg: 'bg-purple-100 dark:bg-purple-900' },
    { value: 'gu', label: 'ગુજરાતી', bg: 'bg-pink-100 dark:bg-pink-900' }
  ];

  const [currentLang, setCurrentLang] = useState('en');

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 transition-colors duration-200">
          {/* Top Ashoka Pillar / Tricolor Branding Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* Logo / Brand Name */}
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 dark:text-white">
                      Bharat Sathi AI
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                      GOV.IN
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium hidden sm:block">
                    Secure Citizen Vault & Scheme Finder
                  </p>
                </div>
              </div>

              {/* Right Action Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 text-gray-700 dark:text-slate-100 text-xs font-bold shadow-sm ring-1 ring-blue-100 dark:ring-slate-600 hover:ring-2 transition-all"
                    title="Choose language"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{languageOptions.find(opt => opt.value === currentLang)?.label}</span>
                    <span className={`text-[10px] transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {/* Dropdown Menu */}
                  {langDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50 overflow-hidden">
                      {languageOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setCurrentLang(option.value);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm font-semibold transition-all ${
                            currentLang === option.value
                              ? `${option.bg} text-gray-900 dark:text-white border-l-4 border-blue-600`
                              : 'text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span className="text-base">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
                  title="Toggle Light / Dark theme"
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>

                {/* Quick Vault Button */}
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Vault (82%)</span>
                </button>

                {/* Mobile Hamburger Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className={`${isDark ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' : 'bg-white'} py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8`}>
          <div className="max-w-7xl mx-auto">
            {/* Tagline Badge */}
            <div className="flex justify-center mb-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                isDark 
                  ? 'border-blue-500/20 bg-blue-500/10' 
                  : 'border-blue-200 bg-blue-50'
              }`}>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">✨</span>
                <span className={`text-sm font-semibold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Digital India Welfare Portal • IRCTC-Style Scheme Auto-Fill
                </span>
              </div>
            </div>

            {/* Hero Title */}
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold text-center mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Discover Government <br />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Schemes You Qualify For
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className={`text-center max-w-2xl mx-auto text-lg sm:text-xl mb-12 ${
              isDark ? 'text-slate-300' : 'text-gray-600'
            }`}>
              Save your details once in your secure local Citizen Vault and seamlessly apply with automated document attachment & zero repetitive forms.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1">
                <Search className="w-5 h-5" />
                Find My Scheme
                <span className="text-xl">→</span>
              </button>

              <button className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 font-bold text-lg transition-all transform hover:-translate-y-1 ${
                isDark
                  ? 'border-slate-600 text-slate-100 hover:bg-slate-700/50'
                  : 'border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}>
                <FileText className="w-5 h-5" />
                Browse Document Guide
              </button>
            </div>

            {/* Vault Status */}
            <div className="flex justify-center">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl border ${
                isDark
                  ? 'border-slate-700 bg-slate-800/50'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <span className={`text-sm font-semibold ${
                  isDark ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  My Citizen Vault Status:
                </span>
                <span className="text-sm font-bold text-emerald-500">82% Complete</span>
                <a href="#" className="text-sm font-semibold text-blue-500 hover:text-blue-600 underline">
                  Manage Vault
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* 
TAILWIND CSS CONFIGURATION NEEDED:
Make sure your tailwind.config.js includes:

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'gov-blue': '#1e40af',
        'gov-navy': '#001a4d',
      }
    }
  }
}
*/