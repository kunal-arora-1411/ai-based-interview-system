import React, { useEffect } from 'react';
import { Screen, ScreenProps } from '../../types';

const FinishedScreen: React.FC<ScreenProps & { companyName?: string, drillType?: string }> = ({ navigate, interviewMode, companyName, drillType }) => {
    
    const isOfficial = interviewMode === 'official';
    const isDrill = !!drillType;

    useEffect(() => {
        let destination = Screen.Feedback;
        if (isOfficial) {
            destination = Screen.Schedule;
        } else if (isDrill) {
            destination = Screen.PracticeCenter;
        }

        const timer = setTimeout(() => {
            navigate(destination);
        }, 4000); 

        return () => clearTimeout(timer);
    }, [navigate, isOfficial, isDrill]);

    let title = "Practice Session Complete!";
    let message = "Great session! You're showing strong improvement. We are now processing your results and generating detailed feedback.";

    if (isOfficial) {
        title = "Interview Submitted";
        message = `Thank you. Your interview has been securely submitted to the hiring team at ${companyName || 'the company'}. They will be in touch with you regarding the next steps.`;
    } else if (isDrill) {
        title = "Drill Complete!";
        message = `Great work on your ${drillType} drill! Consistent practice is the key to success. You are now being returned to the dashboard.`;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="glass-card shadow-glass-glow text-center w-full max-w-lg p-8 md:p-12 animate-fade-in">
                <svg className="mx-auto text-amber-500 w-16 h-16 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
                <p className="text-slate-700 dark:text-slate-300">
                    {message}
                </p>
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-amber-400 mx-auto mt-8"></div>
            </div>
        </div>
    );
};

export default FinishedScreen;