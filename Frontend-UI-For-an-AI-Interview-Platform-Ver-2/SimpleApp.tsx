import React from 'react';
import { VoiceInterview } from './VoiceInterview';

/**
 * App with Voice Support
 *
 * Features:
 * - Voice recording (Speech-to-Text with Whisper)
 * - AI voice responses (Text-to-Speech)
 * - Real-time grading
 * - Feedback display
 *
 * Use VoiceInterview for full STT/TTS support
 * Or use SimpleInterview for text-only version
 */
export function App() {
  return <VoiceInterview />;
}

export default App;
