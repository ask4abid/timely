# TIMELY - Local Development Server Setup
# PowerShell script for running Timely locally

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "        TIMELY - Local Development Server" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

function Show-Menu {
    Write-Host "Available options:" -ForegroundColor Green
    Write-Host ""
    Write-Host "1. 🌐 Direct Browser (Quick & Simple)" -ForegroundColor White
    Write-Host "2. 🐍 Python HTTP Server" -ForegroundColor White
    Write-Host "3. 📦 Node.js with npx" -ForegroundColor White
    Write-Host "4. ⚡ PowerShell Simple Server" -ForegroundColor White
    Write-Host "5. 🔥 VS Code Live Server" -ForegroundColor White
    Write-Host "6. 🌍 Open all Timely versions" -ForegroundColor White
    Write-Host ""
}

function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

Show-Menu
$choice = Read-Host "Enter your choice (1-6)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Opening index.html directly in browser..." -ForegroundColor Green
        Invoke-Item "index.html"
        Write-Host ""
        Write-Host "✅ App opened in default browser!" -ForegroundColor Green
        Write-Host "📍 File location: $PWD\index.html" -ForegroundColor Cyan
    }
    
    "2" {
        if (Test-Command python) {
            Write-Host "🐍 Starting Python HTTP Server on port 3000..." -ForegroundColor Green
            Write-Host "🌐 Open: http://localhost:3000" -ForegroundColor Cyan
            Start-Process "http://localhost:3000"
            python -m http.server 3000
        } else {
            Write-Host "❌ Python not found. Please install Python first." -ForegroundColor Red
        }
    }
    
    "3" {
        if (Test-Command npm) {
            Write-Host "📦 Installing development dependencies..." -ForegroundColor Green
            npm install
            Write-Host "🚀 Starting Node.js development server..." -ForegroundColor Green
            npm run dev
        } else {
            Write-Host "❌ Node.js/npm not found. Please install Node.js first." -ForegroundColor Red
            Write-Host "💡 Download from: https://nodejs.org/" -ForegroundColor Yellow
        }
    }
    
    "4" {
        Write-Host "⚡ Starting simple PowerShell HTTP server..." -ForegroundColor Green
        $port = 3000
        $url = "http://localhost:$port"
        
        # Simple HTTP server using .NET
        Add-Type -AssemblyName System.Net.Http
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("$url/")
        $listener.Start()
        
        Write-Host "🌐 Server started at: $url" -ForegroundColor Cyan
        Start-Process $url
        
        Write-Host "📡 Server running... Press Ctrl+C to stop" -ForegroundColor Green
        
        try {
            while ($listener.IsListening) {
                $context = $listener.GetContext()
                $request = $context.Request
                $response = $context.Response
                
                $localPath = $request.Url.LocalPath
                if ($localPath -eq "/") { $localPath = "/index.html" }
                
                $filePath = Join-Path $PWD $localPath.TrimStart('/')
                
                if (Test-Path $filePath) {
                    $content = Get-Content $filePath -Raw -Encoding UTF8
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
                
                $response.Close()
            }
        } finally {
            $listener.Stop()
        }
    }
    
    "5" {
        Write-Host "🔥 Opening VS Code with Live Server setup..." -ForegroundColor Green
        if (Test-Command code) {
            code .
            Write-Host ""
            Write-Host "📝 Instructions:" -ForegroundColor Yellow
            Write-Host "1. Install 'Live Server' extension if not already installed" -ForegroundColor White
            Write-Host "2. Right-click on index.html in VS Code" -ForegroundColor White
            Write-Host "3. Select 'Open with Live Server'" -ForegroundColor White
        } else {
            Write-Host "❌ VS Code not found in PATH" -ForegroundColor Red
        }
    }
    
    "6" {
        Write-Host "🌍 Opening all Timely versions..." -ForegroundColor Green
        $files = @("index.html", "index-new.html", "index-fixed.html", "timeis-digital.html")
        foreach ($file in $files) {
            if (Test-Path $file) {
                Write-Host "Opening $file..." -ForegroundColor Cyan
                Invoke-Item $file
                Start-Sleep -Milliseconds 500
            }
        }
    }
    
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "        Thanks for using Timely! 🕐" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: You can also directly open any HTML file by double-clicking it!" -ForegroundColor Green
Read-Host "Press Enter to exit"
