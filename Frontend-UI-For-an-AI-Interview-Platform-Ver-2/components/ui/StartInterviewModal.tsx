import React from 'react';
import { Screen, ScreenProps } from '../../types';

interface StartInterviewModalProps {
    navigate: ScreenProps['navigate'];
    onClose: () => void;
    setInterviewMode: ScreenProps['setInterviewMode'];
}

const StartInterviewModal: React.FC<StartInterviewModalProps> = ({ navigate, onClose, setInterviewMode }) => {

    const handleNavigation = (screen: Screen) => {
        setInterviewMode?.('practice'); // Explicitly set mode to practice
        navigate(screen);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="glass-card shadow-glass-glow w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Choose Your Practice Mode</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-500/10 dark:hover:bg-slate-700/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                    {/* Quick Practice */}
                    <div 
                        onClick={() => handleNavigation(Screen.Wizard)} 
                        className="glass-card p-6 cursor-pointer border border-transparent hover:border-amber-500 transition-all duration-300 group"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Quick Practice</h3>
                        <p className="text-sm text-slate-700 dark:text-slate-400">Jump right in with a general practice session using your saved CV.</p>
                    </div>
                    
                    {/* Custom Practice */}
                    <div 
                        onClick={() => handleNavigation(Screen.CvSetup)} 
                        className="glass-card p-6 cursor-pointer border border-transparent hover:border-amber-500 transition-all duration-300 group"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Custom Practice</h3>
                        <p className="text-sm text-slate-700 dark:text-slate-400">Tailor the interview for a specific job description and CV.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartInterviewModal;