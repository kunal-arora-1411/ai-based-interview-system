import React, { useState, useEffect, useRef } from 'react';
import { Screen, ScreenProps } from '../../types';

interface TopBarProps extends Pick<ScreenProps, 'currentScreen' | 'theme' | 'goBack' | 'navigationHistory'> {
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const getScreenTitle = (screen: Screen) => {
    switch(screen) {
        case Screen.Dashboard: return "Dashboard";
        case Screen.PracticeCenter: return "Practice Center";
        case Screen.History: return "Feedback History";
        case Screen.Profile: return "Profile & Settings";
        case Screen.Schedule: return "Schedule";
        case Screen.Support: return "Support Center";
        default: return "AI Copilot";
    }
}

const TopBar: React.FC<TopBarProps> = ({ setIsSidebarOpen, currentScreen, theme, goBack, navigationHistory }) => {
    const title = getScreenTitle(currentScreen!);
    const buttonHoverClass = theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-slate-900/5';
    const canGoBack = navigationHistory && navigationHistory.length > 1;

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const notifications = [
        { id: 1, text: "New feedback received for 'Senior Frontend' interview.", time: "2h ago", read: false },
        { id: 2, text: "Your upcoming interview with Innovate Inc. is in 3 days.", time: "1d ago", read: false },
        { id: 3, text: "Welcome to AI Copilot! Complete your profile to get started.", time: "3d ago", read: true },
    ];

    return (
        <header className={`relative z-30 layout-bg flex items-center justify-between p-4 md:p-6 border-b`}>
            <div className="flex items-center gap-2">
                 <button onClick={() => setIsSidebarOpen(true)} className={`lg:hidden p-2 rounded-full ${buttonHoverClass}`}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
                </button>
                {canGoBack && (
                    <button
                        onClick={() => goBack?.()}
                        title="Go back"
                        className={`p-2 rounded-full ${buttonHoverClass}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                    </button>
                )}
                <h1 className="text-xl font-bold ml-2">{title}</h1>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="relative" ref={notificationsRef}>
                    <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`relative p-2 rounded-full ${buttonHoverClass}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {isNotificationsOpen && (
                        <div className="absolute top-full right-0 mt-3 w-80 popover-card p-4 animate-fade-in origin-top-right z-50">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold">Notifications</h3>
                                <button className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">Mark all as read</button>
                            </div>
                            <ul className="space-y-3 max-h-80 overflow-y-auto">
                                {notifications.map(n => (
                                    <li key={n.id} className="flex gap-3 items-center">
                                        {!n.read && <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />}
                                        <div className={n.read ? 'pl-5' : ''}>
                                            <p className={`text-sm ${n.read ? 'text-slate-600 dark:text-slate-400' : 'font-semibold'}`}>{n.text}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500">{n.time}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400">
                    <img src="https://picsum.photos/seed/alex/100" alt="User avatar" className="w-full h-full object-cover rounded-full" />
                </div>
            </div>
        </header>
    );
};

export default TopBar;