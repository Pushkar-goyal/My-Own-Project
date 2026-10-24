BHARAT SATHI AI - RUN KARNE KA TARIKA (Windows / VS Code)

IMPORTANT: ZIP extract karne ke baad isi folder ko VS Code mein kholo. Is folder ke andar package.json aur src folder seedhe dikhne chahiye. Ab extra 'project' subfolder nahi hai.

OPTION 1 (easy):
1. ZIP ko Extract All karo.
2. Extracted folder mein START.bat par double-click karo.
3. Pehli baar npm dependencies download hongi; internet zaroori hai.
4. Terminal mein Local: http://localhost:5173/ jaisa URL aaye to use browser mein kholo.
5. Server band karne ke liye terminal mein Ctrl+C dabao.

OPTION 2 (VS Code):
1. File > Open Folder > extracted folder select karo (jahan package.json hai).
2. Terminal > New Terminal.
3. Commands:
   npm install
   npm run dev
4. Terminal mein jo Local URL aaye use browser mein kholo.

AGAR ERROR AAYE:
- 'ENOENT package.json': galat folder open hua hai. Wahi folder kholo jahan package.json seedha dikh raha ho.
- 'vite is not recognized' / 'vite not found': npm install complete nahi hua. npm install dobara chalao.
- Network / ECONNRESET / ETIMEDOUT: internet ya npm registry connection issue; exact error share karo.
- Port busy: Vite doosra port (jaise 5174) de sakta hai; terminal mein dikhaya gaya URL hi kholo.

FEATURE NOTE:
Caste/category quick input aur Vault-based document-label matching prototype ka hissa hain. Vault abhi PDF/photo ke andar ka text OCR se read ya certificate verify nahi karta. Scheme results potential matches hain, final eligibility guarantee nahi.

Project: React 18 + Vite + Tailwind CSS. No backend required for local prototype.
