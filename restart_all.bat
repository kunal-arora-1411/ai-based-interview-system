@echo off
echo ========================================
echo Restarting AI Interview Platform
echo ========================================
echo.
echo This will restart both backend and frontend servers
echo in separate windows with the updated PATH.
echo.
pause

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0 && start_backend.bat"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0Frontend-UI-For-an-AI-Interview-Platform-Ver-2 && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5174
echo.
echo Wait for both servers to start, then:
echo 1. Open http://localhost:5174 in your browser
echo 2. Click "Start Interview"
echo 3. Click the microphone button to test voice recording!
echo.
echo ========================================
