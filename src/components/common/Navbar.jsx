import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Search,
  UserCheck,
  History,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  CheckCircle,
  LogOut,
  Fingerprint,
  UploadCloud
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserProfile } from '../../context/UserProfileContext';
import { calculateProfileCompletion } from '../../utils/vaultHelpers';
import { useDocumentVault } from '../../context/DocumentVaultContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ activePage, setActivePage }) {
  const { lang, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { profile } = useUserProfile();
  const { documents } = useDocumentVault();
  const { user, logout, registerBiometric } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');

  const { percentage } = calculateProfileCompletion(profile, documents);

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Shield },
    { id: 'guide', label: t('navGuide'), icon: FileText },
    { id: 'find', label: t('navFindScheme'), icon: Search },
    { id: 'vault', label: t('navVault'), icon: UserCheck, badge: `${percentage}%` },
    { id: 'profile', label: 'Your Profile', icon: Fingerprint },
    { id: 'portal-upload', label: 'Portal Upload', icon: UploadCloud },
    { id: 'history', label: t('navHistory'), icon: History }
  ];

  const languageOptions = [
    { value: 'en', label: 'English', bg: 'bg-blue-100 dark:bg-blue-900' },
    { value: 'hi', label: 'हिन्दी', bg: 'bg-orange-100 dark:bg-orange-900' },
    { value: 'ta', label: 'தமிழ்', bg: 'bg-red-100 dark:bg-red-900' },
    { value: 'te', label: 'తెలుగు', bg: 'bg-green-100 dark:bg-green-900' },
    { value: 'bn', label: 'বাংলা', bg: 'bg-yellow-100 dark:bg-yellow-900' },
    { value: 'mr', label: 'मराठी', bg: 'bg-purple-100 dark:bg-purple-900' },
    { value: 'gu', label: 'ગુજરાતી', bg: 'bg-pink-100 dark:bg-pink-900' }
  ];

  const handleNav = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBiometricSetup = async () => {
    const result = await registerBiometric();
    setSecurityMessage(result.ok ? 'Device biometrics enabled.' : result.error);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-slate-800 glass-panel transition-colors duration-200">
      {/* Top Ashoka Pillar / Tricolor Branding Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand Name */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNav('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gov-blue to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-gov-navy dark:text-white">
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

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gov-blue text-white shadow-md shadow-gov-blue/25'
                      : 'text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 dark:text-slate-400'}`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Language, Theme & Vault Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 text-gray-700 dark:text-slate-100 text-xs font-bold shadow-sm ring-1 ring-blue-100 dark:ring-slate-600 hover:ring-2 transition-all"
                title="Choose language"
              >
                <Globe className="w-3.5 h-3.5 text-gov-blue dark:text-blue-400" />
                <span>{languageOptions.find((opt) => opt.value === lang)?.label}</span>
                <span
                  className={`text-[10px] transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`}
                >
                  ▼
                </span>
              </button>

              {/* Dropdown Menu */}
              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50 overflow-hidden">
                  {languageOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setLanguage(option.value);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm font-semibold transition-all ${
                        lang === option.value
                          ? `${option.bg} text-gray-900 dark:text-white border-l-4 border-gov-blue`
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
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-gov-blue dark:hover:text-blue-400 transition-colors shadow-sm"
              title="Toggle Light / Dark theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <div className="relative hidden sm:block">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex max-w-[180px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-left shadow-sm dark:border-slate-700 dark:bg-slate-800"
                title="Account and security"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gov-blue text-xs font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="truncate text-xs font-bold text-gray-700 dark:text-slate-100">
                  {user?.name}
                </span>
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                  <p className="px-3 py-2 text-xs text-gray-500 dark:text-slate-400">
                    {user?.email}
                  </p>
                  <button
                    onClick={handleBiometricSetup}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <Fingerprint className="h-4 w-4 text-emerald-600" /> Enable device biometrics
                  </button>
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-slate-700"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                  {securityMessage && (
                    <p className="px-3 py-2 text-[11px] text-emerald-700 dark:text-emerald-300">
                      {securityMessage}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Vault Button */}
            <button
              onClick={() => handleNav('vault')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Vault ({percentage}%)</span>
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-gov-blue text-white'
                    : 'text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
