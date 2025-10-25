# Install FFmpeg for Windows (Quick Guide)

FFmpeg is needed to process WebM audio files from the browser.

## Option 0: Automated Script (EASIEST!)

Just double-click the provided installation script:

1. **Right-click** on `install_ffmpeg.bat` and select **"Run as Administrator"**
2. The script will automatically download and install FFmpeg
3. Restart your terminal and backend server
4. Done!

If the automated script doesn't work, try the manual options below.

---

## Option 1: Using Winget

Open PowerShell and run:
```powershell
winget install ffmpeg
```

Then restart your terminal.

## Option 2: Using Chocolatey

If you have Chocolatey installed:
```powershell
choco install ffmpeg
```

## Option 3: Manual Installation (5 minutes)

1. **Download FFmpeg**:
   - Go to: https://www.gyan.dev/ffmpeg/builds/
   - Download: `ffmpeg-release-essentials.zip`

2. **Extract**:
   - Extract the ZIP file
   - You'll get a folder like `ffmpeg-6.0-essentials_build`

3. **Add to PATH**:
   - Copy the folder to `C:\ffmpeg`
   - Open "Edit System Environment Variables"
   - Click "Environment Variables"
   - Under "System Variables", find "Path", click "Edit"
   - Click "New"
   - Add: `C:\ffmpeg\bin`
   - Click "OK" on all windows

4. **Verify**:
   Open new terminal and run:
   ```bash
   ffmpeg -version
   ```

   Should show FFmpeg version info.

## After Installation

Restart your backend server:
```bash
python backend_server.py
```

Now voice recording should work!

---

## Alternative: Use Text Input Instead

If you don't want to install FFmpeg, you can:
1. Type your answers instead of recording
2. The app will still work perfectly, just without voice input
3. TTS (AI speaking) will still work fine
