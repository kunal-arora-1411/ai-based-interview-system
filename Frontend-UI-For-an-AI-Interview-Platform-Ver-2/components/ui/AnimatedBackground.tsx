
import React from 'react';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-white dark:bg-[hsl(var(--brand-background))]">
            <div className="absolute w-96 h-96 rounded-full opacity-20 dark:opacity-30 filter blur-3xl animate-float-1" style={{ backgroundColor: 'hsl(var(--brand-primary))' }}></div>
            <div className="absolute w-80 h-80 rounded-full opacity-10 dark:opacity-20 filter blur-3xl animate-float-2" style={{ backgroundColor: 'hsl(var(--brand-secondary))', top: '40vh', left: '70vw' }}></div>
            <div className="absolute w-72 h-72 rounded-full opacity-10 dark:opacity-20 filter blur-3xl animate-float-3" style={{ backgroundColor: 'hsl(var(--brand-text))', top: '60vh', left: '10vw' }}></div>
        </div>
    );
};

export default AnimatedBackground;