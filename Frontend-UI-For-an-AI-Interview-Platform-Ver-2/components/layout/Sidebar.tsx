import React, { useState, useEffect, useRef } from 'react';
import { Screen, ScreenProps } from '../../types';

const NavItem: React.FC<{
    screen: Screen;
    label: string;
    icon: React.ReactNode;
    currentScreen: Screen;
    navigate: ScreenProps['navigate'];
    isCollapsed?: boolean;
    layout: 'standard' | 'immersive';
}> = ({ screen, label, icon, currentScreen, navigate, isCollapsed, layout }) => {
    const isActive = currentScreen === screen;
    const baseClasses = "flex items-center gap-4 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 w-full";
    
    const standardActive = "bg-amber-600/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400";
    const standardInactive = "text-slate-700 dark:text-slate-300 hover:bg-slate-900/10 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100";
    
    const immersiveActive = "bg-white/20 text-white";
    const immersiveInactive = "text-slate-300 hover:bg-white/10";
    
    const activeClasses = layout === 'standard' ? standardActive : immersiveActive;
    const inactiveClasses = layout === 'standard' ? standardInactive : immersiveInactive;
    
    return (
        <li>
            <button
                onClick={() => navigate(screen)}
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? label : ''}
            >
                {icon}
                {!isCollapsed && <span className="flex-1 text-left">{label}</span>}
            </button>
        </li>
    );
};

const NAV_ITEMS = [
    { screen: Screen.Dashboard, label: "Dashboard", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { screen: Screen.PracticeCenter, label: "Practice Center", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0 0 12 22z" /><path d="m7.5 12.5 2 2 4-4" /></svg> },
    { screen: Screen.History, label: "History", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg> },
    { screen: Screen.Schedule, label: "Schedule", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> },
];

interface SidebarProps extends Pick<ScreenProps, 'currentScreen' | 'navigate' | 'theme'> {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isCollapsed?: boolean;
    setIsCollapsed?: (isCollapsed: boolean) => void;
    layout?: 'standard' | 'immersive';
}

const Sidebar: React.FC<SidebarProps> = ({ 
    currentScreen, navigate, theme, isOpen, setIsOpen, 
    isCollapsed = false, setIsCollapsed, layout = 'standard' 
}) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (layout === 'immersive') {
        return (
            <aside className={`fixed top-0 left-0 h-full z-40 bg-black/50 backdrop-blur-lg p-4 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{width: '280px'}}>
                 <div className="flex items-center gap-3 mb-8 px-2">
                     <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-lg flex items-center justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    </div>
                    <h1 className="text-xl font-bold text-white">AI Copilot</h1>
                </div>
                <nav>
                    <ul className="space-y-2">
                        {NAV_ITEMS.map(item => <NavItem key={item.screen} {...item} currentScreen={currentScreen!} navigate={navigate} layout={layout} />)}
                    </ul>
                </nav>
            </aside>
        );
    }
    
    return (
        <aside className={`layout-bg h-full flex flex-col p-4 transition-all duration-300 border-r ${isCollapsed ? 'w-24' : 'w-72'}`}>
            <div className={`flex items-center gap-3 mb-8 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                </div>
                {!isCollapsed && <h1 className="text-xl font-bold">AI Copilot</h1>}
            </div>
            
            <nav className="flex-1">
                <ul className="space-y-2">
                    {NAV_ITEMS.map(item => <NavItem key={item.screen} {...item} currentScreen={currentScreen!} navigate={navigate} isCollapsed={isCollapsed} layout={layout} />)}
                </ul>
            </nav>
            
            <div className="border-t pt-4 relative" style={{borderColor: 'var(--glass-border)'}} ref={menuRef}>
                {isUserMenuOpen && (
                    <div className="absolute bottom-full mb-2 w-full popover-card p-2 animate-fade-in">
                        <ul className="space-y-1">
                            <NavItem screen={Screen.Profile} label="Profile" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} currentScreen={currentScreen!} navigate={navigate} isCollapsed={isCollapsed} layout={layout} />
                            <NavItem screen={Screen.Support} label="Support" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="9.17" y1="14.83" x2="4.93" y2="19.07"></line><line x1="19.07" y1="4.93" x2="14.83" y2="9.17"></line></svg>} currentScreen={currentScreen!} navigate={navigate} isCollapsed={isCollapsed} layout={layout} />
                            <li>
                                <button onClick={() => navigate(Screen.Landing)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-900/10 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100 ${isCollapsed ? 'justify-center' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                    {!isCollapsed && <span className="flex-1 text-left">Log Out</span>}
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className={`w-full flex items-center gap-4 p-2 rounded-lg transition-colors ${isUserMenuOpen ? 'bg-slate-900/5 dark:bg-slate-700/50' : ''} hover:bg-slate-900/5 dark:hover:bg-slate-700/50`}>
                    <img src="https://picsum.photos/seed/alex/100" alt="User avatar" className="w-10 h-10 object-cover rounded-full" />
                    {!isCollapsed && (
                        <div className="flex-1 text-left">
                            <p className="font-semibold">Alex Doe</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">alex.doe@example.com</p>
                        </div>
                    )}
                </button>
            </div>
            
            <div className="border-t pt-4 mt-4" style={{borderColor: 'var(--glass-border)'}}>
                 <button onClick={() => setIsCollapsed?.(!isCollapsed)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-semibold text-slate-700 dark:text-slate-400 hover:bg-slate-900/10 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100 ${isCollapsed ? 'justify-center' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}><path d="M15 18l-6-6 6-6"/></svg>
                    {!isCollapsed && <span>Collapse</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;