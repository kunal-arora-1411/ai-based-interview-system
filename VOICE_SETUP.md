# Voice-Enabled Interview Setup Guide

Complete guide for using Speech-to-Text (Whisper) and Text-to-Speech features.

## 🎙️ Features

- **Speech-to-Text**: Speak your answers using OpenAI Whisper
- **Text-to-Speech**: AI speaks questions and feedback
- **Voice Selection**: Choose from 6 AI voices
- **Auto-play**: Optional automatic audio playback
- **Hybrid Mode**: Switch between typing and speaking

## 🔑 API Keys Required

You need **TWO** API keys:

### 1. LLM API Key (for interview questions/grading)
```env
LLM_API_KEY=your_groq_or_openai_key
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.3-70b-versatile
```

### 2. OpenAI API Key (for Whisper STT and TTS)
```env
OPENAI_API_KEY=sk-your-openai-key-here
```

## 📝 Setup Instructions

### Step 1: Update .env File

Add OpenAI API key to your `.env` file:

```bash
# .env file
LLM_API_KEY=your_groq_key
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.3-70b-versatile

# NEW: Add OpenAI key for STT/TTS
OPENAI_API_KEY=sk-your-openai-key-here
```

### Step 2: Install Backend Dependencies

```bash
cd C:\Users\Asus\OneDrive\Desktop\llm-interview
.venv\Scripts\activate
pip install -r requirements.txt
```

This will install the new `openai` package.

### Step 3: Start Backend Server

```bash
python backend_server.py
```

### Step 4: Start Frontend

```bash
cd Frontend-UI-For-an-AI-Interview-Platform-Ver-2
npm run dev
```

## 🎤 Using Voice Features

### Starting an Interview

1. Open http://localhost:5173
2. Configure settings:
   - **Number of Questions**: 1-10
   - **AI Voice**: Choose from 6 voices
   - **Auto-play**: Toggle automatic audio
3. Click "Start Interview"
4. AI will speak the first question (if auto-play is on)

### Answering Questions

#### Method 1: Voice Recording
1. Click "🎤 Record" button
2. Speak your answer clearly
3. Click "⏹️ Stop" when done
4. Wait for transcription
5. Review transcribed text
6. Click "Submit Answer"

#### Method 2: Text Input
1. Type your answer in the text box
2. Press Enter or click "Submit Answer"

#### Method 3: Hybrid (Best!)
1. Click "🎤 Record" and speak
2. Wait for transcription
3. Edit the transcribed text if needed
4. Click "Submit Answer"

### AI Responses

The AI will:
1. Show your score and band (L1-L4)
2. Provide feedback justification
3. Speak the feedback (if auto-play enabled)
4. Ask the next question
5. Speak the next question (if auto-play enabled)

You can also:
- Click "🔊 Play Audio" on any AI message to replay it
- Toggle auto-play at any time

## 🎵 Voice Options

| Voice | Description | Best For |
|-------|-------------|----------|
| **Alloy** | Neutral, balanced | General use |
| **Echo** | Male voice | Professional tone |
| **Fable** | British accent | Formal interviews |
| **Onyx** | Deep, authoritative | Serious practice |
| **Nova** | Female voice | Friendly tone |
| **Shimmer** | Soft, gentle | Calm practice |

## 📊 Status Indicators

- **🔊 AI Speaking...**: AI is playing audio
- **⏺️ Recording...**: Microphone is recording (pulsing red)
- **✍️ Transcribing...**: Converting speech to text
- **Submitting...**: Grading your answer

## 🔧 Troubleshooting

### Microphone Access Denied

**Problem**: "Failed to access microphone"

**Solution**:
1. Allow microphone access in browser
2. Chrome: Click lock icon → Site settings → Microphone → Allow
3. Firefox: Click lock icon → Permissions → Microphone → Allow
4. Refresh the page

### Transcription Failed

**Problem**: "Transcription failed"

**Solutions**:
1. Check OPENAI_API_KEY in .env file
2. Verify OpenAI account has credits
3. Check audio was recorded (should see file size > 0)
4. Try speaking louder and clearer
5. Check backend terminal for error details

### No Audio Playback

**Problem**: AI text appears but no sound

**Solutions**:
1. Check "Auto-play AI voice" is enabled
2. Check browser isn't muted
3. Check system volume
4. Try clicking "🔊 Play Audio" manually
5. Check OPENAI_API_KEY is valid

### TTS Failed

**Problem**: "Failed to synthesize speech"

