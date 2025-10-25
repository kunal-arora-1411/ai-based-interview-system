import React from 'react';

interface FeedbackModalProps {
    isVisible: boolean;
    transcript: string;
    timestamp: string;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isVisible, transcript, timestamp, onClose }) => {
    if (!isVisible) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[200] flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: isVisible ? 1 : 0 }}
            onClick={onClose}
        >
            <div className="glass-card shadow-glass-glow w-full max-w-2xl p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                </button>
                <h2 className="text-xl font-bold mb-4">Reviewing Your Answer</h2>
                <div className="w-full h-64 bg-black rounded-lg mb-4 flex items-center justify-center text-slate-400">
                    Simulated Video Playback at Timestamp [{timestamp}]
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Your Transcript:</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-500/10 p-3 rounded-md max-h-32 overflow-y-auto">
                        {transcript}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;