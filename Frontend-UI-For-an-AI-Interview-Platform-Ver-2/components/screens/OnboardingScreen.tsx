import React from 'react';
import { Screen, ScreenProps } from '../../types';

const OnboardingScreen: React.FC<ScreenProps> = ({ navigate }) => {
    
    const handleContinue = () => {
        navigate(Screen.Dashboard);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="glass-card shadow-glass-glow w-full max-w-lg p-8 text-center">
                <h1 className="text-2xl font-bold mb-2">Welcome to AI Copilot!</h1>
                <p className="text-slate-700 dark:text-slate-400 mb-6">
                    You're all set. Let's head to your personalized dashboard where you can start practicing, track your progress, and more.
                </p>
                <button
                    onClick={handleContinue}
                    className="w-full btn-primary text-lg"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default OnboardingScreen;