@echo off
echo ===============================================
echo        TIMELY - Local Development Server
echo ===============================================
echo.
echo Available options:
echo.
echo 1. Direct Browser (Recommended for quick testing)
echo 2. Python HTTP Server (if Python installed)
echo 3. Node.js with npx (if Node.js installed)
echo 4. PowerShell HTTP Server (Windows 10+)
echo 5. Visual Studio Code Live Server Extension
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo Opening index.html directly in browser...
    start index.html
    echo.
    echo ✅ App opened in default browser!
    echo 📍 URL: file:///%cd%/index.html
    goto end
)

if "%choice%"=="2" (
    echo Starting Python HTTP Server...
    python -m http.server 3000
    goto end
)

if "%choice%"=="3" (
    echo Starting Node.js development server...
    echo Installing dependencies if needed...
    npm install
    echo Starting server...
    npm run dev
    goto end
)

if "%choice%"=="4" (
    echo Starting PowerShell HTTP Server...
    powershell -Command "Import-Module WebAdministration; New-Website -Name 'Timely' -Port 3000 -PhysicalPath '%cd%'"
    echo Server started at http://localhost:3000
    start http://localhost:3000
    goto end
)

if "%choice%"=="5" (
    echo Opening in VS Code with Live Server...
    code .
    echo.
    echo 📝 Instructions:
    echo 1. Install "Live Server" extension if not already installed
    echo 2. Right-click on index.html
    echo 3. Select "Open with Live Server"
    goto end
)

echo Invalid choice. Please run the script again.

:end
echo.
echo ===============================================
echo        Thanks for using Timely! 🕐
echo ===============================================
pause