**Solutions**:
1. Verify OPENAI_API_KEY in .env
2. Check OpenAI account has credits
3. Try a different voice
4. Check backend logs for errors

### Recording Doesn't Stop

**Problem**: Stuck in recording mode

**Solution**:
1. Click "⏹️ Stop" button again
2. Refresh the page
3. Check browser console for errors

## 💰 Cost Considerations

### OpenAI Pricing (as of 2024)

**Whisper (STT)**:
- $0.006 per minute of audio
- Example: 10 interviews × 5 answers × 30 sec = 25 min = $0.15

**TTS**:
- $0.015 per 1K characters (tts-1)
- $0.030 per 1K characters (tts-1-hd)
- Example: 10 questions × 100 chars = 1K chars = $0.015

**Total for 10 practice interviews**: ~$0.20

### Cost Optimization Tips

1. **Disable auto-play**: Only use TTS when needed
2. **Use tts-1**: Standard quality (already configured)
3. **Keep answers concise**: Less audio to transcribe
4. **Text fallback**: Type when voice isn't needed
5. **Monitor usage**: Check OpenAI dashboard

## 🧪 Testing Voice Features

### Test 1: Basic Recording
1. Start interview
2. Click "Record"
3. Say: "This is a test of the speech recognition system"
4. Click "Stop"
5. ✅ Should see text appear in textarea

### Test 2: TTS Playback
1. Start interview
2. Wait for first question
3. ✅ Should hear AI voice (if auto-play enabled)
4. ✅ Should see "🔊 AI Speaking..." indicator

### Test 3: Full Q&A Flow
1. Start with auto-play enabled
2. Listen to question
3. Record answer
4. Submit
5. ✅ Should hear feedback spoken
6. ✅ Should hear next question

### Test 4: Voice Selection
1. Try different voices in settings
2. Start interview
3. ✅ Each voice should sound different

## 📱 Browser Compatibility

| Browser | STT | TTS | Notes |
|---------|-----|-----|-------|
| Chrome | ✅ | ✅ | Best support |
| Edge | ✅ | ✅ | Chromium-based |
| Firefox | ✅ | ✅ | Good support |
| Safari | ✅ | ⚠️ | May need user gesture |

## 🔐 Privacy & Security

- **Audio data**: Sent to OpenAI for processing
- **Not stored**: Audio files deleted after transcription
- **Temporary**: Temp files cleaned up automatically
- **HTTPS recommended**: Use in production
- **Local recording**: Audio never saved to disk permanently

## 📈 Performance Tips

### For Best Transcription Accuracy:
1. Speak clearly and at normal pace
2. Use good microphone (not laptop mic if possible)
3. Reduce background noise
4. Keep answers 30-60 seconds
5. Pause briefly between sentences

### For Fast TTS:
1. Use "tts-1" model (already configured)
2. Keep feedback concise
3. Pre-load audio while user thinks
4. Consider caching common phrases

## 🚀 Advanced Usage

### Switch Between Text and Voice

In `SimpleApp.tsx`, change the import:

```typescript
// For voice support
import { VoiceInterview } from './VoiceInterview';

// OR for text-only
import { SimpleInterview } from './SimpleInterview';
```

### Customize Voice Settings

In `VoiceInterview.tsx`, modify defaults:

```typescript
const [aiVoice, setAiVoice] = useState('nova'); // Change default voice
const [autoPlayAudio, setAutoPlayAudio] = useState(false); // Disable auto-play
```

### Use Higher Quality TTS

In `backend_server.py`, change model:

```python
response = client.audio.speech.create(
    model="tts-1-hd",  # Higher quality (2x price)
    voice=request.voice,
    input=request.text
)
```

## 📚 API Reference

### Backend Endpoints

#### POST /api/speech/transcribe
```bash
curl -X POST http://localhost:8000/api/speech/transcribe \
  -F "file=@recording.webm"

# Response:
{
  "success": true,
  "text": "Transcribed text here",
  "filename": "recording.webm"
}
```

#### POST /api/speech/synthesize
```bash
curl -X POST http://localhost:8000/api/speech/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "voice": "alloy"}' \
  --output speech.mp3
```

## 🎯 Next Steps

Once voice features are working:
1. ✅ Practice with voice recording
2. ✅ Try different AI voices
3. ✅ Test with various accents
4. ✅ Compare text vs voice accuracy
5. 🔮 Add noise cancellation
6. 🔮 Add real-time transcription
7. 🔮 Add voice activity detection
8. 🔮 Support multiple languages

---

**Happy Voice Interviewing! 🎤🎉**
