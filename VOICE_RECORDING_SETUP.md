# Voice Recording Setup - Complete Guide

## Current Status

Your AI Interview Platform is **almost ready** for voice recording! Here's what's working:

✅ **Frontend**: Voice recording UI is working (VoiceInterview.tsx)
✅ **Backend**: Whisper STT and pyttsx3 TTS are installed
✅ **Text-to-Speech**: AI can speak to you (works now!)
✅ **Text Input**: You can type answers (works now!)
⚠️ **Speech-to-Text**: Needs FFmpeg to process WebM audio from browser

## The Issue

Your browser records audio in **WebM format**, which requires **FFmpeg** to process. When you try to record without FFmpeg, you see:

```
❌ Transcription failed: WebM audio processing failed.
   Please install FFmpeg or use a different audio format.
```

## Quick Fix - Install FFmpeg

### **Method 1: Automated Script (RECOMMENDED)**

1. **Right-click** on `install_ffmpeg.bat`
2. Select **"Run as Administrator"**
3. Wait for installation to complete
4. **Restart your terminal**
5. **Restart the backend server**
6. Voice recording should work!

### **Method 2: Manual Installation**

See `INSTALL_FFMPEG.md` for detailed manual installation steps.

## How to Test After Installing FFmpeg

### 1. Start Backend
```bash
cd C:\Users\Asus\OneDrive\Desktop\llm-interview
start_backend.bat
```

Wait for:
```
Loading Whisper model: base...
Whisper model loaded!
```

### 2. Start Frontend
```bash
cd Frontend-UI-For-an-AI-Interview-Platform-Ver-2
npm run dev
```

### 3. Open Browser
- Navigate to http://localhost:5174
- Click **"Start Interview"**

### 4. Test Voice Recording
- Click the **microphone button** 🎤
- Speak your answer
- Click **"Stop & Submit"**
- You should see: `✓ Transcription successful!`
- AI will respond with voice + text

## What Works Without FFmpeg

Even without FFmpeg, you can:

1. ✅ **Type answers** instead of recording
2. ✅ **Hear AI questions** via text-to-speech
3. ✅ **Get graded** on your answers
4. ✅ **Complete full interviews**

The only feature that needs FFmpeg is **recording your voice**. Everything else works!

## Technical Details

### Why FFmpeg is Needed

1. **Browser Recording**: Chrome/Edge record audio as WebM (Opus codec)
2. **Whisper Processing**: Whisper needs to decode WebM audio
3. **FFmpeg's Role**: Decodes WebM → Raw audio → Whisper can process

### What Happens After FFmpeg Installation

```python
# Backend processing flow:
1. Browser sends WebM audio blob
2. Backend saves to temp file
3. Whisper calls ffmpeg to decode WebM
4. Whisper transcribes the audio
5. Returns text to frontend
6. Cleanup temp files
```

### File Locking Fix (Already Applied)

The backend now:
- ✅ Waits 100ms before deleting temp files
- ✅ Handles file cleanup errors gracefully
- ✅ Won't crash if temp file is in use
- ✅ Provides clear error messages

See `WEBM_TRANSCRIPTION_FIX.md` for technical details.

## Troubleshooting

### Issue: "FFmpeg command not found"
**Solution**: Install FFmpeg using `install_ffmpeg.bat`

### Issue: "WebM audio processing failed"
**Solution**:
1. Install FFmpeg
2. Restart terminal
3. Restart backend server

### Issue: "[WinError 32] Process cannot access file"
**Solution**: Already fixed! Update to latest backend_server.py

### Issue: Voice recording button doesn't appear
**Solution**:
1. Check browser microphone permissions
2. Ensure you're using HTTPS or localhost
3. Try different browser (Chrome/Edge recommended)

### Issue: Recording works but transcription is slow
**Solution**:
- First transcription is slow (Whisper model loading)
- Subsequent transcriptions are faster
- Consider using smaller Whisper model (edit .env):
  ```
  WHISPER_MODEL=tiny  # Fastest, less accurate
  WHISPER_MODEL=base  # Default, good balance
  WHISPER_MODEL=small # Slower, more accurate
  ```

## Alternative: Use Text Input

If you don't want to install FFmpeg right now:

1. Use the **text input field** instead of recording
2. Type your answers
3. AI will still speak responses to you
4. Everything else works perfectly

You can always install FFmpeg later when you want voice recording.

## Next Steps

1. **Install FFmpeg** (5 minutes) - Run `install_ffmpeg.bat`
2. **Restart terminal** - Close and reopen
3. **Start backend** - Run `start_backend.bat`
4. **Test voice** - Click microphone and speak
5. **Enjoy!** - Full voice interview experience

---

## Files Reference

- `install_ffmpeg.bat` - Automated FFmpeg installer
- `install_ffmpeg.ps1` - PowerShell installation script
- `INSTALL_FFMPEG.md` - Manual installation guide
- `WEBM_TRANSCRIPTION_FIX.md` - Technical fix details
- `backend_server.py` - Backend with STT/TTS endpoints
- `VoiceInterview.tsx` - Frontend voice recording UI

## Support

If you encounter issues:
1. Check error messages in backend terminal
2. Check browser console (F12)
3. Verify FFmpeg: `ffmpeg -version`
4. Restart everything (terminal, backend, frontend)
