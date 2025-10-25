import React from 'react';
import type { Theme } from '../../types';

interface ThemeToggleProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isPublic?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme, isPublic }) => {
    const isDark = theme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    const iconClasses = "absolute transition-opacity duration-300 ease-in-out transform";
    const sunIconClasses = `${iconClasses} ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`;
    const moonIconClasses = `${iconClasses} ${!isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`;

    const positionClass = isPublic ? 'top-24 right-6' : 'bottom-6 right-6';

    return (
        <button
            onClick={toggleTheme}
            className={`fixed ${positionClass} z-50 glass-card no-hover-effect p-3 rounded-full shadow-glass-glow flex items-center justify-center w-12 h-12`}
        >
            {/* FIX: Corrected the malformed viewBox attribute from '0 0 24" 24"' to '0 0 24 24'. */}
            <svg id="sun-icon" className={sunIconClasses} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            {/* FIX: Corrected the malformed viewBox attribute from '0 0 24" 24"' to '0 0 24 24'. This resolves multiple parsing errors. */}
            <svg id="moon-icon" className={moonIconClasses} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>
    );
};

export default ThemeToggle;