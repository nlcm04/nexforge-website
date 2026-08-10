@echo off
REM ── Nexforge: push this folder to GitHub (force-replaces the repo with these files) ──
cd /d "%~dp0"
echo Working in: %cd%
echo.

git init
git add -A
git commit -m "Nexforge website - latest content" 2>nul
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/nlcm04/nexforge-website.git

echo.
echo ===== PUSHING (force) =====
git push origin main --force

echo.
echo ===== LOCAL commit  =====
git rev-parse main
echo ===== REMOTE commit (must match the LOCAL line above) =====
git ls-remote origin refs/heads/main
echo.
echo If the two hashes match, the push worked. If you saw "Authentication failed"
echo or a login window, complete the GitHub sign-in and run this file again.
echo.
pause
