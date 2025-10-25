# AI Interview Platform - Integration Guide

Complete guide to connect the React frontend with the Python backend.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│                  http://localhost:5173                       │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Interview   │  │ Dashboard   │  │ History     │         │
│  │ Screen      │  │ Screen      │  │ Screen      │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                 │                 │                 │
│         └─────────────────┴─────────────────┘                │
│                           │                                   │
│                    ┌──────▼──────┐                           │
│                    │   api.ts    │                           │
│                    │ API Client  │                           │
│                    └──────┬──────┘                           │
└───────────────────────────┼───────────────────────────────────┘
                            │
                            │ REST API / WebSocket
                            │
┌───────────────────────────▼───────────────────────────────────┐
│               FastAPI Backend Server                          │
│                http://localhost:8000                          │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ REST API    │  │ WebSocket   │  │ Session     │         │
│  │ Endpoints   │  │ Handler     │  │ Manager     │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                 │                 │                 │
│         └─────────────────┴─────────────────┘                │
│                           │                                   │
│                    ┌──────▼──────┐                           │
│                    │new_llm_inter│                           │
│                    │  .py        │                           │
│                    └──────┬──────┘                           │
└───────────────────────────┼───────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  LangChain     │
                    │  LLM Service   │
                    │  (Groq/OpenAI) │
                    └────────────────┘
```

## Setup Instructions

### 1. Backend Setup

#### Install Python Dependencies
```bash
cd C:\Users\Asus\OneDrive\Desktop\llm-interview

# Create virtual environment (if not exists)
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables
Create or update `.env` file:
```env
LLM_API_KEY=your_api_key_here
LLM_BASE_URL=https://api.groq.com/openai/v1  # or your provider
LLM_MODEL=llama-3.3-70b-versatile
```

#### Start Backend Server
```bash
python backend_server.py
```

Server will start at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs (Interactive API documentation)
- **WebSocket**: ws://localhost:8000/ws/interview/{session_id}

### 2. Frontend Setup

#### Install Frontend Dependencies
```bash
cd Frontend-UI-For-an-AI-Interview-Platform-Ver-2
npm install
```

#### Start Frontend Dev Server
```bash
npm run dev
```

Frontend will start at:
- **App**: http://localhost:5173

### 3. Test the Integration

#### Using REST API (for testing)
```bash
# Start interview
curl -X POST http://localhost:8000/api/interviews/start \
  -H "Content-Type: application/json" \
  -d '{"mode": "practice", "sample_idx": 0, "rounds": 3}'

# Submit answer
curl -X POST http://localhost:8000/api/interviews/answer \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session_20250118_123456_789",
    "question": "What is REST API?",
    "answer": "REST API is a web service architecture..."
  }'

# Get feedback
curl http://localhost:8000/api/interviews/session_20250118_123456_789/feedback

# Get history
curl http://localhost:8000/api/interviews/history
```

## API Endpoints

### Interview Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interviews/start` | Start new interview session |
| POST | `/api/interviews/answer` | Submit answer and get grading |
| GET | `/api/interviews/{session_id}/feedback` | Get comprehensive feedback |
| GET | `/api/interviews/history` | Get all interview history |
| DELETE | `/api/interviews/{session_id}` | End interview session |

### CV/JD Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cv/upload` | Upload CV file |
| POST | `/api/jd/parse` | Parse job description |

### WebSocket

| Endpoint | Description |
|----------|-------------|
| WS `/ws/interview/{session_id}` | Real-time interview communication |

## Frontend Integration Examples

### 1. Start Interview (REST API)

```typescript
import { startInterview } from './api';

const handleStartInterview = async () => {
  try {
    const response = await startInterview({
      mode: 'practice',
      sample_idx: 0,
      rounds: 3
    });

    console.log('Session ID:', response.session_id);
    console.log('First Question:', response.question);
    console.log('Competency:', response.competency);

    // Update UI with first question
    setCurrentQuestion(response.question);
    setSessionId(response.session_id);
  } catch (error) {
    console.error('Failed to start interview:', error);
  }
};
```

### 2. Submit Answer (REST API)

