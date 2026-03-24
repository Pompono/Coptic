@echo off
setlocal

set "PROJECT_DIR=C:\Users\Pompono\Desktop\Coptic\Coptic-main"

echo Starting Next.js production preview for phone testing...
echo This builds the app and serves it on your LAN at port 3000.
start "Coptic Phone Preview" cmd /k "cd /d %PROJECT_DIR% && npm.cmd run preview:phone"

echo.
echo Open window launched:
echo - Coptic Phone Preview
echo.
echo Use your computer's local network IP with port 3000 on your phone.
