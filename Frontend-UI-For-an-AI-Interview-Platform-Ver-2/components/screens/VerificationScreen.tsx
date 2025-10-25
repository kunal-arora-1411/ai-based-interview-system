import React from 'react';
import { Screen, ScreenProps } from '../../types';
import { EXTRACTED_SKILLS } from '../../constants';

const VerificationScreen: React.FC<ScreenProps> = ({ navigate }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="glass-card shadow-glass-glow text-center w-full max-w-lg p-8 md:p-12">
                <h1 className="text-2xl font-bold mb-2">Skills Verification</h1>
                <p className="text-slate-700 dark:text-slate-300 mb-6">We've extracted the following key skills. Please confirm they are correct before we proceed.</p>
                
                <div className="mb-8 flex justify-center">
                    <div className="neumorphic-card p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4 text-center text-slate-700 dark:text-slate-400">Extracted Skills</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {EXTRACTED_SKILLS.map(skill => (
                                <span key={skill} className="bg-slate-600/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300 text-sm font-medium px-3 py-1.5 rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate(Screen.CvSetup)}
                        className="bg-slate-500/20 hover:bg-slate-500/40 font-bold py-3 rounded-full text-lg flex-1"
                    >
                        Go Back
                    </button>
                    <button 
                        onClick={() => navigate(Screen.Wizard)}
                        className="btn-primary py-3 text-lg flex-1"
                    >
                        Confirm & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationScreen;