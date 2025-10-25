# Quick Start Guide - Simple Interview Testing

This is a simplified version for testing the core interview functionality.

## Features ✨

- ✅ **Text-based Q&A** - Type your answers
- ✅ **Real-time grading** - Get instant feedback
- ✅ **Score tracking** - See your performance
- ✅ **Detailed feedback** - View comprehensive evaluations
- ❌ **No voice** (coming later)
- ❌ **No video** (coming later)
- ❌ **No complex navigation** (just interview)

## Setup & Run 🚀

### Step 1: Start Backend Server

```bash
# Navigate to project root
cd C:\Users\Asus\OneDrive\Desktop\llm-interview

# Activate virtual environment
.venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start backend
python backend_server.py
```

**Backend should now be running at:**
- 🌐 API: http://localhost:8000
- 📚 Docs: http://localhost:8000/docs

### Step 2: Start Frontend

Open a **new terminal** window:

```bash
# Navigate to frontend folder
cd C:\Users\Asus\OneDrive\Desktop\llm-interview\Frontend-UI-For-an-AI-Interview-Platform-Ver-2

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

**Frontend should now be running at:**
- 🎨 App: http://localhost:5173

### Step 3: Test the Interview

1. Open browser to http://localhost:5173
2. You'll see a simple start screen
3. Select number of questions (1, 3, 5, or 10)
4. Click "Start Interview"
5. Answer each question in the text box
6. Press Enter or click "Submit Answer"
7. See your score and feedback instantly
8. After all questions, view comprehensive feedback

## How It Works 🔄

### Interview Flow

```
┌─────────────────┐
│   Start Screen  │
│  (Select rounds)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │
│  Creates Session│
│  Returns Q1     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Chat Interface │
│  AI asks Q1     │
└────────┬────────┘
         │
    User types answer
         │
         ▼
┌─────────────────┐
│  Submit Answer  │
│  to Backend     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   LangChain     │
│  Grades Answer  │
│  Generates Q2   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Show Score &   │
│  Justification  │
│  Display Q2     │
└────────┬────────┘
         │
    Repeat for all rounds
         │
         ▼
┌─────────────────┐
│ Feedback Screen │
│ Average Score   │
│ All Evaluations │
└─────────────────┘
```

## UI Components 🎨

### Start Screen
- Simple centered card
- Number of questions selector (dropdown)
- "Start Interview" button
- Shows loading state while starting

### Interview Screen
- **Progress bar** at top (shows current round)
- **Chat-style interface** with messages:
  - AI messages (gray, left side) - Questions
  - User messages (indigo, right side) - Your answers
  - Feedback messages (green gradient) - Scores and justification
- **Input area** at bottom:
  - Multiline textarea for answers
  - Submit button
  - End interview button

### Feedback Screen
- Summary stats cards:
  - Average Score (0-1)
  - Performance Band (L1-L4)
  - Total Questions
- Detailed evaluations for each round:
  - Question asked
  - Your answer
  - Score + Band
  - AI justification
- "Start New Interview" button

## Grading System 📊

The grading is now **more lenient** as requested:

### Score Ranges
- **0.0 - 0.3**: Mostly off-topic or incorrect
- **0.3 - 0.5**: Shows some relevant awareness
- **0.5 - 0.7**: Basic/partial knowledge
- **0.7 - 1.0**: Good understanding (even if incomplete)

### Performance Bands
- **L1**: Score < 0.40 (Needs improvement)
- **L2**: Score 0.40-0.60 (Basic level)
- **L3**: Score 0.60-0.80 (Competent)
- **L4**: Score ≥ 0.80 (Excellent)

### Grading Philosophy
- ✅ Gives credit for partial knowledge
- ✅ Values conceptual understanding
- ✅ Focuses on what you got RIGHT
- ✅ Minimum 0.5 for any relevant knowledge
- ✅ Generous scoring when uncertain

## Keyboard Shortcuts ⌨️

- **Enter**: Submit answer
- **Shift + Enter**: New line in answer

## Troubleshooting 🔧

### Backend won't start

**Error: "LLM_API_KEY not configured"**
```bash
# Make sure .env file exists with:
LLM_API_KEY=your_key_here
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.3-70b-versatile
```

**Error: "Sample index 1 out of range"**
- The code uses sample_idx=0 by default (only 1 sample in data file)
- This is already configured correctly

**Error: "ModuleNotFoundError"**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't start

**Error: "Cannot find module './SimpleApp'"**
```bash
# Make sure you're in the frontend directory
cd Frontend-UI-For-an-AI-Interview-Platform-Ver-2
npm install
```

**Error: "Failed to fetch"**
- Make sure backend is running on port 8000
- Check http://localhost:8000/health in browser

### Interview issues

**Nothing happens after clicking "Start Interview"**
- Check browser console (F12) for errors
- Verify backend is running
- Check backend terminal for error messages

**Stuck on "Submitting..."**
- Backend might be processing (can take 5-10 seconds)
- Check backend terminal for errors
- Try refreshing the page and starting again

**Questions seem too easy/hard**
- Questions are based on the rubrics_filled.jsonl file
- Edit that file to customize questions

## Testing Checklist ✅

- [ ] Backend starts without errors
- [ ] Frontend starts and shows start screen
- [ ] Can select number of rounds
- [ ] Click "Start Interview" works
- [ ] First question appears in chat
- [ ] Can type answer and submit
- [ ] See loading animation while grading
- [ ] Score and feedback appear
- [ ] Next question appears
- [ ] Progress bar updates
- [ ] All rounds complete
- [ ] Feedback screen shows with stats
- [ ] Can start new interview

## Sample Test Run 🧪

1. **Start with 3 questions**
2. **Question 1**: "What is polymorphism in OOP?"
   - Answer: "Polymorphism allows objects to take multiple forms. It enables methods to do different things based on the object."
   - Expected: Score ~0.7-0.9 (good understanding)

3. **Question 2**: Follow-up based on your answer
   - Answer naturally
   - Expected: Instant grading

4. **Question 3**: Another follow-up
   - Complete the interview
   - View comprehensive feedback

## Data Storage 💾

All interview sessions are saved to:
```
data/training/evals.jsonl
```

Each line contains:
```json
{
  "session_id": "session_20250118_123456_789",
  "round": 1,
  "competency": "Technical Knowledge",
  "question": "What is...?",
  "answer": "User's answer...",
  "score": 0.85,
  "band": "L4",
  "justification": "Good explanation...",
  "followup_question": "Can you explain...?",
  "timestamp": "2025-01-18T12:34:56"
}
```

## Next Steps 🎯

Once basic testing works:

1. ✅ Test with different question counts
2. ✅ Try intentionally wrong answers (should score low)
3. ✅ Try good answers (should score high)
4. ✅ Check feedback page shows all evaluations
5. ✅ Test "End Interview" button
6. ✅ Test "Start New Interview" button

Future enhancements:
- 🔮 Add voice input/output
- 🔮 Add video recording
- 🔮 Add interview history page
- 🔮 Add user authentication
- 🔮 Add multiple competencies
- 🔮 Add CV upload and parsing
- 🔮 Add WebSocket for real-time updates

## Need Help? 💬

- Check backend logs in terminal
- Check frontend console (F12 in browser)
- Check API docs at http://localhost:8000/docs
- Try the interactive API tester in the docs

---

**Happy Testing! 🎉**
