#!/usr/bin/env powershell

# ============================================
# ETHICAL HACKER PORTFOLIO - DEPLOYMENT SCRIPT
# ============================================

Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   DEPLOYING YOUR PORTFOLIO - AUTOMATED SETUP       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify Files
Write-Host "📁 Step 1: Verifying Portfolio Files..." -ForegroundColor Yellow
$files = @("index.html", "admin.html", "cssstyle.css", "jsmain.js")
$allFound = $true
foreach($file in $files) {
    if(Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file NOT FOUND" -ForegroundColor Red
        $allFound = $false
    }
}

if (-not $allFound) {
    Write-Host "DEPLOYMENT CANNOT PROCEED - Missing required files!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All files verified!" -ForegroundColor Green
Write-Host ""

# Step 2: Check Node.js
Write-Host "📦 Step 2: Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if($nodeVersion) {
    Write-Host "  ✅ Node.js $nodeVersion found" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Node.js not found" -ForegroundColor Yellow
    Write-Host "  📖 Download from: https://nodejs.org" -ForegroundColor Cyan
    Write-Host "  (Required for Netlify deployment)" -ForegroundColor White
    exit 1
}

Write-Host ""

# Step 3: Deploy Options
Write-Host "🚀 Step 3: Choose Deployment Method" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1️⃣  Netlify (5 minutes) - RECOMMENDED" -ForegroundColor Cyan
Write-Host "     • Easiest setup" -ForegroundColor Gray
Write-Host "     • Free hosting" -ForegroundColor Gray
Write-Host "     • Automatic deployments" -ForegroundColor Gray
Write-Host ""
Write-Host "  2️⃣  GitHub Pages (10 minutes)" -ForegroundColor Cyan
Write-Host "     • Version control" -ForegroundColor Gray
Write-Host "     • GitHub account needed" -ForegroundColor Gray
Write-Host "     • Free hosting" -ForegroundColor Gray
Write-Host ""
Write-Host "  3️⃣  Manual Setup" -ForegroundColor Cyan
Write-Host "     • Show me the commands" -ForegroundColor Gray
Write-Host ""

Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host ""
Write-Host "📝 MANUAL DEPLOYMENT OPTIONS:" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "OPTION A: Deploy with Netlify" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Run these commands:" -ForegroundColor Green
Write-Host ""
Write-Host "npm install -g netlify-cli" -ForegroundColor Cyan -BackgroundColor Black
Write-Host ""
Write-Host "netlify deploy --prod" -ForegroundColor Cyan -BackgroundColor Black
Write-Host ""
Write-Host "Then follow the prompts to:" -ForegroundColor Green
Write-Host "  1. Login to Netlify" -ForegroundColor White
Write-Host "  2. Create new site" -ForegroundColor White
Write-Host "  3. Confirm deployment" -ForegroundColor White
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "OPTION B: Deploy with GitHub Pages" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Run these commands:" -ForegroundColor Green
Write-Host ""
Write-Host "git init" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "git add ." -ForegroundColor Cyan -BackgroundColor Black
Write-Host "git commit -m 'Ethical Hacker Portfolio'" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "git remote add origin https://github.com/YOUR_USERNAME/portfolio.git" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "git push -u origin main" -ForegroundColor Cyan -BackgroundColor Black
Write-Host ""
Write-Host "Then enable Pages in GitHub repository Settings" -ForegroundColor Green
Write-Host ""

Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Your portfolio is ready!" -ForegroundColor Green
Write-Host "📖 For detailed instructions, read: GO_LIVE_NOW.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏱️  Time to Live: < 30 minutes" -ForegroundColor Cyan
Write-Host "💰 Cost: FREE" -ForegroundColor Green
Write-Host ""
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
