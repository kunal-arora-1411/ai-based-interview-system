import React from 'react';
import { Screen, ScreenProps } from '../../types';

const BriefingRoomScreen: React.FC<ScreenProps & { companyName?: string }> = ({ navigate, companyName }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="glass-card shadow-glass-glow w-full max-w-2xl p-8 md:p-12 text-left animate-fade-in">
                <h1 className="text-2xl font-bold mb-2 text-center">Interview Briefing</h1>
                <p className="text-center text-slate-700 dark:text-slate-300 mb-6">
                    You are about to begin your interview with <span className="font-bold text-amber-600 dark:text-amber-400">{companyName || "the company"}</span>.
                </p>

                <div className="space-y-4 bg-slate-500/10 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold border-b border-slate-500/20 pb-2 mb-3">Rules of Engagement:</h2>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-xl">✅</div>
                        <p>This interview will consist of <strong>{5} questions</strong>.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-xl">🤖</div>
                        <p>The AI will assess your skills based on your answers to the questions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-xl">❌</div>
                        <p>Please note: The AI <strong>does not</strong> analyze your personality, sentiment, or non-verbal cues from the video feed.</p>
                    </div>
                     <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-xl">💡</div>
                        <p>Please speak clearly and do your best to answer each question completely.</p>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={() => navigate(Screen.SystemCheck)}
                        className="w-full btn-primary py-3 text-lg"
                    >
                        I Understand, Proceed to System Check
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BriefingRoomScreen;