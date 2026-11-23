@echo off
cd "C:\Users\PC Paradise\Documents\MORTJI MARKET\ryad-alaqsa-app"
git add -A
git status --short
git commit -m "feat: rebuild Amazigh section with real content - word audio, real images, 48 lessons"
git push origin main
echo.
echo === COMMIT SUCCESSFUL ===
pause