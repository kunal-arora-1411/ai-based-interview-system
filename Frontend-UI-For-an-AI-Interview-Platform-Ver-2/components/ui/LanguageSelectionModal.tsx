import React from 'react';

interface LanguageSelectionModalProps {
    onClose: () => void;
    onSelectLanguage: (language: string) => void;
    currentLanguage: string;
}

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese'];

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({ onClose, onSelectLanguage, currentLanguage }) => {
    
    const handleSelect = (lang: string) => {
        onSelectLanguage(lang);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="glass-card shadow-glass-glow w-full max-w-md p-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Select Language</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-500/10 dark:hover:bg-slate-700/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    {LANGUAGES.map(lang => (
                        <button 
                            key={lang}
                            onClick={() => handleSelect(lang)}
                            className={`p-4 rounded-lg font-semibold transition-colors text-center ${
                                currentLanguage === lang 
                                ? 'bg-amber-600 text-white' 
                                : 'bg-slate-500/10 hover:bg-slate-500/20'
                            }`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LanguageSelectionModal;