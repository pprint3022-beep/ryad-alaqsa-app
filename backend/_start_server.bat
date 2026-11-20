@echo off
cd /d "C:\Users\PC Paradise\Documents\MORTJI MARKET\ryad-alaqsa-app\backend"
start /B node server.js
timeout /t 3 /nobreak >nul
echo SERVER_STARTED