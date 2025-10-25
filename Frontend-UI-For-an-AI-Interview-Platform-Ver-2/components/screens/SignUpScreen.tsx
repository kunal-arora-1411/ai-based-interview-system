import React, { useState, useEffect } from 'react';
import { Screen, ScreenProps } from '../../types';

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    width: string;
}

const SignUpScreen: React.FC<ScreenProps> = ({ navigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, label: '', color: '', width: '0%' });
    const [isFormValid, setIsFormValid] = useState(false);
    
    const handleSignUp = () => {
        navigate(Screen.Onboarding);
    };

    const checkPasswordStrength = (pass: string): PasswordStrength => {
        let score = 0;
        if (!pass) return { score: 0, label: '', color: 'bg-transparent', width: '0%' };

        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        
        switch (score) {
            case 1: return { score, label: 'Weak', color: 'bg-red-500', width: '25%' };
            case 2: return { score, label: 'Medium', color: 'bg-yellow-500', width: '50%' };
            case 3: return { score, label: 'Strong', color: 'bg-green-500', width: '75%' };
            case 4: return { score, label: 'Very Strong', color: 'bg-green-500', width: '100%' };
            default: return { score, label: 'Too weak', color: 'bg-red-500', width: '10%' };
        }
    };

    useEffect(() => {
        setPasswordStrength(checkPasswordStrength(password));
    }, [password]);

    useEffect(() => {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = passwordStrength.score >= 2;
        const isNameValid = name.trim() !== '';
        setIsFormValid(isEmailValid && isPasswordValid && isNameValid && agreedToTerms);
    }, [name, email, passwordStrength.score, agreedToTerms]);


    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="glass-card shadow-glass-glow w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-center mb-2">Create Your Account</h1>
                <p className="text-center text-slate-700 dark:text-slate-400 mb-6">Start your journey to interview mastery.</p>
                
                <div className="space-y-3 mb-4">
                    <button className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 transition-colors font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Continue with Google
                    </button>
                </div>
                
                <div className="flex items-center my-6">
                    <hr className="w-full border-slate-500/20" />
                    <span className="px-2 text-xs text-slate-700 dark:text-slate-400">OR</span>
                    <hr className="w-full border-slate-500/20" />
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                        <input id="name" type="text" placeholder="Alex Doe" value={name} onChange={(e) => setName(e.target.value)} className="block w-full rounded-md border-0 bg-slate-500/10 py-2.5 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                        <input id="email" type="email" placeholder="alex.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border-0 bg-slate-500/10 py-2.5 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition" />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium mb-2">Password</label>
                        <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md border-0 bg-slate-500/10 py-2.5 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition" />
                        {password && (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="w-full h-1.5 bg-slate-500/20 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full password-strength-bar-fill ${passwordStrength.color}`} style={{ width: passwordStrength.width }}></div>
                                </div>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-24 text-right">{passwordStrength.label}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="terms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-slate-500/50 rounded bg-transparent" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="text-slate-700 dark:text-slate-400">I agree to the <a href="#" className="font-medium text-amber-600 dark:text-amber-400 hover:underline">Terms of Service</a></label>
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className="w-full btn-primary text-lg"
                    >
                        Create Account
                    </button>
                </form>
                <p className="text-center text-sm text-slate-700 dark:text-slate-400 mt-6">
                    Already have an account? <button onClick={() => navigate(Screen.Login)} className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300">Log in</button>
                </p>
            </div>
        </div>
    );
};

export default SignUpScreen;