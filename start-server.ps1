# ============================================
# START LOCAL DEVELOPMENT SERVER (PowerShell)
# ============================================

Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║       PORTFOLIO LOCAL SERVER LAUNCHER                      ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host "`n" -ForegroundColor White

# Check if Node.js is installed
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue

if ($null -eq $nodeCheck) {
    Write-Host "❌ Error: Node.js is not installed!`n" -ForegroundColor Red
    Write-Host "Solution: Download and install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "`nAfter installation, restart PowerShell and try again.`n" -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ Node.js detected`n" -ForegroundColor Green

# Check if server.js exists
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Error: server.js not found!`n" -ForegroundColor Red
    Write-Host "Make sure you are in the correct directory.`n" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ server.js found`n" -ForegroundColor Green
Write-Host "🚀 Starting server...`n" -ForegroundColor Cyan

# Start the server
& node server.js

Read-Host "`nPress Enter to exit"
