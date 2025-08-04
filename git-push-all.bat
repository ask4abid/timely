@echo off
echo === AUTOMATED GIT PUSH SCRIPT ===
cd /d "d:\Personal\timely"

echo.
echo === Step 1: Current Directory ===
cd

echo.
echo === Step 2: Git Status ===
git status

echo.
echo === Step 3: Git Add All Files ===
git add .

echo.
echo === Step 4: Git Status After Add ===
git status

echo.
echo === Step 5: Git Commit ===
git commit -F ".git\COMMIT_EDITMSG"

echo.
echo === Step 6: Git Push to Origin Main ===
git push origin main

echo.
echo === COMPLETED ===
pause
