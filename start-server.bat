@echo off
REM ============================================
REM START LOCAL DEVELOPMENT SERVER
REM ============================================

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║       PORTFOLIO LOCAL SERVER LAUNCHER                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Node.js is not installed!
    echo.
    echo Solution: Download and install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js detected
echo.

REM Check if server.js exists
if not exist "server.js" (
    echo ❌ Error: server.js not found!
    echo Make sure you are in the correct directory.
    echo.
    pause
    exit /b 1
)

echo ✓ server.js found
echo.
echo 🚀 Starting server...
echo.

REM Start the server
node server.js

pause
