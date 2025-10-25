import React, { useState, useEffect, useLayoutEffect } from 'react';

interface TutorialGuideProps {
    onFinish: () => void;
}

const TOUR_STEPS = [
    {
        elementId: 'tour-step-1',
        title: "Start a New Interview",
        description: "Click here to begin a new session. You can choose a quick practice or a custom interview tailored to a specific job.",
        position: 'bottom-end',
    },
    {
        elementId: 'tour-step-2',
        title: "Track Your Progress",
        description: "This chart visualizes your improvement over time across key competencies. Watch your skills grow with each session!",
        position: 'bottom',
    },
    {
        elementId: 'tour-step-3',
        title: "Review Past Interviews",
        description: "Access detailed feedback reports from all your previous interviews. See what went well and where you can improve.",
        position: 'right',
    },
    {
        elementId: 'root', // Fallback to the whole screen
        title: "You're All Set!",
        description: "That's a quick overview of your dashboard. You're now ready to start practicing and acing your interviews. Good luck!",
        position: 'center',
    }
];

const TutorialGuide: React.FC<TutorialGuideProps> = ({ onFinish }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [highlightStyle, setHighlightStyle] = useState({});
    const [popoverStyle, setPopoverStyle] = useState({});
    const [popoverClass, setPopoverClass] = useState('visible');

    const currentStep = TOUR_STEPS[stepIndex];
    const isLastStep = stepIndex === TOUR_STEPS.length - 1;

    useLayoutEffect(() => {
        const calculatePosition = () => {
            const element = document.getElementById(currentStep.elementId);
            if (!element) {
                // Center on screen if element not found or for the last step
                const width = window.innerWidth;
                const height = window.innerHeight;
                setHighlightStyle({ top: height/2, left: width/2, width: 0, height: 0 });
                setPopoverStyle({ top: `calc(50% - 100px)`, left: `calc(50% - 160px)` });
                return;
            };

            const rect = element.getBoundingClientRect();
            const popoverHeight = 200; // Estimated height
            const popoverWidth = 320;
            const padding = 12;

            setHighlightStyle({
                top: rect.top - 8,
                left: rect.left - 8,
                width: rect.width + 16,
                height: rect.height + 16,
            });

            let popoverTop = 0;
            let popoverLeft = 0;

            switch (currentStep.position) {
                case 'bottom-end':
                    popoverTop = rect.bottom + padding;
                    popoverLeft = rect.right - popoverWidth;
                    break;
                case 'bottom':
                    popoverTop = rect.bottom + padding;
                    popoverLeft = rect.left + rect.width / 2 - popoverWidth / 2;
                    break;
                case 'right':
                    popoverTop = rect.top + rect.height / 2 - popoverHeight / 2;
                    popoverLeft = rect.right + padding;
                    break;
                case 'center':
                    popoverTop = window.innerHeight / 2 - popoverHeight / 2;
                    popoverLeft = window.innerWidth / 2 - popoverWidth / 2;
                    break;
                default:
                    popoverTop = rect.bottom + padding;
                    popoverLeft = rect.left;
            }
            
            // Boundary checks
            if (popoverLeft < padding) popoverLeft = padding;
            if (popoverLeft + popoverWidth > window.innerWidth - padding) {
                popoverLeft = window.innerWidth - popoverWidth - padding;
            }

            setPopoverStyle({ top: `${popoverTop}px`, left: `${popoverLeft}px` });
        };

        setPopoverClass('hidden');
        const timer = setTimeout(() => {
            calculatePosition();
            setPopoverClass('visible');
        }, 500); // Wait for transition of highlight

        window.addEventListener('resize', calculatePosition);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculatePosition);
        };
    }, [stepIndex, currentStep]);

    const handleNext = () => {
        if (!isLastStep) {
            setStepIndex(stepIndex + 1);
        } else {
            onFinish();
        }
    };

    return (
        <div className="tutorial-backdrop animate-fade-in">
            <div className="tutorial-highlight-area" style={highlightStyle} />
            <div className={`tutorial-popover ${popoverClass}`} style={popoverStyle}>
                <div className="glass-card p-6 shadow-glass-glow no-hover-effect">
                    <h3 className="font-bold text-lg mb-2">{currentStep.title}</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{currentStep.description}</p>
                    <div className="flex justify-between items-center">
                        <button onClick={onFinish} className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:underline">
                            Skip Tour
                        </button>
                        <button onClick={handleNext} className="btn-primary py-2 px-5">
                            {isLastStep ? "Finish" : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialGuide;