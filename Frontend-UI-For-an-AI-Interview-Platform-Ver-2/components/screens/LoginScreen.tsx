import React, { useState } from 'react';
import { Screen, ScreenProps } from '../../types';

const LoginScreen: React.FC<ScreenProps> = ({ navigate }) => {
    const [showPassword, setShowPassword] = useState(false);

    // In a real app, this would be a full login form.
    // For this demo, we'll just navigate to the main app.
    const handleLogin = () => {
        // Here you would typically set an auth state
        // For now, we go to Dashboard for returning users.
        navigate(Screen.Dashboard);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="glass-card shadow-glass-glow w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-center mb-2">Welcome Back!</h1>
                <p className="text-center text-slate-700 dark:text-slate-400 mb-6">Log in to continue your journey.</p>

                <div className="space-y-3 mb-4">
                    <button onClick={handleLogin} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 transition-colors font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Continue with Google
                    </button>
                     <button onClick={handleLogin} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 transition-colors font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.292 0 .319.217.694.825.576A12.015 12.015 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                        Continue with GitHub
                    </button>
                </div>
                
                <div className="flex items-center my-6">
                    <hr className="w-full border-slate-500/20" />
                    <span className="px-2 text-xs text-slate-700 dark:text-slate-400">OR</span>
                    <hr className="w-full border-slate-500/20" />
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                        <input id="email" type="email" defaultValue="alex.doe@example.com" className="block w-full rounded-md border-0 bg-slate-500/10 py-2.5 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition" />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium mb-2">Password</label>
                         <div className="relative">
                            <input 
                                id="password" 
                                type={showPassword ? 'text' : 'password'}
                                defaultValue="password" 
                                className="block w-full rounded-md border-0 bg-slate-500/10 py-2.5 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition" 
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                                )}
                            </button>
                        </div>
                    </div>
                     <div className="flex justify-end">
                        <a href="#" className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline">Forgot password?</a>
                    </div>
                    <button
                        type="submit"
                        className="w-full btn-primary text-lg"
                    >
                        Log In
                    </button>
                </form>
                <p className="text-center text-sm text-slate-700 dark:text-slate-400 mt-6">
                    Don't have an account? <button onClick={() => navigate(Screen.SignUp)} className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300">Sign up</button>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;