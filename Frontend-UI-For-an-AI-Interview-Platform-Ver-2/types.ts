import React from 'react';

export type Theme = 'light' | 'dark';
export type InterviewMode = 'practice' | 'official';
export type AiState = 'idle' | 'listening' | 'thinking' | 'speaking';

export enum Screen {
    Landing = 'LANDING',
    Login = 'LOGIN',
    SignUp = 'SIGN_UP',
    Onboarding = 'ONBOARDING',
    Dashboard = 'DASHBOARD',
    PracticeCenter = 'PRACTICE_CENTER',
    CvSetup = 'CV_SETUP',
    Parsing = 'PARSING',
    Verification = 'VERIFICATION',
    Wizard = 'WIZARD',
    SystemCheck = 'SYSTEM_CHECK',
    Interview = 'INTERVIEW',
    Finished = 'FINISHED',
    Feedback = 'FEEDBACK',
    History = 'HISTORY',
    Profile = 'PROFILE',
    Schedule = 'SCHEDULE',
    Support = 'SUPPORT',
    BriefingRoom = 'BRIEFING_ROOM',
    WaitingRoom = 'WAITING_ROOM',
}

export interface ScreenProps {
    navigate: (screen: Screen, params?: any) => void;
    goBack?: () => void;
    navigationHistory?: Screen[];
    theme?: Theme;
    interviewMode?: InterviewMode;
    interviewData?: InterviewHistoryItem;
    companyName?: string;
    drillType?: string; // Added for targeted skill drills
    setInterviewMode?: (mode: InterviewMode) => void;
    setCompanyName?: (name: string) => void;
    // FIX: Added properties passed down from App.tsx to resolve type errors across various components.
    setTheme?: (theme: Theme) => void;
    currentScreen?: Screen;
    isSidebarOpen?: boolean;
    setIsSidebarOpen?: (isOpen: boolean) => void;
    aiState?: AiState;
    setAiState?: (state: AiState) => void;
}

export interface FeedbackItem {
    title: string;
    description: string;
    score: number;
    reviewId: number;
}

export interface TranscriptItem {
    transcript: string;
    timestamp: string;
}

export interface SkillProgress {
    session: string;
    skills: { [key: string]: number };
}

export interface InterviewHistoryItem {
    id: number;
    role: string;
    date: string;
    score: number;
}

export interface ScheduleEvent {
    id: number;
    date: string;
    time: string;
    title: string;
    company: string;
    integrations: {
        google: boolean;
        outlook: boolean;
        notion: boolean;
    };
}