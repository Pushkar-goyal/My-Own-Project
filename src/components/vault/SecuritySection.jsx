import React, { useState, useRef } from 'react';
import { Lock, Unlock, Download, Upload, Trash2, Key, ShieldCheck, Cpu, LogOut } from 'lucide-react';
import { digilockerService } from '../../services/integrations/digilockerService';
import { aadhaarEkycService } from '../../services/integrations/aadhaarEkycService';
import { esignService } from '../../services/integrations/esignService';

export default function SecuritySection({
  profile,
  importProfileData,
  clearAllVaultProfile,
  isVaultLocked,
  lockVaultWithPIN,
  unlockVaultWithPIN
}) {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');
  const [integrationStatus, setIntegrationStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleSetPIN = (e) => {
    e.preventDefault();
    if (pinInput.length < 4) {
      setPinError('PIN must be at least 4 digits');
      return;
    }
    lockVaultWithPIN(pinInput);
    setPinError('');
    setPinSuccessMsg('Vault PIN locked successfully!');
    setPinInput('');
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    const success = unlockVaultWithPIN(pinInput);
    if (!success) {
      setPinError('Incorrect Vault PIN');
    } else {
      setPinError('');
      setPinInput('');
      setPinSuccessMsg('Vault unlocked!');
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `citizen_vault_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const success = importProfileData(parsed);
        if (success) {
          alert('Citizen Vault profile backup imported successfully!');
        } else {
          alert('Invalid backup format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleTestDigiLocker = async () => {
    setIntegrationStatus('Connecting to DigiLocker OAuth2 Gateway...');
    const res = await digilockerService.connectAccount();
    setIntegrationStatus(`DigiLocker Connected! Status: ${res.status} (ID: ${res.digilockerId})`);
  };

  const handleTestEKYC = async () => {
    setIntegrationStatus('Requesting Aadhaar eKYC OTP...');
    const res = await aadhaarEkycService.sendOTP(profile.aadhaarNumber || '9012');
    setIntegrationStatus(`Aadhaar eKYC: ${res.message}`);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Lock / Unlock Vault PIN */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl text-white ${isVaultLocked ? 'bg-amber-500' : 'bg-emerald-500'}`}>
              {isVaultLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {isVaultLocked ? 'Vault Security Lock Active' : 'Vault Passcode & Security Lock'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Set a security PIN to prevent unauthorized access to sensitive documents.
              </p>
            </div>
          </div>
        </div>

        {isVaultLocked ? (
          <form onSubmit={handleUnlock} className="flex items-center gap-3 pt-2">
            <input
              type="password"
              placeholder="Enter 4-digit PIN to Unlock"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-xs font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow"
            >
              Unlock Vault
            </button>
          </form>
        ) : (
          <form onSubmit={handleSetPIN} className="flex items-center gap-3 pt-2">
            <input
              type="password"
              placeholder="Set 4-digit Security PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-xs font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gov-blue hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow"
            >
              Lock Vault Now
            </button>
          </form>
        )}

        {pinError && <p className="text-xs text-red-500 font-semibold">{pinError}</p>}
        {pinSuccessMsg && <p className="text-xs text-emerald-600 font-semibold">{pinSuccessMsg}</p>}
      </div>

      {/* 2. Backup Export & Import */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-gov-blue dark:text-blue-400" />
          <span>Data Portability (Export & Import Profile)</span>
        </h3>
        <p className="text-xs text-gray-500 dark:text-slate-400">
          Save an encrypted JSON backup of your demographic data or restore an existing backup on a new device.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow"
          >
            <Download className="w-4 h-4" />
            <span>Export Profile Backup (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-xl text-xs font-bold"
          >
            <Upload className="w-4 h-4" />
            <span>Import Profile Backup (JSON)</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all Citizen Vault data from local storage?')) {
                clearAllVaultProfile();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* 3. Future Integrations Stubs */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-500" />
          <span>Government Gateway API Integrations (Future Service Layer)</span>
        </h3>
        <p className="text-xs text-gray-500 dark:text-slate-400">
          Modular service interfaces prepared for live connection to national government APIs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <button
            onClick={handleTestDigiLocker}
            className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-left hover:border-gov-blue transition-colors"
          >
            <span className="font-bold text-gray-900 dark:text-white block">DigiLocker API</span>
            <span className="text-[11px] text-gray-500">Connect & pull verified identity cards</span>
          </button>

          <button
            onClick={handleTestEKYC}
            className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-left hover:border-gov-blue transition-colors"
          >
            <span className="font-bold text-gray-900 dark:text-white block">Aadhaar eKYC</span>
            <span className="text-[11px] text-gray-500">Verify demographic identity with OTP</span>
          </button>

          <button
            onClick={() => setIntegrationStatus('Logout from all active sessions triggered (Placeholder).')}
            className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-left hover:border-red-500 transition-colors"
          >
            <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>Logout All Devices</span>
            </span>
            <span className="text-[11px] text-gray-500">Invalidate remote OAuth tokens</span>
          </button>
        </div>

        {integrationStatus && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-xs font-mono text-gov-blue dark:text-blue-400">
            [API Log]: {integrationStatus}
          </div>
        )}
      </div>

    </div>
  );
}
