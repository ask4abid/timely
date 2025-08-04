Set-Location "d:\Personal\timely"

Write-Host "=== AUTOMATED GIT PUSH SCRIPT (PowerShell) ===" -ForegroundColor Green

Write-Host "`n=== Step 1: Current Directory ===" -ForegroundColor Yellow
Get-Location

Write-Host "`n=== Step 2: Git Status ===" -ForegroundColor Yellow
& git status

Write-Host "`n=== Step 3: Git Add All Files ===" -ForegroundColor Yellow
& git add .

Write-Host "`n=== Step 4: Git Status After Add ===" -ForegroundColor Yellow
& git status

Write-Host "`n=== Step 5: Git Commit ===" -ForegroundColor Yellow
& git commit -F ".git\COMMIT_EDITMSG"

Write-Host "`n=== Step 6: Git Push to Origin Main ===" -ForegroundColor Yellow
& git push origin main

Write-Host "`n=== COMPLETED ===" -ForegroundColor Green
Read-Host "Press Enter to continue"
