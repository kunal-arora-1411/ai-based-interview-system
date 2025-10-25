import React from 'react';
import { Screen, ScreenProps } from '../../types';

const PracticeScreen: React.FC<ScreenProps> = ({ navigate, interviewMode }) => {
    const isOfficial = interviewMode === 'official';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="glass-card shadow-glass-glow text-center w-full max-w-2xl p-8 md:p-12 animate-fade-in">
                <h1 className="text-2xl font-bold mb-2">{isOfficial ? "Final System Check" : "Practice & System Check"}</h1>
                <p className="text-slate-700 dark:text-slate-300 mb-6">
                    Let's make sure your camera and microphone are working correctly before you begin.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-500/10 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Camera</h3>
                        <div className="aspect-video bg-black rounded flex items-center justify-center text-slate-400">
                             <img src="https://picsum.photos/seed/camera/600/400" className="w-full h-full object-cover rounded" alt="User video feed" />
                        </div>
                    </div>
                     <div className="bg-slate-500/10 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Microphone</h3>
                         <div className="aspect-video bg-black rounded flex items-center justify-center text-slate-400 overflow-hidden">
                             <div className="flex items-center justify-center gap-1 h-full">
                                <div className="w-2 h-4 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                                <div className="w-2 h-10 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                                <div className="w-2 h-6 bg-amber-500 rounded-full animate-bounce"></div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                     <button
                        onClick={() => navigate(isOfficial ? Screen.BriefingRoom : Screen.PracticeCenter)}
                        className="bg-slate-500/20 hover:bg-slate-500/40 font-bold py-3 rounded-full text-lg flex-1 order-2 sm:order-1"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => navigate(isOfficial ? Screen.WaitingRoom : Screen.Interview)}
                        className="btn-primary py-3 text-lg flex-1 order-1 sm:order-2"
                    >
                        {isOfficial ? "Proceed to Interview" : "Start Practice Session"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PracticeScreen;