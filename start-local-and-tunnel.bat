@echo off
setlocal

set "PROJECT_DIR=C:\Users\Pompono\Desktop\Coptic\Coptic-main"

echo Starting Next.js dev server...
start "Coptic Localhost" cmd /k "cd /d %PROJECT_DIR% && npm run dev"

echo.
echo Note: this uses the dev server, which is much slower on phones.
echo For smoother phone testing over LAN, run start-phone-preview.bat instead.

echo Waiting for localhost to come up...
timeout /t 5 /nobreak >nul

echo Starting Cloudflare tunnel...
start "Coptic Cloudflare Tunnel" cmd /k "cd /d %PROJECT_DIR% && cloudflared tunnel --url http://localhost:3000"

echo.
echo Open windows launched:
echo - Coptic Localhost
echo - Coptic Cloudflare Tunnel
echo.
echo If cloudflared is not installed or not on PATH, the tunnel window will show an error.
