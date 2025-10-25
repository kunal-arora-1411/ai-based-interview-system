

import React, { useState, useEffect } from 'react';
import { Screen, ScreenProps } from '../../types';

const PARSING_STEPS = [
    "Analyzing document structure...",
    "Extracting key skills & experiences...",
    "Comparing with job description...",
    "Generating tailored questions...",
    "Analysis complete!"
];

const ParsingScreen: React.FC<ScreenProps> = ({ navigate }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep(prevStep => {
                if (prevStep < PARSING_STEPS.length - 1) {
                    return prevStep + 1;
                } else {
                    clearInterval(timer);
                    navigate(Screen.Verification);
                    return prevStep;
                }
            });
        }, 1500);

        return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="glass-card shadow-glass-glow text-center w-full max-w-lg p-8 md:p-12">
                <div className="flex items-center justify-center gap-4">
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    <p>{PARSING_STEPS[currentStep]}</p>
                </div>
            </div>
        </div>
    );
};

export default ParsingScreen;