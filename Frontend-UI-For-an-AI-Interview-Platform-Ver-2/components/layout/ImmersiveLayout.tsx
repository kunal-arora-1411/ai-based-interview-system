import React from 'react';
import { Screen, ScreenProps } from '../../types';
import AiAvatar from '../ui/AiAvatar';
import Sidebar from './Sidebar';
import ThemeToggle from '../ui/ThemeToggle';

const ImmersiveLayout: React.FC<ScreenProps & { children: React.ReactNode }> = ({ 
    children, navigate, currentScreen, isSidebarOpen, setIsSidebarOpen, theme, setTheme, aiState
}) => {
    
    return (
        <div className="w-full h-screen bg-black relative overflow-hidden">
            {/* Background Avatar */}
            <div className="absolute inset-[-20%] md:inset-[-10%] w-[140%] md:w-[120%] h-[140%] md:h-[120%] flex items-center justify-center">
                <AiAvatar state={aiState || 'idle'} />
            </div>
            <div className="interview-bg-overlay" />

            {/* Sidebar as an overlay */}
            <Sidebar 
                currentScreen={currentScreen!} 
                navigate={navigate} 
                isOpen={isSidebarOpen!} 
                setIsOpen={setIsSidebarOpen!} 
                layout="immersive"
            />
            {/* Backdrop for when sidebar is open */}
            {isSidebarOpen && (
                 <div 
                    onClick={() => setIsSidebarOpen!(false)} 
                    className="absolute inset-0 bg-black/50 z-30" 
                />
            )}
            
            {/* Main UI */}
            <main className="relative z-10 w-full h-full flex flex-col">
                {/* Top Left Controls */}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
                    <button 
                        onClick={() => setIsSidebarOpen!(!isSidebarOpen)} 
                        className="bg-black/30 backdrop-blur-sm p-3 rounded-full text-white"
                        title="Toggle Menu"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
                    </button>
                </div>

                {/* Theme Toggle is outside the main flow to avoid being affected by padding */}
                <ThemeToggle theme={theme!} setTheme={setTheme!} />

                <div className="flex-1 p-4 sm:p-6 flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default ImmersiveLayout;
