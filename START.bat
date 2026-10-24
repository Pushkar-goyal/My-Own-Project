@echo off
setlocal
cd /d "%~dp0"
title Bharat Sathi AI - Start

echo ==============================================
echo   Bharat Sathi AI - Local Development Server
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not in PATH.
  echo Install the current LTS version from https://nodejs.org/ and reopen VS Code.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm is not available. Reinstall Node.js and reopen this window.
  pause
  exit /b 1
)

echo Node version:
node --version
echo npm version:
npm --version
echo.

if not exist "node_modules\vite\bin\vite.js" (
  echo Installing project dependencies. Internet connection is required...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo ERROR: Dependency installation failed.
    echo Check internet, then run: npm install
    echo If the error mentions EADDRINUSE or permissions, share that exact error.
    pause
    exit /b 1
  )
)

echo.
echo Starting development server...
call npm run dev
if errorlevel 1 (
  echo.
  echo The server stopped with an error. Share the terminal output for a fix.
  pause
  exit /b 1
)
endlocal
