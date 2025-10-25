/**
 * API Client for AI Interview Platform
 *
 * Connects React frontend to FastAPI backend
 */

const API_BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = 'ws://localhost:8000';

// ============================================================================
// Types
// ============================================================================

export interface InterviewStartRequest {
  mode: 'practice' | 'official';
  sample_idx?: number;
  competency?: string;
  rounds?: number;
}

export interface InterviewStartResponse {
  session_id: string;
  competency: string;
  question: string;
  difficulty: string;
  round: number;
  total_rounds: number;
}

export interface AnswerSubmission {
  session_id: string;
  answer: string;
  question: string;
}

export interface AnswerResponse {
  score: number;
  band: string;
  justification: string;
  next_question: string | null;
  round: number;
  total_rounds: number;
  is_complete: boolean;
}

export interface FeedbackResponse {
  session_id: string;
  competency: string;
  total_questions: number;
  average_score: number;
  average_band: string;
  scores: number[];
  evaluations: Array<{
    round: number;
    question: string;
    answer: string;
    score: number;
    band: string;
    justification: string;
    timestamp: string;
  }>;
  created_at: string;
  completed_at: string;
}

export interface InterviewHistoryItem {
  session_id: string;
  competency: string;
  questions_answered: number;
  average_score: number;
  average_band: string;
  timestamp: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Start a new interview session
 */
export async function startInterview(
  request: InterviewStartRequest
): Promise<InterviewStartResponse> {
  const response = await fetch(`${API_BASE_URL}/api/interviews/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to start interview');
  }

  return response.json();
}

/**
 * Submit an answer and get grading
 */
export async function submitAnswer(
  submission: AnswerSubmission
): Promise<AnswerResponse> {
  const response = await fetch(`${API_BASE_URL}/api/interviews/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to submit answer');
  }

  return response.json();
}

/**
 * Get feedback for completed interview
 */
export async function getFeedback(sessionId: string): Promise<FeedbackResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/interviews/${sessionId}/feedback`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get feedback');
  }

  return response.json();
}

/**
 * Get interview history
 */
export async function getInterviewHistory(): Promise<InterviewHistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/interviews/history`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get history');
  }

  const data = await response.json();
  return data.history;
}

/**
 * End an interview session
 */
export async function endInterview(sessionId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/interviews/${sessionId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to end interview');
  }
}

/**
 * Upload CV file
 */
export async function uploadCV(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/cv/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to upload CV');
  }

  return response.json();
}

/**
 * Parse job description
 */
export async function parseJobDescription(content: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/jd/parse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to parse JD');
  }

  return response.json();
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// ============================================================================
// WebSocket Client
// ============================================================================

export interface WebSocketMessage {
  type: 'question' | 'grading' | 'complete' | 'error' | 'status' | 'pong';
  data?: any;
  message?: string;
}

export class InterviewWebSocket {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private onMessage: (message: WebSocketMessage) => void;
  private onError: (error: Error) => void;
  private onClose: () => void;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;

  constructor(
    sessionId: string,
    onMessage: (message: WebSocketMessage) => void,
    onError: (error: Error) => void,
    onClose: () => void
  ) {
    this.sessionId = sessionId;
    this.onMessage = onMessage;
    this.onError = onError;
    this.onClose = onClose;
  }

  connect() {
    try {
      this.ws = new WebSocket(`${WS_BASE_URL}/ws/interview/${this.sessionId}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.startPingInterval();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.onMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        this.onError(new Error('WebSocket connection error'));
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');
        this.stopPingInterval();

        // Attempt reconnection
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
          setTimeout(() => this.connect(), this.reconnectDelay);
        } else {
          this.onClose();
        }
      };
    } catch (error) {
      this.onError(error as Error);
    }
  }

  sendAnswer(answer: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'answer',
          data: { answer },
        })
      );
    } else {
      this.onError(new Error('WebSocket not connected'));
    }
  }

  private pingInterval: number | null = null;

  private startPingInterval() {
    this.pingInterval = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  disconnect() {
    this.stopPingInterval();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
