import React, { useEffect } from 'react';
import { Screen, ScreenProps } from '../../types';

const WaitingRoomScreen: React.FC<ScreenProps> = ({ navigate }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(Screen.Interview);
        }, 3000); // Wait for 3 seconds before starting

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="glass-card shadow-glass-glow text-center w-full max-w-lg p-8 md:p-12 animate-fade-in">
                 <h1 className="text-2xl font-bold mb-2">Preparing Your Session</h1>
                <p className="text-slate-700 dark:text-slate-300 mb-6">
                    You are in the waiting room. Your AI interviewer will join shortly.
                </p>
                <div className="flex justify-center items-center space-x-2 mt-4">
                    <div className="w-4 h-4 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-4 h-4 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-4 h-4 rounded-full bg-amber-400 animate-bounce"></div>
                </div>
            </div>
        </div>
    );
};

export default WaitingRoomScreen;