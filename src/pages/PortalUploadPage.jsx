import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, ExternalLink, FileText, ShieldCheck, Upload, AlertTriangle, Download, Link2, Loader2 } from 'lucide-react';
import { useDocumentVault } from '../context/DocumentVaultContext';

const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const portalExamples = [
  { label: 'National Scholarship Portal (NSP)', url: 'https://scholarships.gov.in/', docs: ['Aadhaar Card', 'Marksheet', 'Income Certificate', 'Bank Passbook / Cancelled Cheque', 'Caste Certificate'] },
  { label: 'PM-KISAN', url: 'https://pmkisan.gov.in/', docs: ['Aadhaar Card', 'Bank Passbook / Cancelled Cheque', 'Land Patta / Khasra-Khatauni'] },
  { label: 'Generic official portal', url: '', docs: ['Aadhaar Card', 'Income Certificate', 'Domicile Certificate', 'Marksheet'] }
];

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(new Error('Could not read the saved file.'));
    reader.readAsDataURL(blob);
  });
}

function sendToExtension(extensionId, payload) {
  return new Promise((resolve, reject) => {
    const runtime = window.chrome?.runtime;
    if (!runtime?.sendMessage) return reject(new Error('Chrome/Edge extension messaging is unavailable. Use Chrome or Edge and install the helper extension.'));
    runtime.sendMessage(extensionId, payload, response => {
      const lastError = runtime.lastError;
      if (lastError) return reject(new Error('Extension connection failed. Check the extension ID, app origin, and that the extension is enabled.'));
      if (!response?.ok) return reject(new Error(response?.error || 'The extension could not attach this file.'));
      resolve(response);
    });
  });
}

export default function PortalUploadPage() {
  const { documents, getStoredFile } = useDocumentVault();
  const [portalIndex, setPortalIndex] = useState('0');
  const [selected, setSelected] = useState({});
  const [message, setMessage] = useState('');
  const [extensionId, setExtensionId] = useState(() => localStorage.getItem('bharat_sathi_extension_id') || '');
  const [sendingId, setSendingId] = useState(null);
  const portal = portalExamples[Number(portalIndex)];
  const matched = useMemo(() => portal.docs.map(required => ({
    required,
    doc: documents.find(d => norm(d.documentType) === norm(required) || norm(d.documentType).includes(norm(required)) || norm(required).includes(norm(d.documentType)))
  })).map(x => ({ ...x, realFile: Boolean(x.doc && !x.doc.demoOnly && x.doc.id && x.doc.fileName) })), [portal, documents]);

  const toggle = name => setSelected(prev => ({ ...prev, [name]: !prev[name] }));
  const saveExtensionId = value => {
    setExtensionId(value.trim());
    localStorage.setItem('bharat_sathi_extension_id', value.trim());
  };
  const openPortal = () => {
    if (!portal.url) {
      setMessage('Choose a specific official portal first. This demo does not guess unknown portal URLs.');
      return;
    }
    window.open(portal.url, '_blank', 'noopener,noreferrer');
    setMessage('Portal opened. On that tab, click the Bharat Sathi extension → Connect & scan portal. Click the exact upload field so it turns green, then return here.');
  };
  const downloadManifest = async () => {
    const rows = [];
    for (const item of matched.filter(x => selected[x.required] && x.realFile)) {
      const stored = await getStoredFile(item.doc);
      rows.push({ requiredDocument: item.required, fileName: stored?.name || item.doc.fileName, mimeType: stored?.mimeType || item.doc.mimeType, size: stored?.size || item.doc.size, storedInThisBrowser: true });
    }
    const blob = new Blob([JSON.stringify({ createdAt: new Date().toISOString(), portal: portal.label, note: 'Metadata only; this checklist does not contain document files.', documents: rows }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'bharat-sathi-upload-checklist.json'; a.click(); URL.revokeObjectURL(url);
    setMessage('Checklist downloaded. It contains metadata only, not the documents themselves.');
  };
  const attachSelectedFile = async item => {
    setMessage('');
    setSendingId(item.doc.id);
    try {
      if (!/^[a-p]{32}$/.test(extensionId)) throw new Error('Enter the 32-character Extension ID shown in the helper extension popup.');
      const stored = await getStoredFile(item.doc);
      if (!stored?.blob) throw new Error('The actual file was not found in browser storage. Please replace the file in Citizen Vault.');
      if (stored.size > 10 * 1024 * 1024) throw new Error('This file is larger than the 10 MB limit.');
      const base64 = await blobToBase64(stored.blob);
      const result = await sendToExtension(extensionId, { type: 'BHARAT_SATHI_ATTACH_FILE', base64, fileName: stored.name || item.doc.fileName, mimeType: stored.mimeType || item.doc.mimeType || 'application/octet-stream', documentType: item.required });
      setMessage(result.message || `${item.required} attached. Review it on the portal before continuing.`);
    } catch (error) {
      setMessage(error.message || 'Could not send the file to the extension.');
    } finally {
      setSendingId(null);
    }
  };

  return <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
    <div><p className="text-sm font-bold text-blue-700">BHARAT SATHI AI · DOCUMENT ASSISTANT</p><h1 className="text-3xl font-extrabold mt-2">Portal Upload Assistant</h1><p className="text-gray-600 mt-2">Select a saved Vault file and send it to a selected file field on a supported government portal. You stay in control of every attachment and final submission.</p></div>
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 flex gap-3"><ShieldCheck className="w-6 h-6 text-blue-700 shrink-0"/><div className="text-sm text-blue-950"><b>Privacy and compatibility</b><p className="mt-1">The selected file is sent from this browser tab to your installed extension, then to the file field you selected on the connected portal. The extension is limited to HTTPS .gov.in and .nic.in pages. It does not submit forms or bypass login, OTP, CAPTCHA, consent or portal restrictions. Some portals may block programmatic attachment.</p></div></div>
    <section className="bg-white border rounded-2xl p-5 space-y-4">
      <label className="block text-sm font-bold">Browser extension ID
        <input value={extensionId} onChange={e => saveExtensionId(e.target.value)} placeholder="Paste the ID shown in the extension popup" className="mt-2 w-full rounded-xl border p-3 font-mono text-sm" />
      </label>
      <p className="text-xs text-gray-500">Install the project’s <code>browser-extension</code> folder as an unpacked extension, then copy the Extension ID from its popup. This pairing currently supports the local app at <code>http://localhost:5173</code>.</p>
      <label className="block text-sm font-bold">Choose portal workflow
        <select value={portalIndex} onChange={e => { setPortalIndex(e.target.value); setSelected({}); setMessage(''); }} className="mt-2 w-full rounded-xl border p-3 bg-white">{portalExamples.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}</select>
      </label>
      <div className="space-y-3">{matched.map(item => <div key={item.required} className="flex flex-col sm:flex-row sm:items-center gap-3 border rounded-xl p-3">
        <input type="checkbox" checked={Boolean(selected[item.required])} onChange={() => toggle(item.required)} disabled={!item.realFile} className="w-4 h-4" aria-label={`Select ${item.required}`} />
        <div className="flex-1"><div className="font-semibold text-sm">{item.required}</div><div className="text-xs text-gray-500">{item.realFile ? `Saved locally: ${item.doc.fileName || item.doc.documentType}` : item.doc ? 'Demo status only — save an actual file in Citizen Vault' : 'Missing from Vault — add it first'}</div></div>
        {item.realFile ? <><CheckCircle2 className="w-5 h-5 text-emerald-600"/><button disabled={!selected[item.required] || Boolean(sendingId)} onClick={() => attachSelectedFile(item)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 disabled:bg-gray-300 text-white px-3 py-2 text-sm font-bold">{sendingId === item.doc.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>}Attach saved file</button></> : <AlertTriangle className="w-5 h-5 text-amber-600"/>}
      </div>)}</div>
      <div className="flex flex-wrap gap-3"><button onClick={downloadManifest} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 text-white px-4 py-3 font-bold"><Download className="w-4 h-4"/>Download checklist</button><button onClick={openPortal} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 font-bold"><ExternalLink className="w-4 h-4"/>Open official portal <ArrowRight className="w-4 h-4"/></button></div>
      {message && <p role="status" className="text-sm bg-slate-50 border rounded-lg p-3">{message}</p>}
    </section>
    <section className="grid md:grid-cols-2 gap-4"><div className="border rounded-2xl p-5"><Link2 className="w-6 h-6 text-blue-700"/><h2 className="font-bold text-lg mt-3">How to connect</h2><ol className="list-decimal pl-5 text-sm text-gray-600 mt-2 space-y-1"><li>Install the extension from <code>browser-extension</code>.</li><li>Open the official portal in another tab and click <b>Connect &amp; scan portal</b> in the extension.</li><li>Click the exact file-upload field on the portal; it should turn green.</li><li>Return here, select a saved Vault file and click <b>Attach saved file</b>.</li><li>Verify the filename on the portal. Submit the application yourself.</li></ol></div><div className="border rounded-2xl p-5"><FileText className="w-6 h-6 text-blue-700"/><h2 className="font-bold text-lg mt-3">Important limits</h2><p className="text-sm text-gray-600 mt-2">This is an initial bridge for standard file inputs on HTTPS .gov.in/.nic.in pages. It has not been validated against every portal. Custom upload widgets, multi-step verification or portal rules may prevent attachment; use the portal’s normal file picker if that happens.</p></div></section>
  </div>;
}
