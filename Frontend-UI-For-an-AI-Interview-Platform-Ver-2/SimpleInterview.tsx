import React, { useState, useEffect } from 'react';
import { startInterview, submitAnswer, getFeedback } from './api';

interface Message {
  role: 'ai' | 'user';
  content: string;
  score?: number;
  band?: string;
  justification?: string;
}

interface FeedbackData {
  average_score: number;
  average_band: string;
  total_questions: number;
  evaluations: Array<{
    round: number;
    question: string;
    answer: string;
    score: number;
    band: string;
    justification: string;
  }>;
}

export function SimpleInterview() {
  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Interview state
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(3);
  const [competency, setCompetency] = useState<string>('');

  // Input state
  const [userAnswer, setUserAnswer] = useState('');

  // Chat history
  const [messages, setMessages] = useState<Message[]>([]);

  // Feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Settings
  const [numRounds, setNumRounds] = useState(3);

  // Start interview
  const handleStartInterview = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await startInterview({
        mode: 'practice',
        sample_idx: 0,
        rounds: numRounds,
      });

      setSessionId(response.session_id);
      setCurrentQuestion(response.question);
      setCurrentRound(response.round);
      setTotalRounds(response.total_rounds);
      setCompetency(response.competency);
      setIsInterviewActive(true);

      // Add first question to chat
      setMessages([
        {
          role: 'ai',
          content: response.question,
        },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to start interview');
      console.error('Error starting interview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !sessionId || !currentQuestion) return;

    const answer = userAnswer.trim();

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: answer,
      },
    ]);

    setUserAnswer('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await submitAnswer({
        session_id: sessionId,
        question: currentQuestion,
        answer: answer,
      });

      // Add grading feedback to chat
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: `Score: ${response.score.toFixed(2)} | Band: ${response.band}`,
          score: response.score,
          band: response.band,
          justification: response.justification,
        },
      ]);

      // Check if interview is complete
      if (response.is_complete) {
        setIsInterviewActive(false);
        await loadFeedback();
      } else if (response.next_question) {
        // Add next question
        setCurrentQuestion(response.next_question);
        setCurrentRound(response.round);

        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            content: response.next_question,
          },
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer');
      console.error('Error submitting answer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load feedback
  const loadFeedback = async () => {
    if (!sessionId) return;

    try {
      const feedback = await getFeedback(sessionId);
      setFeedbackData(feedback);
      setShowFeedback(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load feedback');
      console.error('Error loading feedback:', err);
    }
  };

  // Reset interview
  const handleReset = () => {
    setSessionId(null);
    setIsInterviewActive(false);
    setCurrentQuestion('');
    setCurrentRound(0);
    setUserAnswer('');
    setMessages([]);
    setShowFeedback(false);
    setFeedbackData(null);
    setError(null);
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎯 AI Interview Practice
          </h1>
          <p className="text-gray-600">
            Practice your interview skills with AI-powered feedback
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        {/* Start Screen */}
        {!isInterviewActive && !showFeedback && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">🤖</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Ready to Practice?
              </h2>
              <p className="text-gray-600">
                Answer questions and receive instant AI-powered feedback
              </p>
            </div>

            {/* Settings */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={numRounds}
                onChange={(e) => setNumRounds(Number(e.target.value))}
                className="w-full max-w-xs mx-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value={1}>1 Question</option>
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isLoading ? 'Starting...' : 'Start Interview'}
            </button>
          </div>
        )}

        {/* Interview Screen */}
        {isInterviewActive && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentRound} of {totalRounds}
                </span>
                <span className="text-sm font-medium text-indigo-600">
                  {competency}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentRound / totalRounds) * 100}%` }}
                />
              </div>
            </div>

            {/* Chat Messages */}
            <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[500px] overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : message.score !== undefined
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>

                      {/* Show justification if present */}
                      {message.justification && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-sm text-gray-700">
                            💡 <strong>Feedback:</strong> {message.justification}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Box */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here... (Press Enter to submit, Shift+Enter for new line)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  disabled={isLoading}
                >
                  End Interview
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isLoading || !userAnswer.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Submit Answer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Screen */}
        {showFeedback && feedbackData && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Interview Complete!
              </h2>
              <p className="text-gray-600">Here's how you performed</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-4xl font-bold text-indigo-600">
                  {feedbackData.average_score.toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Performance Band</p>
                <p className="text-4xl font-bold text-blue-600">
                  {feedbackData.average_band}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Questions</p>
                <p className="text-4xl font-bold text-green-600">
                  {feedbackData.total_questions}
                </p>
              </div>
            </div>

            {/* Detailed Evaluations */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Detailed Feedback
              </h3>
              <div className="space-y-4">
                {feedbackData.evaluations.map((evaluation, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        Round {evaluation.round}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">
                          Score: {evaluation.score.toFixed(2)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            evaluation.band === 'L4'
                              ? 'bg-green-100 text-green-700'
                              : evaluation.band === 'L3'
                              ? 'bg-blue-100 text-blue-700'
                              : evaluation.band === 'L2'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {evaluation.band}
                        </span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Question:
                      </p>
                      <p className="text-gray-800">{evaluation.question}</p>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Your Answer:
                      </p>
                      <p className="text-gray-700 bg-gray-50 rounded p-2">
                        {evaluation.answer}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Feedback:
                      </p>
                      <p className="text-gray-700 bg-blue-50 rounded p-2">
                        {evaluation.justification}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Start New Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
