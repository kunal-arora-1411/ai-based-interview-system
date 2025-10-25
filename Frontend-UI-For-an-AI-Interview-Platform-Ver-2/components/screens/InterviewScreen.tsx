import React, { useState, useEffect, useRef } from 'react';
import { Screen, ScreenProps, AiState } from '../../types';
import { INTERVIEW_FLOW, SAMPLE_ANSWERS, DRILL_QUESTIONS, USER_QUESTIONS_DATA } from '../../constants';
import DraggableVideo from '../ui/DraggableVideo';
import LanguageSelectionModal from '../ui/LanguageSelectionModal';

const InterviewScreen: React.FC<ScreenProps> = ({ navigate, interviewMode, drillType, aiState, setAiState }) => {
    const [interviewPhase, setInterviewPhase] = useState<'answering' | 'asking'>('answering');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionText, setQuestionText] = useState('');
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isCaptionsOn, setIsCaptionsOn] = useState(true);
    const [transcript, setTranscript] = useState("");
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    
    const questionFlow = drillType ? (DRILL_QUESTIONS[drillType] || INTERVIEW_FLOW) : INTERVIEW_FLOW;
    const currentQuestion = questionFlow[currentQuestionIndex];
    const isPractice = interviewMode === 'practice';
    const transcriptInterval = useRef<number | null>(null);

    // Main interview flow logic for answering phase
    useEffect(() => {
        if (interviewPhase !== 'answering') return;

        setAiState?.('thinking');
        setQuestionText('');
        const timer = setTimeout(() => {
            setAiState?.('speaking');
            const preamble = isPractice && !drillType && currentQuestionIndex === 0 ? "Alright, let's begin. " : "";
            setQuestionText(preamble + currentQuestion.question);
        }, 2500);
        return () => clearTimeout(timer);
    }, [currentQuestionIndex, interviewPhase, isPractice, drillType, setAiState, currentQuestion.question]);

    // Simulated transcription effect
    useEffect(() => {
        if (aiState === 'listening') {
            const answer = SAMPLE_ANSWERS[currentQuestionIndex] || "I'm thinking about that.";
            const words = answer.split(" ");
            let wordIndex = 0;
            setTranscript("");

            transcriptInterval.current = window.setInterval(() => {
                if (wordIndex < words.length) {
                    setTranscript(prev => (prev ? prev + " " : "") + words[wordIndex]);
                    wordIndex++;
                } else if (transcriptInterval.current) {
                    clearInterval(transcriptInterval.current);
                }
            }, 150);
        }
        return () => {
            if (transcriptInterval.current) clearInterval(transcriptInterval.current);
        };
    }, [aiState, currentQuestionIndex]);


    const handleReadyToAnswer = () => setAiState?.('listening');
    
    const handleFinishInterview = () => {
        navigate(Screen.Finished, { drillType });
    };

    const handleDoneAnswering = () => {
        if (transcriptInterval.current) clearInterval(transcriptInterval.current);
        setTranscript("");
        
        if (currentQuestionIndex < questionFlow.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            if (drillType) {
                handleFinishInterview();
            } else {
                setAiState?.('thinking');
                setTimeout(() => {
                    setInterviewPhase('asking');
                    setQuestionText("That was my final question. Do you have any questions for me?");
                    setAiState?.('speaking');
                }, 2000);
            }
        }
    };
    
    const handleAskQuestion = (answer: string) => {
        setAiState?.('thinking');
        setQuestionText('');
        setTimeout(() => {
            setAiState?.('speaking');
            setQuestionText(answer);
        }, 2000);
    };

    const displayQuestion = selectedLanguage === 'English' || !questionText
        ? questionText
        : `${questionText} (Translated to ${selectedLanguage})`;

    const renderAnsweringPhase = () => (
        <>
            <div className="h-14 flex items-center justify-center">
                {aiState === 'speaking' && (
                    <button onClick={handleReadyToAnswer} className="btn-primary text-lg px-8 py-3 animate-fade-in">
                        Ready to Answer
                    </button>
                )}
                {aiState === 'listening' && (
                    <button onClick={handleDoneAnswering} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-full text-lg animate-fade-in">
                        Done Answering
                    </button>
                )}
                {aiState === 'thinking' && (
                    <button className="bg-amber-600/50 text-white font-bold py-3 px-12 rounded-full text-lg cursor-wait flex items-center gap-3" disabled>
                        <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                        Thinking...
                    </button>
                )}
            </div>
            <div className="interview-control-bar p-2 flex items-center gap-2">
                <button title="Toggle Microphone" onClick={() => setIsMicMuted(!isMicMuted)} className={`interview-control-btn ${!isMicMuted ? 'active' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg></button>
                <button title="Toggle Camera" onClick={() => setIsCameraOff(!isCameraOff)} className={`interview-control-btn ${!isCameraOff ? 'active' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></button>
                <button title="Toggle Captions" onClick={() => setIsCaptionsOn(!isCaptionsOn)} className={`interview-control-btn ${isCaptionsOn ? 'active' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M8 12h2a1 1 0 0 1 0 2H8v-2Z"/><path d="M14 12h2a1 1 0 0 1 0 2h-2v-2Z"/></svg></button>
                <button title="Translate" onClick={() => setIsLanguageModalOpen(true)} className={`interview-control-btn ${selectedLanguage !== 'English' ? 'active' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
                </button>
                <button title="End Session" onClick={handleFinishInterview} className="interview-control-btn end-call"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></button>
            </div>
        </>
    );

    const renderAskingPhase = () => (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4 animate-fade-in">
             <div className="flex flex-wrap justify-center gap-3">
                 {USER_QUESTIONS_DATA.map((item, index) => (
                    <button key={index} onClick={() => handleAskQuestion(item.answer)} className="user-question-btn">
                        {item.question}
                    </button>
                ))}
            </div>
            <button onClick={handleFinishInterview} className="btn-primary mt-4 px-8 py-3">
                Finish Interview
            </button>
        </div>
    );

    const headerText = drillType ? `Drill ${currentQuestionIndex + 1} of ${questionFlow.length}` : `Question ${currentQuestionIndex + 1} of ${questionFlow.length}`;

    return (
        <>
            {isLanguageModalOpen && (
                <LanguageSelectionModal
                    onClose={() => setIsLanguageModalOpen(false)}
                    onSelectLanguage={setSelectedLanguage}
                    currentLanguage={selectedLanguage}
                />
            )}
            <div className="w-full h-full flex flex-col items-center justify-between">
                <header className="w-full flex justify-center items-start pt-2">
                    <div className="bg-black/30 backdrop-blur-sm text-center text-white p-2 px-4 rounded-full">
                        <p className="font-semibold text-sm">{interviewPhase === 'answering' ? headerText : "Ask Questions"}</p>
                    </div>
                </header>

                <div className="flex-grow" />
                
                <DraggableVideo transcript={transcript} selectedLanguage={selectedLanguage} isCameraOff={isCameraOff} />

                <footer className="flex flex-col items-center gap-6 w-full pb-2">
                    {isCaptionsOn && (
                        <div className={`bg-black/30 backdrop-blur-sm w-auto max-w-3xl p-3 px-5 rounded-full text-center transition-opacity duration-300 ${aiState === 'speaking' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <p className="text-base text-white">{displayQuestion}</p>
                        </div>
                    )}
                    
                    {interviewPhase === 'answering' ? renderAnsweringPhase() : renderAskingPhase()}
                </footer>
            </div>
        </>
    );
};

export default InterviewScreen;