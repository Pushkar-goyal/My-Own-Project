# Bharat Sathi Portal Upload Helper — vault bridge (initial version)

This Chrome/Edge Manifest V3 extension connects the local Bharat Sathi app to a selected standard file field on supported HTTPS `.gov.in` and `.nic.in` pages. It sends only the file the user explicitly selects from Citizen Vault.

## Install locally
1. Run the app using `npm install` and `npm run dev`; keep it at `http://localhost:5173`.
2. Open `chrome://extensions` (Edge: `edge://extensions`) and turn on **Developer mode**.
3. Choose **Load unpacked** and select this project's `browser-extension` folder.
4. Open the extension popup and copy the **Extension ID**.
5. Return to Bharat Sathi → **Portal Upload**, paste the Extension ID and save it.
6. Open a supported HTTPS `.gov.in` or `.nic.in` portal in another tab. Click the extension → **Connect & scan portal**.
7. Click the exact file field on the portal page; it should turn green. If the browser opens a file chooser, cancel it.
8. Return to Bharat Sathi, select the matching saved Vault document, then click **Attach saved file**.
9. Confirm the file name and any portal preview. Complete the portal's own checks and submit yourself.

## Important limitations
- This initial bridge is paired only with `http://localhost:5173` and `http://127.0.0.1:5173`. A deployed app origin must be explicitly added to `externally_connectable.matches` and `ALLOWED_APP_ORIGINS` before pairing it.
- Works only with standard visible `input[type=file]` controls on HTTPS `.gov.in` and `.nic.in` hosts. Custom upload widgets, iframes, file validation, or portal security can block attachment.
- It does not enter passwords, bypass login/OTP/CAPTCHA, click final submit, or send files to a server itself. A file is placed into the selected portal input only after the user selects it in Bharat Sathi and chooses the target field.
- Test on a non-sensitive sample file first. Review the target portal, filename, and document preview before continuing. Do not use on a portal unless its rules allow this kind of assistance.
