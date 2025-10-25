import React, { useState, useEffect } from 'react';

import { Screen, Theme, InterviewMode, AiState } from './types';

// Screens
import LandingScreen from './components/screens/LandingScreen';
import LoginScreen from './components/screens/LoginScreen';
import SignUpScreen from './components/screens/SignUpScreen';
import OnboardingScreen from './components/screens/OnboardingScreen';
import DashboardScreen from './components/screens/DashboardScreen';
import PracticeCenterScreen from './components/screens/PracticeCenterScreen';
import CvSetupScreen from './components/screens/CvSetupScreen';
import ParsingScreen from './components/screens/ParsingScreen';
import VerificationScreen from './components/screens/VerificationScreen';
import WizardScreen from './components/screens/WizardScreen';
import InterviewScreen from './components/screens/InterviewScreen';
import FinishedScreen from './components/screens/FinishedScreen';
import FeedbackScreen from './components/screens/FeedbackScreen';
import HistoryScreen from './components/screens/HistoryScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import ScheduleScreen from './components/screens/ScheduleScreen';
import SupportScreen from './components/screens/SupportScreen';
import BriefingRoomScreen from './components/screens/BriefingRoomScreen';
import WaitingRoomScreen from './components/screens/WaitingRoomScreen';
import PracticeScreen from './components/screens/PracticeScreen'; // This is SystemCheck

// Layout
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import ImmersiveLayout from './components/layout/ImmersiveLayout';

// UI
import ErrorBoundary from './components/ui/ErrorBoundary';
import AnimatedBackground from './components/ui/AnimatedBackground';
import ThemeToggle from './components/ui/ThemeToggle';
import PublicTopNav from './components/layout/PublicTopNav';

// A mapping of screens to their components
const screenComponents: { [key in Screen]: React.ComponentType<any> } = {
    [Screen.Landing]: LandingScreen,
    [Screen.Login]: LoginScreen,
    [Screen.SignUp]: SignUpScreen,
    [Screen.Onboarding]: OnboardingScreen,
    [Screen.Dashboard]: DashboardScreen,
    [Screen.PracticeCenter]: PracticeCenterScreen,
    [Screen.CvSetup]: CvSetupScreen,
    [Screen.Parsing]: ParsingScreen,
    [Screen.Verification]: VerificationScreen,
    [Screen.Wizard]: WizardScreen,
    // Note: The original had 'Practice' screen which seems to be the System Check
    [Screen.SystemCheck]: PracticeScreen,
    [Screen.Interview]: InterviewScreen,
    [Screen.Finished]: FinishedScreen,
    [Screen.Feedback]: FeedbackScreen,
    [Screen.History]: HistoryScreen,
    [Screen.Profile]: ProfileScreen,
    [Screen.Schedule]: ScheduleScreen,
    [Screen.Support]: SupportScreen,
    [Screen.BriefingRoom]: BriefingRoomScreen,
    [Screen.WaitingRoom]: WaitingRoomScreen,
};

const PUBLIC_SCREENS = [Screen.Landing, Screen.Login, Screen.SignUp];
const IMMERSIVE_SCREENS = [Screen.Interview, Screen.BriefingRoom, Screen.WaitingRoom, Screen.Finished, Screen.SystemCheck];

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Landing);
    const [screenParams, setScreenParams] = useState<any>({});
    const [theme, setTheme] = useState<Theme>('dark');
    const [interviewMode, setInterviewMode] = useState<InterviewMode>('practice');
    const [companyName, setCompanyName] = useState<string>('');
    const [aiState, setAiState] = useState<AiState>('idle');
    const [navigationHistory, setNavigationHistory] = useState<Screen[]>([Screen.Landing]);
    
    // Sidebar state for non-immersive layouts
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Sidebar state for immersive layout
    const [isImmersiveSidebarOpen, setImmersiveSidebarOpen] = useState(false);

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    const navigate = (screen: Screen, params: any = {}) => {
        const isPublicToPrivate = PUBLIC_SCREENS.includes(currentScreen) && !PUBLIC_SCREENS.includes(screen);
        const isPrivateToPublic = !PUBLIC_SCREENS.includes(currentScreen) && PUBLIC_SCREENS.includes(screen);

        if (isPublicToPrivate || isPrivateToPublic) {
            setNavigationHistory([screen]);
        } else {
            if (navigationHistory[navigationHistory.length - 1] !== screen) {
                setNavigationHistory(prev => [...prev, screen]);
            }
        }
        
        setCurrentScreen(screen);
        setScreenParams(params);
        window.scrollTo(0, 0); // Scroll to top on navigation
    };

    const goBack = () => {
        if (navigationHistory.length <= 1) return;

        const newHistory = [...navigationHistory];
        newHistory.pop();
        const previousScreen = newHistory[newHistory.length - 1];

        setNavigationHistory(newHistory);
        setCurrentScreen(previousScreen);
        setScreenParams({});
    };

    const CurrentScreenComponent = screenComponents[currentScreen];
    
    if (!CurrentScreenComponent) {
        return <div>Error: Screen not found!</div>;
    }

    const isPublic = PUBLIC_SCREENS.includes(currentScreen);
    const isImmersive = IMMERSIVE_SCREENS.includes(currentScreen);
    
    const screenProps = {
        navigate,
        goBack,
        navigationHistory,
        theme,
        setTheme,
        interviewMode,
        setInterviewMode,
        companyName,
        setCompanyName,
        aiState,
        setAiState,
        currentScreen,
        ...screenParams
    };

    if (isPublic) {
        return (
            <ErrorBoundary>
                <div className="relative min-h-screen">
                    <AnimatedBackground />
                    <PublicTopNav navigate={navigate} />
                    <main className="relative z-10">
                        <CurrentScreenComponent {...screenProps} />
                    </main>
                    <ThemeToggle theme={theme} setTheme={setTheme} isPublic />
                </div>
            </ErrorBoundary>
        );
    }
    
    if (isImmersive) {
        return (
            <ErrorBoundary>
                <ImmersiveLayout 
                    {...screenProps} 
                    isSidebarOpen={isImmersiveSidebarOpen}
                    setIsSidebarOpen={setImmersiveSidebarOpen}
                >
                    <CurrentScreenComponent {...screenProps} />
                </ImmersiveLayout>
            </ErrorBoundary>
        );
    }

    // Standard App Layout
    return (
        <ErrorBoundary>
            <div className="w-full h-screen flex bg-[hsl(var(--brand-background))] text-[hsl(var(--brand-text))] overflow-hidden">
                <AnimatedBackground />
                <div className="hidden lg:flex">
                     <Sidebar 
                        {...screenProps}
                        isOpen={true} 
                        setIsOpen={() => {}} 
                        isCollapsed={isSidebarCollapsed}
                        setIsCollapsed={setIsSidebarCollapsed}
                    />
                </div>
                
                {/* Mobile Sidebar */}
                <div className="lg:hidden">
                    {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30" />}
                    <div className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <Sidebar {...screenProps} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <TopBar {...screenProps} setIsSidebarOpen={setIsSidebarOpen} />
                    <main className="flex-1 overflow-y-auto">
                        <CurrentScreenComponent {...screenProps} />
                    </main>
                </div>
                <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
        </ErrorBoundary>
    );
};

export default App;