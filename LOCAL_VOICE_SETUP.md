# Local Voice Setup Guide (100% FREE - No API Keys!)

Complete guide for using **local** Speech-to-Text (Whisper) and Text-to-Speech.
Everything runs on your computer - no cloud, no API keys, completely free!

## 🎉 Advantages of Local Voice

- ✅ **100% FREE** - No API costs
- ✅ **Privacy** - Audio never leaves your computer
- ✅ **Offline** - Works without internet
- ✅ **No API Keys** - No OpenAI account needed
- ✅ **Unlimited Usage** - No rate limits
- ✅ **Open Source** - Built on OpenAI's Whisper & pyttsx3

## 📦 What's Installed

### 1. Local Whisper (STT)
- **Source**: https://github.com/openai/whisper
- **Package**: `openai-whisper`
- **Model**: Runs on your GPU/CPU
- **Accuracy**: Same as OpenAI API!
- **Languages**: 99+ languages supported

### 2. Local TTS (pyttsx3)
- **Package**: `pyttsx3`
- **Voices**: Uses your system's built-in voices
- **Quality**: Natural sounding (Windows SAPI)
- **Speed**: Instant synthesis

## 🚀 Setup (Already Done!)

The packages are already installed:
```bash
pip install openai-whisper pyttsx3 pydub
```

## ⚙️ Configuration

### Optional: Choose Whisper Model Size

Add to `.env` file (optional):
```env
WHISPER_MODEL=base
```

**Model Options** (bigger = slower but more accurate):

| Model | Size | Speed | Accuracy | RAM |
|-------|------|-------|----------|-----|
| `tiny` | 39MB | Fastest | Good | 1GB |
| **`base`** | 74MB | Fast | Better | 1GB | ✅ **Default**
| `small` | 244MB | Medium | Great | 2GB |
| `medium` | 769MB | Slow | Excellent | 5GB |
| `large` | 1550MB | Slowest | Best | 10GB |

### Optional: Configure System Voices

**Windows**: Control Panel → Speech → Text to Speech
- Default voices: Microsoft David (Male), Microsoft Zira (Female)
- You can install additional voices

**The backend automatically selects:**
- Female voice for: `nova`, `shimmer`
- Male voice for: `alloy`, `echo`, `fable`, `onyx`

## 🎤 How It Works

### Speech-to-Text Flow:
```
Your voice → Browser records → Upload to backend
    → Local Whisper model → Transcribed text → Return to frontend
```

### Text-to-Speech Flow:
```
AI response text → Backend → Local pyttsx3 engine
    → WAV audio file → Stream to frontend → Play in browser
```

## 🧪 Testing

### Step 1: Start Backend
```bash
python backend_server.py
```

You should see:
```
Loading Whisper model: base...
Whisper model loaded!
```

This loads the model on startup (takes 5-10 seconds first time).

### Step 2: Start Frontend
```bash
cd Frontend-UI-For-an-AI-Interview-Platform-Ver-2
npm run dev
```

### Step 3: Test Voice Recording
1. Open http://localhost:5173
2. Start interview
3. Click "🎤 Record"
4. Speak: "This is a test"
5. Click "⏹️ Stop"
6. Should see transcribed text appear!

### Step 4: Test TTS
1. Enable "Auto-play AI voice"
2. Start interview
3. Should hear AI speak the question!

## 🔊 Voice Quality Comparison

### Local pyttsx3 (Free):
- ✅ Natural sounding (uses Windows voices)
- ✅ Instant generation
- ✅ No cost
- ⚠️ Robotic compared to commercial TTS
- ⚠️ Limited voice variety

### OpenAI TTS (Paid):
- ✅ More natural and expressive
- ✅ Multiple distinct voices
- ❌ Costs $0.015 per 1K characters
- ❌ Requires API key
- ❌ Needs internet

**For practice interviews, local TTS is perfectly fine!**

## 📊 Performance

### First Request (Cold Start):
- **Whisper loading**: 5-10 seconds
- **After loaded**: <2 seconds per transcription

### Subsequent Requests:
- **STT**: 1-2 seconds for 30-second audio
- **TTS**: <1 second for short phrases

### Tips for Faster Performance:
1. Use `tiny` or `base` model (default)
2. Keep Whisper model loaded (backend stays running)
3. Shorter audio clips = faster transcription
4. TTS is always instant

## 🐛 Troubleshooting

### Whisper Loading Issues

**Problem**: "Loading Whisper model..." hangs forever

**Solutions**:
1. Check you have enough RAM (base needs 1GB)
2. Try smaller model: `WHISPER_MODEL=tiny` in .env
3. Restart backend server
4. Check backend terminal for errors

