@echo off
echo ========================================
echo FFmpeg Installer
echo ========================================
echo.
echo This will install FFmpeg for voice recording support.
echo.
echo Running as Administrator is recommended for system-wide installation.
echo.
pause

powershell.exe -ExecutionPolicy Bypass -File "%~dp0install_ffmpeg.ps1"

pause
