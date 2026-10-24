let selectedFileInput = null;
const originalOutlines = new WeakMap();

function visibleFileInputs() {
  return [...document.querySelectorAll('input[type="file"]')].filter(input => {
    const style = getComputedStyle(input);
    return !input.disabled && style.display !== 'none' && style.visibility !== 'hidden' && input.getClientRects().length > 0;
  });
}

function scanFields() {
  const fields = visibleFileInputs();
  fields.forEach((input, index) => {
    if (!originalOutlines.has(input)) originalOutlines.set(input, input.style.outline || '');
    input.dataset.bharatSathiField = String(index + 1);
    input.style.outline = '3px solid #f59e0b';
    input.style.outlineOffset = '3px';
    input.addEventListener('click', () => {
      selectedFileInput = input;
      input.style.outline = '3px solid #16a34a';
    });
    input.addEventListener('focus', () => {
      selectedFileInput = input;
      input.style.outline = '3px solid #16a34a';
    });
  });
  return fields.length;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'BHARAT_SATHI_SCAN_FIELDS') {
    const count = scanFields();
    sendResponse({ ok: true, count });
    return;
  }
  if (message?.type !== 'BHARAT_SATHI_ATTACH_FILE') return;
  try {
    if (!selectedFileInput || !selectedFileInput.isConnected || selectedFileInput.disabled) {
      sendResponse({ ok: false, error: 'First click the exact file-upload field on the portal page. Then return to Bharat Sathi and send the file again.' });
      return;
    }
    const binary = atob(message.base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const file = new File([bytes], message.fileName, { type: message.mimeType || 'application/octet-stream' });
    const transfer = new DataTransfer();
    transfer.items.add(file);
    selectedFileInput.files = transfer.files;
    selectedFileInput.dispatchEvent(new Event('input', { bubbles: true }));
    selectedFileInput.dispatchEvent(new Event('change', { bubbles: true }));
    selectedFileInput.style.outline = '3px solid #16a34a';
    sendResponse({ ok: true, message: `${message.documentType} attached to the selected file field. Review it on the portal before continuing.` });
  } catch (error) {
    sendResponse({ ok: false, error: 'This portal blocked programmatic file attachment or uses a custom uploader. Use the portal’s normal file chooser instead.' });
  }
});