**Problem**: "Failed to transcribe audio"

**Solutions**:
1. Check audio file was uploaded (should be >1KB)
2. Try with shorter audio clip
3. Check backend terminal for detailed error
4. Verify ffmpeg is installed (Whisper dependency)

### TTS Issues

**Problem**: No audio plays / "Failed to synthesize speech"

**Solutions**:
1. Check Windows has default TTS voice installed
2. Open Windows Settings → Time & Language → Speech
3. Verify "Microsoft David" or "Microsoft Zira" is installed
4. Try reinstalling: `pip uninstall pyttsx3 && pip install pyttsx3`
5. Check backend terminal for errors

**Problem**: TTS voice sounds weird/glitchy

**Solutions**:
1. Adjust speech rate in backend_server.py:
   ```python
   engine.setProperty('rate', 150)  # Try 100-200
   ```
2. Install better voices from Windows Store
3. Use different voice in frontend settings

### Audio Format Issues

**Problem**: Browser can't play audio

**Solution**: Frontend expects WAV format now (not MP3)
- Already configured correctly
- Browsers support WAV natively

## 🔧 Advanced Configuration

### Change Default Whisper Model

In `.env`:
```env
# For faster transcription (less accurate)
WHISPER_MODEL=tiny

# For better accuracy (slower)
WHISPER_MODEL=small
```

### Adjust TTS Speed

In `backend_server.py`, line 578:
```python
engine.setProperty('rate', 150)  # Default
# Try: 100 (slower), 200 (faster)
```

### Use GPU for Whisper (Faster!)

If you have NVIDIA GPU:
```bash
# Install CUDA version of PyTorch
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

Then Whisper will automatically use GPU!

## 💾 Disk Space Requirements

- **Whisper base model**: ~74MB
- **Whisper tiny model**: ~39MB
- **Whisper small model**: ~244MB
- **pyttsx3**: <1MB
- **Windows TTS voices**: ~50MB (pre-installed)

**Total**: <150MB for base setup

## 🌍 Multi-Language Support

Whisper automatically detects language!

Supported languages include:
- English
- Spanish
- French
- German
- Chinese
- Japanese
- Arabic
- Hindi
- And 90+ more!

Just speak in any language - Whisper will transcribe it.

## 📈 Cost Comparison

### Local Setup (This Implementation):
```
Cost: $0
API Calls: Unlimited
Internet: Not required
Privacy: 100% local
Speed: 1-2 seconds
```

### OpenAI API:
```
Cost: $0.006/min STT + $0.015/1K chars TTS
Example: 10 interviews = ~$0.20
Internet: Required
Privacy: Cloud-based
Speed: 1-2 seconds
```

**Savings**: $0.20 per 10 interviews = **100% savings!**

## 🎯 Usage Tips

### For Best Transcription:
1. **Speak clearly** at normal pace
2. **Use good mic** (headset better than laptop)
3. **Reduce noise** (quiet room)
4. **Pause between sentences**
5. **Keep answers 30-60 seconds** for faster processing

### For Better TTS Quality:
1. **Install premium voices** (optional):
   - Windows Store → Search "Microsoft voices"
   - Get natural-sounding voices
2. **Adjust speed** if too fast/slow
3. **Use punctuation** in prompts (AI does this automatically)

## 🔄 Switching Between Local and Cloud

### To use Local (Current Setup):
Already configured! No changes needed.

### To switch to OpenAI API:
1. Uncomment in `backend_server.py`
2. Replace Whisper code with API calls
3. Add `OPENAI_API_KEY` to `.env`

## 📱 Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| STT | ✅ | ✅ | ✅ | ✅ |
| TTS | ✅ | ✅ | ✅ | ⚠️ |
| Recording | ✅ | ✅ | ✅ | ⚠️ |

Safari note: May need user interaction before audio plays

## 🎓 Learning Resources

- **Whisper Paper**: https://arxiv.org/abs/2212.04356
- **Whisper GitHub**: https://github.com/openai/whisper
- **pyttsx3 Docs**: https://pyttsx3.readthedocs.io/

## 🚀 Next Steps

Once local voice is working:
1. ✅ Practice speaking answers naturally
2. ✅ Try different Whisper models for speed/accuracy
3. ✅ Test with background noise
4. ✅ Compare transcription accuracy
5. 🔮 Add voice activity detection
6. 🔮 Add noise cancellation
7. 🔮 Support streaming transcription

---

**Happy Local Voice Interviewing! 🎤🎉**

*No API keys, no costs, unlimited usage!*
