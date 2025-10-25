@echo off
echo ========================================
echo Starting AI Interview Backend Server
echo ========================================
echo.

REM Check if venv exists
if not exist ".venv\Scripts\python.exe" (
    echo Creating virtual environment...
    python -m venv .venv
)

REM Activate venv
call .venv\Scripts\activate.bat

echo Installing/updating dependencies...
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

echo.
echo ========================================
echo Starting backend server...
echo ========================================
echo.

python backend_server.py

pause
