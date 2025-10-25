# AI Interview Platform - LangChain Edition

A systematic, LangChain-based AI interview platform with local speech recognition and text-to-speech capabilities.

## Features

- ✅ **LangChain-based Interview System** - Systematic question generation and grading
- ✅ **Local Speech Recognition** - OpenAI Whisper (no API costs!)
- ✅ **Local Text-to-Speech** - pyttsx3 with Windows voices (no API costs!)
- ✅ **Voice & Text Input** - Flexible answer submission
- ✅ **Real-time Grading** - Fair, encouraging AI evaluation
- ✅ **Modern UI** - React + TypeScript frontend
- ✅ **REST API + WebSocket** - FastAPI backend

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd C:\Users\Asus\OneDrive\Desktop\llm-interview
start_backend.bat
```

This will:
- Create virtual environment
- Install Python packages
- Start the FastAPI server

**Frontend:**
```bash
cd Frontend-UI-For-an-AI-Interview-Platform-Ver-2
npm install
npm run dev
```

### 2. Enable Voice Recording (Optional)

Voice recording requires FFmpeg to process browser audio:

**Easy way:**
1. Right-click `install_ffmpeg.bat`
2. Select "Run as Administrator"
3. Restart terminal and backend

**Without FFmpeg:**
- ✅ You can still type answers
- ✅ AI will still speak to you
- ⚠️ Voice recording won't work

See `VOICE_RECORDING_SETUP.md` for details.

### 3. Start Interview

1. Open http://localhost:5174
2. Click "Start Interview"
3. Answer questions (voice or text)
4. Get real-time grading

## Project Structure

```
llm-interview/
├── new_llm_inter.py              # LangChain interview system
├── backend_server.py             # FastAPI server with STT/TTS
├── step2_4interview_theory.py    # Original implementation (reference)
├── requirements.txt              # Python dependencies
├── .env                          # API keys and configuration
├── start_backend.bat             # Backend startup script
├── install_ffmpeg.bat            # FFmpeg installer
│
├── Frontend-UI-For-an-AI-Interview-Platform-Ver-2/
│   ├── src/
│   │   ├── VoiceInterview.tsx   # Voice-enabled UI
│   │   ├── SimpleInterview.tsx  # Text-only UI
│   │   ├── SimpleApp.tsx        # Main app
│   │   └── api.ts               # Backend API client
│   └── package.json
│
└── data/training/
    ├── rubrics_filled.jsonl      # Sample data
    └── evals.jsonl               # Interview records
```

## Configuration

Edit `.env` file:

```env
# LLM Configuration (Groq)
LLM_API_KEY=your_api_key_here
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.3-70b-versatile

# Whisper Model (local)
WHISPER_MODEL=base  # Options: tiny, base, small, medium, large
```

## Available Modes

### Voice Interview (VoiceInterview.tsx)
- 🎤 Record answers with microphone
- 🔊 Hear AI questions and feedback
- ⌨️ Fallback to text input if needed
- Requires FFmpeg for recording

### Text Interview (SimpleInterview.tsx)
- ⌨️ Type your answers
- 📊 Real-time grading
- 📈 Progress tracking
- Works without FFmpeg

## API Endpoints

### REST API (http://localhost:8000)

- `POST /api/interviews/start` - Start new interview
- `POST /api/interviews/answer` - Submit answer
- `GET /api/interviews/{id}/feedback` - Get feedback
- `POST /api/speech/transcribe` - Speech-to-text
- `POST /api/speech/synthesize` - Text-to-speech

### WebSocket (ws://localhost:8000)

- `/ws/interview/{session_id}` - Real-time interview

See API docs: http://localhost:8000/docs

## Key Improvements Over Original

### 1. Systematic Architecture
- **Before**: Direct OpenAI calls, manual prompt construction
- **After**: LangChain chains, Pydantic validation, LCEL syntax

### 2. Lenient Grading
- **Before**: Very strict, often gave low scores
- **After**: Fair and encouraging, focuses on positives
- Temperature: 0.05 → 0.3
- Band thresholds adjusted upward

### 3. Local Speech Processing
- **Before**: N/A
- **After**: Local Whisper + pyttsx3 (zero API costs)
- Fast processing after initial model load

### 4. File Handling
- **Before**: N/A
- **After**: Safe temp file cleanup, no locking errors
- 100ms delay before deletion
- Graceful error handling

## Troubleshooting

### "WebM audio processing failed"
→ Install FFmpeg using `install_ffmpeg.bat`
→ Or use text input instead

### "[WinError 32] Process cannot access file"
→ Already fixed in latest version
→ Update backend_server.py if you see this

### "Sample index out of range"
→ Use `--sample-idx 0` for first sample
→ File has limited samples

### Grading too strict
→ Already adjusted to be more lenient
→ Scoring guidelines favor higher scores

## Documentation

- `VOICE_RECORDING_SETUP.md` - Voice recording guide
- `INSTALL_FFMPEG.md` - FFmpeg installation
- `WEBM_TRANSCRIPTION_FIX.md` - Technical fix details
- `INTEGRATION_GUIDE.md` - Architecture overview
- `QUICKSTART.md` - Testing guide

## Technology Stack

**Backend:**
- FastAPI - Web framework
- LangChain - LLM orchestration
- Whisper - Speech recognition (local)
- pyttsx3 - Text-to-speech (local)
- Groq - LLM provider (llama-3.3-70b)

**Frontend:**
- React - UI framework
- TypeScript - Type safety
- Vite - Build tool
- MediaRecorder API - Audio recording

## Credits

Built with Claude Code and OpenAI Whisper.

## License

MIT
