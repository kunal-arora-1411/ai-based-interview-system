import React from 'react';
import { Screen, ScreenProps } from '../../types';

const PublicTopNav: React.FC<Pick<ScreenProps, 'navigate'>> = ({ navigate }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 flex justify-between items-center bg-slate-100/50 dark:bg-slate-900/30 backdrop-blur-lg border-b border-black/10 dark:border-slate-500/20">
            <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-lg flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                </div>
                <h1 className="text-xl font-bold">AI Copilot</h1>
            </div>
            <nav className="flex items-center gap-2 sm:gap-6">
                 <button onClick={() => navigate(Screen.Login)} className="font-semibold hover:text-amber-500 dark:hover:text-amber-400 transition-colors text-sm sm:text-base px-3 py-2 text-slate-800 dark:text-slate-200">
                    Log In
                </button>
                 <button onClick={() => navigate(Screen.SignUp)} className="font-semibold bg-slate-500/10 hover:bg-slate-500/20 py-2 px-4 rounded-full transition-colors text-sm sm:text-base text-slate-800 dark:text-slate-200">
                    Sign Up
                </button>
            </nav>
        </header>
    );
};

export default PublicTopNav;