```typescript
import { submitAnswer } from './api';

const handleSubmitAnswer = async (answer: string) => {
  try {
    const response = await submitAnswer({
      session_id: sessionId,
      question: currentQuestion,
      answer: answer
    });

    console.log('Score:', response.score);
    console.log('Band:', response.band);
    console.log('Justification:', response.justification);
    console.log('Next Question:', response.next_question);

    // Update UI
    setScore(response.score);
    setBand(response.band);
    setFeedback(response.justification);

    if (!response.is_complete) {
      setCurrentQuestion(response.next_question);
    } else {
      // Interview complete, navigate to feedback
      navigate('Feedback');
    }
  } catch (error) {
    console.error('Failed to submit answer:', error);
  }
};
```

### 3. Real-Time Interview (WebSocket)

```typescript
import { InterviewWebSocket } from './api';

// Initialize WebSocket
const ws = new InterviewWebSocket(
  sessionId,
  (message) => {
    // Handle incoming messages
    switch (message.type) {
      case 'question':
        console.log('New question:', message.data.question);
        setCurrentQuestion(message.data.question);
        setCurrentRound(message.data.round);
        setAiState('speaking');
        break;

      case 'grading':
        console.log('Score:', message.data.score);
        setScore(message.data.score);
        setBand(message.data.band);
        setFeedback(message.data.justification);
        break;

      case 'status':
        console.log('AI State:', message.data.ai_state);
        setAiState(message.data.ai_state);
        break;

      case 'complete':
        console.log('Interview complete!');
        navigate('Feedback');
        break;

      case 'error':
        console.error('Error:', message.message);
        break;
    }
  },
  (error) => {
    console.error('WebSocket error:', error);
  },
  () => {
    console.log('WebSocket closed');
  }
);

// Connect
ws.connect();

// Send answer
const handleSendAnswer = (answer: string) => {
  setAiState('thinking');
  ws.sendAnswer(answer);
};

// Cleanup on unmount
useEffect(() => {
  return () => {
    ws.disconnect();
  };
}, []);
```

### 4. Get Feedback

```typescript
import { getFeedback } from './api';

const handleGetFeedback = async () => {
  try {
    const feedback = await getFeedback(sessionId);

    console.log('Average Score:', feedback.average_score);
    console.log('Average Band:', feedback.average_band);
    console.log('Total Questions:', feedback.total_questions);
    console.log('Evaluations:', feedback.evaluations);

    // Display feedback in UI
    setFeedbackData(feedback);
  } catch (error) {
    console.error('Failed to get feedback:', error);
  }
};
```

### 5. Get Interview History

```typescript
import { getInterviewHistory } from './api';

const loadHistory = async () => {
  try {
    const history = await getInterviewHistory();

    console.log('Interview History:', history);

    // Display in table/list
    setHistoryData(history);
  } catch (error) {
    console.error('Failed to load history:', error);
  }
};
```

## Updating Frontend Screens

### InterviewScreen.tsx

Add real API integration to the interview screen:

```typescript
// At the top of the file
import { InterviewWebSocket } from '../api';

// Inside the component
const [ws, setWs] = useState<InterviewWebSocket | null>(null);

useEffect(() => {
  // Initialize WebSocket when interview starts
  if (sessionId) {
    const websocket = new InterviewWebSocket(
      sessionId,
      handleWebSocketMessage,
      handleWebSocketError,
      handleWebSocketClose
    );
    websocket.connect();
    setWs(websocket);

    return () => websocket.disconnect();
  }
}, [sessionId]);

const handleWebSocketMessage = (message: any) => {
  // Update state based on message type
  // (see example above)
};

const handleSubmitAnswer = () => {
  if (ws && userAnswer.trim()) {
    ws.sendAnswer(userAnswer.trim());
    setUserAnswer('');
  }
};
```

### WizardScreen.tsx

Add interview initialization:

```typescript
import { startInterview } from '../api';

const handleStartInterview = async () => {
  try {
    setIsLoading(true);

    const response = await startInterview({
      mode: interviewMode,
      sample_idx: 0,
      rounds: 5
    });

    // Store session data
    localStorage.setItem('session_id', response.session_id);
    localStorage.setItem('competency', response.competency);

    // Navigate to interview
    navigate(Screen.BriefingRoom);
  } catch (error) {
    alert('Failed to start interview: ' + error.message);
  } finally {
    setIsLoading(false);
  }
};
```

### FeedbackScreen.tsx

Load real feedback data:

```typescript
import { getFeedback } from '../api';

useEffect(() => {
  const loadFeedback = async () => {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) return;

    try {
      const feedbackData = await getFeedback(sessionId);

      // Update state with real data
      setAverageScore(feedbackData.average_score);
      setBand(feedbackData.average_band);
      setEvaluations(feedbackData.evaluations);
    } catch (error) {
      console.error('Failed to load feedback:', error);
    }
  };

  loadFeedback();
}, []);
```

### HistoryScreen.tsx

Load interview history:

```typescript
import { getInterviewHistory } from '../api';

useEffect(() => {
  const loadHistory = async () => {
    try {
      const history = await getInterviewHistory();
      setHistoryData(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  loadHistory();
}, []);
```

## Data Flow Example

### Official Interview Flow

1. **User clicks "Start Official Interview"**
   - Frontend: `startInterview({ mode: 'official', rounds: 5 })`
   - Backend: Creates session, loads rubrics, generates first question
   - Response: `{ session_id, question, competency, ... }`

2. **User answers first question**
   - Frontend: `submitAnswer({ session_id, question, answer })`
   - Backend: Grades answer using LangChain, generates follow-up
   - Response: `{ score, band, justification, next_question, ... }`

3. **Repeat for all rounds**
   - Frontend continues submitting answers
   - Backend continues grading and generating questions

4. **Interview completes**
   - Backend sets session status to 'completed'
   - Frontend navigates to Feedback screen

5. **User views feedback**
   - Frontend: `getFeedback(session_id)`
   - Backend: Aggregates all evaluations, calculates statistics
   - Response: `{ average_score, evaluations, ... }`

### Practice Flow (WebSocket)

1. **User starts practice session**
   - Frontend: `startInterview({ mode: 'practice', rounds: 3 })`
   - Backend: Creates session, returns first question

2. **Frontend opens WebSocket**
   - `new InterviewWebSocket(session_id, ...)`
   - Backend accepts connection, sends initial question

3. **Real-time Q&A**
   - User types answer → Frontend sends via WebSocket
   - Backend grades → Sends back score + next question
   - Instant feedback loop

4. **Session ends**
   - Backend sends `{ type: 'complete', ... }`
   - Frontend disconnects WebSocket, shows results

## Error Handling

### Backend Errors

```python
# All endpoints return structured errors:
{
  "detail": "Error message here"
}
```

### Frontend Error Handling

```typescript
try {
  const response = await startInterview({...});
  // Success
} catch (error) {
  // Error is already formatted with message
  console.error(error.message);
  alert('Failed to start interview: ' + error.message);
}
```

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend dev server starts
- [ ] `/health` endpoint returns 200
- [ ] Can start interview and get first question
- [ ] Can submit answer and get grading
- [ ] Can complete full interview (3+ rounds)
- [ ] Can view feedback after completion
- [ ] Can view interview history
- [ ] WebSocket connects successfully
- [ ] WebSocket sends/receives messages
- [ ] WebSocket handles disconnection gracefully

## Troubleshooting

### Backend Issues

**Problem**: "LLM_API_KEY not configured"
**Solution**: Add `LLM_API_KEY` to `.env` file

**Problem**: "Sample index out of range"
**Solution**: Use `sample_idx: 0` (only 1 sample in rubrics_filled.jsonl)

**Problem**: CORS errors in browser
**Solution**: Backend already configured for localhost:5173

### Frontend Issues

**Problem**: "Failed to fetch" errors
**Solution**: Ensure backend server is running on port 8000

**Problem**: WebSocket connection fails
**Solution**: Check that backend supports WebSocket on port 8000

**Problem**: TypeScript errors in api.ts
**Solution**: Run `npm install` to ensure all types are available

## Next Steps

1. ✅ Backend server created (`backend_server.py`)
2. ✅ API client created (`api.ts`)
3. ✅ Integration guide documented
4. 🔄 Update frontend screens to use real API
5. 🔄 Test full end-to-end flow
6. 🔄 Add error boundaries and loading states
7. 🔄 Deploy to production

## Production Considerations

### Security
- [ ] Add authentication (JWT tokens)
- [ ] Validate all inputs
- [ ] Rate limiting
- [ ] HTTPS in production

### Performance
- [ ] Add caching for rubrics
- [ ] Optimize database queries
- [ ] Use connection pooling
- [ ] Add CDN for static assets

### Monitoring
- [ ] Add logging (structured logs)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic)
- [ ] Uptime monitoring

### Deployment
- [ ] Containerize with Docker
- [ ] Set up CI/CD pipeline
- [ ] Configure production environment
- [ ] Set up database (PostgreSQL)
- [ ] Use Redis for session storage

---

**Status**: ✅ Backend integration complete and ready for frontend connection!
