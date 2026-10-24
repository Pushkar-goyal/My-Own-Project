# Digital Citizen Assistant - VS Code Ready Project

An Indian Government Welfare Scheme Finder & Secure **Citizen Vault** built using **React 18 + Vite + Tailwind CSS**.

## 🌟 Quick Start in VS Code

1. **Open Folder in VS Code**:
   ```bash
   code "C:\Users\Pushkar Goel\.gemini\antigravity\scratch\digital-citizen-assistant"
   ```
2. **Install Recommended Extensions**:
   When prompted by VS Code, click **"Install All"** to install:
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier - Code formatter
   - ES7+ React/Redux Snippets

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Launch Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Debug in VS Code**:
   Press `F5` in VS Code to start Chrome/Edge debugging using pre-configured `.vscode/launch.json`.

---

## 🏛️ Project Features

- **My Citizen Vault**: Local demographic data & IndexedDB binary document storage (Aadhaar, PAN, Passbooks, Income Certs). Sensitive data masking and PIN lock.
- **IRCTC-Style Auto-Fill**: Apply for government schemes with 1 click. Auto-fills form data and auto-attaches saved IndexedDB documents.
- **Smart Scheme Matcher**: Pure client-side pure calculation module (`matchSchemes(userProfile, schemes)`).
- **22 Category Document Directory**: Searchable guide detailing issuing authorities and digital availability.
- **Bilingual & Theme Support**: English / Hindi toggle & Light/Dark mode.
- **Printable Receipts**: Generate official application receipts with tracking IDs.

---

## 📁 Project Folder Structure

```
digital-citizen-assistant/
├── .vscode/
│   ├── settings.json         # VS Code format-on-save & Tailwind IntelliSense settings
│   ├── extensions.json       # Recommended extensions list
│   └── launch.json           # Chrome & Edge F5 Debugger configuration
├── src/
│   ├── components/
│   │   ├── common/           # Navbar, Footer, Modal, ProgressBar, ReceiptModal
│   │   ├── vault/            # PersonalInfo, Address, Family, Bank, Security, CompletionCard
│   │   ├── documents/        # DocumentCard, DocumentUploader, DocumentPreviewModal
│   │   ├── schemes/          # SchemeCard, AutoFillModal
│   │   └── form/             # StepIndicator, Step1-4 Wizard steps
│   ├── context/              # Profile, Vault, Application History, Lang, Theme Contexts
│   ├── data/                 # documents.json, schemes.json, translations.js
│   ├── services/             # localStorage, indexedDB, OCR stub, Government API stubs
│   ├── utils/                # eligibilityMatcher.js, formatters.js, vaultHelpers.js
│   ├── pages/                # Home, Guide, Find, Results, Vault, History pages
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```


## Vault-backed portal upload assistance (prototype)
- Real files selected in My Documents are stored in browser IndexedDB, not sent to a server.
- The Portal Upload page matches required document labels, builds a metadata-only checklist, and opens known official portal links.
- `browser-extension/` contains an optional Chrome/Edge extension starter that highlights standard file upload controls. It does not silently upload files or submit applications.
- Existing demo-only vault entries are marked as demo and must be replaced by actual files before being treated as ready.
- Always verify portal requirements and the selected files yourself.

## Vault-to-portal attachment bridge (initial version)
- Citizen Vault now saves selected PDF/JPG/PNG files locally in IndexedDB (maximum 10 MB per file).
- Portal Upload can send a selected Vault file through the optional Chrome/Edge extension to a selected standard file field on supported HTTPS `.gov.in` and `.nic.in` pages.
- This is an attachment helper, not an automatic application submitter. It does not bypass OTP/CAPTCHA/login or portal restrictions, and it may not work with custom upload widgets. Read `browser-extension/README.md` for setup and limitations.


## Smart Scheme Matching (Quick Intake + Vault Analysis)

The Find Scheme page now asks only for four required inputs (state/UT, age, occupation, and annual family income) plus an optional help category. It compares these inputs with the local scheme catalogue and the labels of real files saved in the Citizen Vault. Demo placeholder documents are not counted as held documents, and the old sample profile is cleared so fictional data does not affect scheme results.

Current limitation: this is document-type/metadata analysis, not OCR. The app does not read text inside PDF/image certificates, verify certificate authenticity, or guarantee eligibility. Results are potential matches and must be checked against each scheme's official rules.
