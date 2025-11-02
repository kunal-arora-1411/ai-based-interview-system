#!/usr/bin/env python3
"""
FastAPI Backend Server for AI Interview Platform

Connects the React frontend with the LangChain-based interview system (new_llm_inter.py)
Provides REST API and WebSocket endpoints for real-time interview sessions.

Usage:
    python backend_server.py

Then access:
    - API docs: http://localhost:8000/docs
    - Frontend: http://localhost:5173
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
import json
import os
import pathlib
import asyncio
import io
import tempfile
import time
from datetime import datetime
from dotenv import load_dotenv
# import whisper
import requests
import pyttsx3
import threading
import soundfile as sf
import numpy as np
from pydub import AudioSegment

# Import the interview system
from new_llm_inter import (
    InterviewChainManager,
    InterviewSession,
    load_sample,
    select_competency,
    band_from_score,
    append_record
)

load_dotenv()

# Initialize FastAPI
app = FastAPI(
    title="AI Interview Platform API",
    description="Backend API for the AI-powered interview platform",
    version="1.0.0"
)

# CORS middleware - allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Data Models
# ============================================================================

class InterviewStartRequest(BaseModel):
    mode: str = "practice"  # 'practice' or 'official'
    sample_idx: int = 0
    competency: Optional[str] = None
    rounds: int = 3

class AnswerSubmission(BaseModel):
    session_id: str
    answer: str
    question: str

class CVUpload(BaseModel):
    content: str
    filename: str

class JobDescriptionUpload(BaseModel):
    content: str

class TextToSpeechRequest(BaseModel):
    text: str
    voice: str = "alloy"  # Options: alloy, echo, fable, onyx, nova, shimmer

# ============================================================================
# In-Memory Session Storage
# ============================================================================

class SessionManager:
    """Manages active interview sessions"""

    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}

    def create_session(self, session_id: str, config: dict) -> dict:
        """Create a new interview session"""
        self.sessions[session_id] = {
            "session_id": session_id,
            "created_at": datetime.now().isoformat(),
            "config": config,
            "current_question": None,
            "current_round": 0,
            "questions_asked": [],
            "answers_received": [],
            "scores": [],
            "chain_manager": None,
            "competency": None,
            "sample_data": None,
            "status": "created"  # created, active, completed
        }
        return self.sessions[session_id]

    def get_session(self, session_id: str) -> Optional[dict]:
        """Get session by ID"""
        return self.sessions.get(session_id)

    def update_session(self, session_id: str, updates: dict):
        """Update session data"""
        if session_id in self.sessions:
            self.sessions[session_id].update(updates)

    def delete_session(self, session_id: str):
        """Delete a session"""
        if session_id in self.sessions:
            del self.sessions[session_id]

session_manager = SessionManager()

# ============================================================================
# Helper Functions
# ============================================================================

def initialize_chain_manager() -> InterviewChainManager:
    """Initialize the LangChain interview manager"""
    model_name = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")
    api_key = os.getenv("LLM_API_KEY")
    base_url = os.getenv("LLM_BASE_URL", None)

    if not api_key:
        raise HTTPException(status_code=500, detail="LLM_API_KEY not configured")

    return InterviewChainManager(
        model_name=model_name,
        api_key=api_key,
        base_url=base_url
    )

# Global Whisper model (loaded once for performance)


# ============================================================================
# REST API Endpoints
# ============================================================================

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "AI Interview Platform API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/interviews/start")
async def start_interview(request: InterviewStartRequest):
    """
    Start a new interview session

    Returns session_id and first question
    """
    try:
        # Generate session ID
        session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"

        # Load sample data
        input_file = "data/training/rubrics_filled.jsonl"
        sample = load_sample(input_file, request.sample_idx)

        # Select competency
        competency = select_competency(
            sample.get("rubric", {}),
            request.competency
        )

        # Initialize chain manager
        chain_manager = initialize_chain_manager()

        # Generate first question
        q_output = chain_manager.generate_question(
            sample.get("jd", ""),
            sample.get("resume", ""),
            competency.get("name", "")
        )

        # Create session
        session = session_manager.create_session(session_id, {
            "mode": request.mode,
            "sample_idx": request.sample_idx,
            "rounds": request.rounds,
            "competency_name": request.competency
        })

        # Update session with initialized data
        session_manager.update_session(session_id, {
            "chain_manager": chain_manager,
            "competency": competency,
            "sample_data": sample,
            "current_question": q_output.question,
            "current_round": 1,
            "status": "active"
        })

        return {
            "session_id": session_id,
            "competency": competency.get("name", ""),
            "question": q_output.question,
            "difficulty": q_output.difficulty,
            "round": 1,
            "total_rounds": request.rounds
        }

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Sample data file not found")
    except IndexError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start interview: {str(e)}")

@app.post("/api/interviews/answer")
async def submit_answer(submission: AnswerSubmission):
    """
    Submit an answer and get grading + next question
    """
    try:
        session = session_manager.get_session(submission.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        chain_manager = session["chain_manager"]
        competency = session["competency"]
        current_round = session["current_round"]
        total_rounds = session["config"]["rounds"]

        # Grade the answer
        grade_output = chain_manager.grade_answer(
            submission.question,
            submission.answer,
            competency
        )

        # Rewrite follow-up
        followup = chain_manager.rewrite_followup(grade_output.followup_question)

        # Calculate band
        band = band_from_score(grade_output.score)

        # Store the Q&A record
        record = {
            "session_id": submission.session_id,
            "round": current_round,
            "competency": competency.get("name", ""),
            "question": submission.question,
            "answer": submission.answer,
            "score": grade_output.score,
            "band": band,
            "justification": grade_output.justification,
            "followup_question": followup,
            "timestamp": datetime.now().isoformat()
        }

        # Append to session history
        session["questions_asked"].append(submission.question)
        session["answers_received"].append(submission.answer)
        session["scores"].append(grade_output.score)

        # Save to file
        output_path = pathlib.Path("data/training/evals.jsonl")
        append_record(output_path, record)

        # Check if interview is complete
        is_complete = current_round >= total_rounds

        if not is_complete:
            # Update session for next round
            session_manager.update_session(submission.session_id, {
                "current_question": followup,
                "current_round": current_round + 1
            })
        else:
            # Mark session as completed
            session_manager.update_session(submission.session_id, {
                "status": "completed"
            })

        return {
            "score": grade_output.score,
            "band": band,
            "justification": grade_output.justification,
            "next_question": followup if not is_complete else None,
            "round": current_round + 1,
            "total_rounds": total_rounds,
            "is_complete": is_complete
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process answer: {str(e)}")

@app.get("/api/interviews/{session_id}/feedback")
async def get_feedback(session_id: str):
    """
    Get comprehensive feedback for a completed interview session
    """
    try:
        session = session_manager.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        if session["status"] != "completed":
            raise HTTPException(status_code=400, detail="Interview not yet completed")

        # Calculate statistics
        scores = session["scores"]
        avg_score = sum(scores) / len(scores) if scores else 0
        avg_band = band_from_score(avg_score)

        # Read the eval records for this session
        evals = []
        eval_file = pathlib.Path("data/training/evals.jsonl")
        if eval_file.exists():
            with eval_file.open("r", encoding="utf-8") as f:
                for line in f:
                    record = json.loads(line)
                    if record.get("session_id") == session_id:
                        evals.append(record)

        return {
            "session_id": session_id,
            "competency": session["competency"].get("name", ""),
            "total_questions": len(session["questions_asked"]),
            "average_score": round(avg_score, 2),
            "average_band": avg_band,
            "scores": scores,
            "evaluations": evals,
            "created_at": session["created_at"],
            "completed_at": datetime.now().isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get feedback: {str(e)}")

@app.get("/api/interviews/history")
async def get_interview_history():
    """
    Get all completed interview sessions
    """
    try:
        history = []

        # Read all eval records
        eval_file = pathlib.Path("data/training/evals.jsonl")
        if eval_file.exists():
            sessions_data = {}

            with eval_file.open("r", encoding="utf-8") as f:
                for line in f:
                    record = json.loads(line)
                    session_id = record.get("session_id", "unknown")

                    if session_id not in sessions_data:
                        sessions_data[session_id] = {
                            "session_id": session_id,
                            "competency": record.get("competency", ""),
                            "scores": [],
                            "timestamp": record.get("timestamp", "")
                        }

                    sessions_data[session_id]["scores"].append(record.get("score", 0))

            # Calculate averages and format
            for session_id, data in sessions_data.items():
                scores = data["scores"]
                avg_score = sum(scores) / len(scores) if scores else 0

                history.append({
                    "session_id": session_id,
                    "competency": data["competency"],
                    "questions_answered": len(scores),
                    "average_score": round(avg_score, 2),
                    "average_band": band_from_score(avg_score),
                    "timestamp": data["timestamp"]
                })

        # Sort by timestamp (newest first)
        history.sort(key=lambda x: x["timestamp"], reverse=True)

        return {"history": history}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get history: {str(e)}")

@app.post("/api/cv/upload")
async def upload_cv(file: UploadFile = File(...)):
    """
    Upload and parse CV file
    """
    try:
        content = await file.read()
        text_content = content.decode("utf-8")

        # For now, return mock parsing result
        # In production, you'd use a real CV parser
        return {
            "success": True,
            "filename": file.filename,
            "extracted_skills": [
                "Python", "JavaScript", "React", "Machine Learning",
                "FastAPI", "SQL", "Git", "Problem Solving"
            ],
            "experience_years": 3,
            "education": "Bachelor's in Computer Science"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process CV: {str(e)}")

@app.post("/api/speech/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe audio using Groq Whisper-large-v3 API (safe file handling)
    """
    try:
        # Save uploaded audio temporarily
        audio_data = await file.read()
        temp_path = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
        temp_path.write(audio_data)
        temp_path.close()

        headers = {
            "Authorization": f"Bearer {os.getenv('LLM_API_KEY')}",
        }

        # Use 'with open()' to ensure file closes properly before deletion
        with open(temp_path.name, "rb") as audio_file:
            files = {
                "file": (file.filename, audio_file, "audio/webm"),
                "model": (None, "whisper-large-v3"),
            }

            response = requests.post(
                "https://api.groq.com/openai/v1/audio/transcriptions",
                headers=headers,
                files=files
            )

        # Safe to delete now that the file is closed
        os.unlink(temp_path.name)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        data = response.json()

        return {
            "success": True,
            "text": data.get("text", "").strip(),
            "filename": file.filename,
            "language": data.get("language", "unknown")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to transcribe audio via Groq: {str(e)}")


# ============================================================================
# Text-to-Speech (TTS) Endpoint
# ============================================================================

# TTS lock to prevent concurrent access
tts_lock = threading.Lock()

@app.post("/api/speech/synthesize")
async def synthesize_speech(request: TextToSpeechRequest):
    """
    Convert text to speech using local pyttsx3

    Returns audio stream (mp3)
    """
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            temp_path = temp_file.name

        try:
            # Use threading lock to prevent concurrent TTS calls
            with tts_lock:
                # Initialize TTS engine
                engine = pyttsx3.init()

                # Set voice based on request
                voices = engine.getProperty('voices')
                if request.voice == 'nova' or request.voice == 'shimmer':
                    # Try to find a female voice
                    for voice in voices:
                        if 'female' in voice.name.lower() or 'zira' in voice.name.lower():
                            engine.setProperty('voice', voice.id)
                            break
                else:
                    # Use default or male voice
                    for voice in voices:
                        if 'male' in voice.name.lower() or 'david' in voice.name.lower():
                            engine.setProperty('voice', voice.id)
                            break

                # Set speech rate (words per minute)
                engine.setProperty('rate', 150)  # Normal speed

                # Save to file
                engine.save_to_file(request.text, temp_path)
                engine.runAndWait()

            # Read the generated audio file
            with open(temp_path, 'rb') as audio_file:
                audio_data = audio_file.read()

            # Return as streaming response
            return StreamingResponse(
                io.BytesIO(audio_data),
                media_type="audio/wav",
                headers={
                    "Content-Disposition": "inline; filename=speech.wav"
                }
            )

        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                try:
                    os.unlink(temp_path)
                except:
                    pass  # File might still be in use

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to synthesize speech: {str(e)}")

# ============================================================================
# WebSocket Endpoint for Real-Time Interview
# ============================================================================

@app.websocket("/ws/interview/{session_id}")
async def websocket_interview(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time interview interaction

    Message format:
    {
        "type": "answer" | "status" | "ping",
        "data": {...}
    }
    """
    await websocket.accept()

    try:
        session = session_manager.get_session(session_id)
        if not session:
            await websocket.send_json({
                "type": "error",
                "message": "Session not found"
            })
            await websocket.close()
            return

        # Send initial question
        await websocket.send_json({
            "type": "question",
            "data": {
                "question": session["current_question"],
                "round": session["current_round"],
                "total_rounds": session["config"]["rounds"]
            }
        })

        # Listen for messages
        while True:
            message = await websocket.receive_json()
            msg_type = message.get("type")

            if msg_type == "answer":
                # Process answer submission
                data = message.get("data", {})
                answer = data.get("answer", "")

                if not answer:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Empty answer"
                    })
                    continue

                # Send thinking status
                await websocket.send_json({
                    "type": "status",
                    "data": {"ai_state": "thinking"}
                })

                # Grade the answer
                chain_manager = session["chain_manager"]
                competency = session["competency"]
                current_question = session["current_question"]

                grade_output = chain_manager.grade_answer(
                    current_question,
                    answer,
                    competency
                )

                followup = chain_manager.rewrite_followup(grade_output.followup_question)
                band = band_from_score(grade_output.score)

                # Store record
                current_round = session["current_round"]
                record = {
                    "session_id": session_id,
                    "round": current_round,
                    "competency": competency.get("name", ""),
                    "question": current_question,
                    "answer": answer,
                    "score": grade_output.score,
                    "band": band,
                    "justification": grade_output.justification,
                    "followup_question": followup,
                    "timestamp": datetime.now().isoformat()
                }

                output_path = pathlib.Path("data/training/evals.jsonl")
                append_record(output_path, record)

                # Update session
                session["questions_asked"].append(current_question)
                session["answers_received"].append(answer)
                session["scores"].append(grade_output.score)

                # Check if complete
                total_rounds = session["config"]["rounds"]
                is_complete = current_round >= total_rounds

                if not is_complete:
                    session_manager.update_session(session_id, {
                        "current_question": followup,
                        "current_round": current_round + 1
                    })
                else:
                    session_manager.update_session(session_id, {
                        "status": "completed"
                    })

                # Send grading result
                await websocket.send_json({
                    "type": "grading",
                    "data": {
                        "score": grade_output.score,
                        "band": band,
                        "justification": grade_output.justification
                    }
                })

                # Send next question or completion
                if not is_complete:
                    await websocket.send_json({
                        "type": "question",
                        "data": {
                            "question": followup,
                            "round": current_round + 1,
                            "total_rounds": total_rounds
                        }
                    })
                else:
                    await websocket.send_json({
                        "type": "complete",
                        "data": {
                            "session_id": session_id,
                            "average_score": sum(session["scores"]) / len(session["scores"])
                        }
                    })

            elif msg_type == "ping":
                await websocket.send_json({
                    "type": "pong"
                })

    except WebSocketDisconnect:
        print(f"WebSocket disconnected for session {session_id}")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.send_json({
            "type": "error",
            "message": str(e)
        })

# ============================================================================
# Run Server
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    print("\n" + "="*60)
    print("🚀 AI Interview Platform Backend Server")
    print("="*60)
    print(f"📡 API Server: http://localhost:8000")
    print(f"📚 API Docs: http://localhost:8000/docs")
    print(f"🎨 Frontend: http://localhost:5173")
    print("="*60 + "\n")

    uvicorn.run(
        "backend_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
