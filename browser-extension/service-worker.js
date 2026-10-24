const ALLOWED_APP_ORIGINS = new Set(['http://localhost:5173', 'http://127.0.0.1:5173']);
const MAX_BASE64_CHARS = 14 * 1024 * 1024;

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  (async () => {
    const senderOrigin = sender.origin || (sender.url ? new URL(sender.url).origin : '');
    if (!ALLOWED_APP_ORIGINS.has(senderOrigin)) throw new Error('This Bharat Sathi app origin is not paired with the extension.');
    if (!message || message.type !== 'BHARAT_SATHI_ATTACH_FILE') throw new Error('Unsupported request.');
    if (typeof message.base64 !== 'string' || message.base64.length === 0 || message.base64.length > MAX_BASE64_CHARS) throw new Error('File data is missing or too large. Keep files under 10 MB.');
    if (typeof message.fileName !== 'string' || !message.fileName || message.fileName.length > 255 || /[\\/\u0000-\u001f]/.test(message.fileName) || typeof message.documentType !== 'string' || !message.documentType) throw new Error('File details are invalid.');

    const { targetTabId } = await chrome.storage.session.get('targetTabId');
    if (!Number.isInteger(targetTabId)) throw new Error('No connected portal tab. Open a supported portal and click “Connect & scan” in the extension first.');
    const tab = await chrome.tabs.get(targetTabId);
    const tabUrl = new URL(tab.url || '');
    if (tabUrl.protocol !== 'https:' || !(/(^|\.)gov\.in$/.test(tabUrl.hostname) || /(^|\.)nic\.in$/.test(tabUrl.hostname))) {
      throw new Error('The connected tab is not on a supported HTTPS .gov.in or .nic.in portal.');
    }

    const response = await chrome.tabs.sendMessage(targetTabId, {
      type: 'BHARAT_SATHI_ATTACH_FILE',
      base64: message.base64,
      fileName: message.fileName,
      mimeType: message.mimeType,
      documentType: message.documentType
    });
    if (!response?.ok) throw new Error(response?.error || 'Could not attach the file. Select a visible file field on the portal and try again.');
    sendResponse({ ok: true, message: response.message });
  })().catch(error => sendResponse({ ok: false, error: error.message || 'Extension request failed.' }));
  return true;
});
