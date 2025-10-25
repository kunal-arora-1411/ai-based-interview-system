import React from 'react';

type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface AiAvatarProps {
  state: AvatarState;
}

const AiAvatar: React.FC<AiAvatarProps> = ({ state }) => {
    const isBreathing = state === 'idle';
    const isListening = state === 'listening';
    const isThinking = state === 'thinking';
    const isSpeaking = state === 'speaking';

    return (
        <div className="relative w-72 h-72 md:w-96 md:h-96">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                <defs>
                    <radialGradient id="avatarGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style={{ stopColor: 'hsl(var(--brand-primary))', stopOpacity: 0.6 }} />
                        <stop offset="100%" style={{ stopColor: 'hsl(var(--brand-secondary))', stopOpacity: 0.2 }} />
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#avatarGradient)" />
                
                {/* Listening indicator rings */}
                {isListening && (
                    <>
                        <circle cx="100" cy="100" r="85" fill="none" stroke="hsl(var(--brand-primary))" strokeWidth="1" className="avatar-listening-ring" style={{ animationDelay: '0s' }} />
                        <circle cx="100" cy="100" r="85" fill="none" stroke="hsl(var(--brand-primary))" strokeWidth="1" className="avatar-listening-ring" style={{ animationDelay: '0.5s' }} />
                    </>
                )}
                
                {/* Thinking scanner ring */}
                <circle
                    cx="100" cy="100" r="90"
                    fill="none"
                    stroke="hsl(var(--brand-secondary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={isThinking ? 'avatar-thinking-scanner' : ''}
                    opacity={isThinking ? 1 : 0}
                    style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                />

                 {/* Inner "core" element */}
                <circle cx="100" cy="100" r="10" fill="hsl(var(--brand-text))" opacity="0.3" />
            </svg>
            
            <div
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${isBreathing ? 'avatar-breathing' : ''} ${isSpeaking ? 'avatar-speaking' : ''}`}
            >
                <div className="w-full h-full rounded-full opacity-30 filter blur-3xl" style={{ backgroundColor: 'hsl(var(--brand-primary))' }}></div>
            </div>
        </div>
    );
};

export default AiAvatar;