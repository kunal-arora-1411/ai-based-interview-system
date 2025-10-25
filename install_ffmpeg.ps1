# FFmpeg Installation Script for Windows
# This script downloads and installs FFmpeg automatically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FFmpeg Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if FFmpeg is already installed
$ffmpegPath = Get-Command ffmpeg -ErrorAction SilentlyContinue
if ($ffmpegPath) {
    Write-Host "✓ FFmpeg is already installed at: $($ffmpegPath.Source)" -ForegroundColor Green
    ffmpeg -version | Select-Object -First 1
    Write-Host ""
    Write-Host "No installation needed!" -ForegroundColor Green
    pause
    exit 0
}

Write-Host "FFmpeg not found. Installing..." -ForegroundColor Yellow
Write-Host ""

# Method 1: Try winget (fastest if available)
Write-Host "Attempting installation via winget..." -ForegroundColor Yellow
try {
    # Accept source agreements automatically
    winget source update
    winget install -e --id Gyan.FFmpeg --accept-source-agreements --accept-package-agreements --silent

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ FFmpeg installed successfully via winget!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Please restart your terminal and backend server." -ForegroundColor Yellow
        pause
        exit 0
    }
} catch {
    Write-Host "⚠ Winget installation failed: $_" -ForegroundColor Yellow
}

# Method 2: Manual download and install
Write-Host ""
Write-Host "Downloading FFmpeg manually..." -ForegroundColor Yellow

$downloadUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
$zipFile = "$env:TEMP\ffmpeg.zip"
$extractPath = "C:\ffmpeg"

try {
    # Download
    Write-Host "Downloading from $downloadUrl..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing
    Write-Host "✓ Download complete!" -ForegroundColor Green

    # Extract
    Write-Host "Extracting to $extractPath..." -ForegroundColor Cyan
    if (Test-Path $extractPath) {
        Remove-Item $extractPath -Recurse -Force
    }

    Expand-Archive -Path $zipFile -DestinationPath "$env:TEMP\ffmpeg_temp" -Force

    # Find the extracted folder (it has a version number in the name)
    $ffmpegFolder = Get-ChildItem "$env:TEMP\ffmpeg_temp" | Select-Object -First 1
    Move-Item $ffmpegFolder.FullName $extractPath -Force

    Write-Host "✓ Extraction complete!" -ForegroundColor Green

    # Add to PATH
    Write-Host "Adding FFmpeg to system PATH..." -ForegroundColor Cyan
    $binPath = "$extractPath\bin"

    # Get current PATH
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

    if ($currentPath -notlike "*$binPath*") {
        # Add to system PATH
        $newPath = "$currentPath;$binPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")

        # Also add to current session
        $env:Path = "$env:Path;$binPath"

        Write-Host "✓ FFmpeg added to PATH!" -ForegroundColor Green
    } else {
        Write-Host "✓ FFmpeg already in PATH!" -ForegroundColor Green
    }

    # Cleanup
    Remove-Item $zipFile -Force -ErrorAction SilentlyContinue
    Remove-Item "$env:TEMP\ffmpeg_temp" -Recurse -Force -ErrorAction SilentlyContinue

    # Verify installation
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Verifying installation..." -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan

    # Refresh PATH in current session
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

    $ffmpegCheck = Get-Command ffmpeg -ErrorAction SilentlyContinue
    if ($ffmpegCheck) {
        Write-Host "✓ SUCCESS! FFmpeg is now installed!" -ForegroundColor Green
        ffmpeg -version | Select-Object -First 1
    } else {
        Write-Host "✓ Installation complete, but you need to restart your terminal" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "NEXT STEPS:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "1. Close and restart your terminal" -ForegroundColor White
    Write-Host "2. Restart the backend server" -ForegroundColor White
    Write-Host "3. Voice recording should now work!" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "❌ Installation failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install FFmpeg manually:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://www.gyan.dev/ffmpeg/builds/" -ForegroundColor White
    Write-Host "2. Download: ffmpeg-release-essentials.zip" -ForegroundColor White
    Write-Host "3. Follow instructions in INSTALL_FFMPEG.md" -ForegroundColor White
}

Write-Host ""
pause
