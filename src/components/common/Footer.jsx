import React from 'react';
import { Shield, Lock, Cpu, Globe, Heart } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: About */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gov-blue text-white flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-gov-navy dark:text-white">
                Digital Citizen
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
              Empowering Indian citizens to discover eligible welfare schemes, maintain digital documents securely in client-side storage, and submit scheme applications effortless.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Lock className="w-4 h-4" />
              <span>100% Client-Side Privacy</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-gov-blue dark:hover:text-blue-400 transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('guide')} className="hover:text-gov-blue dark:hover:text-blue-400 transition-colors">
                  22 Document Categories Directory
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('find')} className="hover:text-gov-blue dark:hover:text-blue-400 transition-colors">
                  Multi-Step Scheme Finder
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('vault')} className="hover:text-gov-blue dark:hover:text-blue-400 transition-colors">
                  My Citizen Vault
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('history')} className="hover:text-gov-blue dark:hover:text-blue-400 transition-colors">
                  Application Receipts & History
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Integrations & Future APIs */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Government Integrations
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>DigiLocker API Integration</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Aadhaar eKYC Service</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>UMANG Portal Gateway</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>eSign & Digital Certificates</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>OCR Auto Extraction Architecture</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Privacy & Standards */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Security & Compliance
            </h4>
            <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
              Designed according to Digital Personal Data Protection (DPDP) standards. All uploaded documents are stored in client IndexedDB. No external servers receive your private records.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-gray-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-gray-700 dark:text-slate-300">
                IndexedDB v1.0
              </span>
              <span className="px-2.5 py-1 rounded bg-gray-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-gray-700 dark:text-slate-300">
                React 18 + Vite
              </span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Digital Citizen Assistant. Built for Indian Citizens.</p>
          <div className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for Accessibility & Public Governance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
