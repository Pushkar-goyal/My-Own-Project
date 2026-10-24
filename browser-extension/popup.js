const status = document.getElementById('status');
document.getElementById('extensionId').textContent = chrome.runtime.id;

document.getElementById('scan').addEventListener('click', async () => {
  status.textContent = 'Connecting to the current portal…';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !/^https:\/\//.test(tab.url || '')) throw new Error('Open a supported HTTPS government portal first.');
    const host = new URL(tab.url).hostname;
    if (!(/(^|\.)gov\.in$/.test(host) || /(^|\.)nic\.in$/.test(host))) throw new Error('For safety, this helper only works on HTTPS .gov.in and .nic.in sites.');
    const result = await chrome.tabs.sendMessage(tab.id, { type: 'BHARAT_SATHI_SCAN_FIELDS' });
    await chrome.storage.session.set({ targetTabId: tab.id });
    status.textContent = result?.count
      ? `Connected to this portal. Found ${result.count} visible file field(s). Click the exact field you want to fill (it turns green), then switch to Bharat Sathi.`
      : 'Connected, but no visible standard file fields were found. The portal may use a custom uploader.';
  } catch (error) {
    status.textContent = error.message || 'Could not connect to this portal.';
  }
});
