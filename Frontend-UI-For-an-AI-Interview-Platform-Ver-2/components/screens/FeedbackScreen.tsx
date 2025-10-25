import React, { useState } from 'react';
import { Screen, ScreenProps, FeedbackItem, TranscriptItem, InterviewHistoryItem } from '../../types';
import { GLOWS_DATA, GROWS_DATA, ANSWER_TRANSCRIPTS, INTERVIEW_HISTORY_DATA } from '../../constants';
import CompetencyChart from '../charts/CompetencyChart';
import FeedbackDoughnutChart from '../charts/FeedbackDoughnutChart';
import FeedbackModal from '../ui/FeedbackModal';
import ScoreChart from '../charts/ScoreChart';

const FeedbackCard: React.FC<{ item: FeedbackItem, color: string, trackColor: string, onReview: (reviewId: number) => void }> = ({ item, color, trackColor, onReview }) => (
    <div className="glass-card shadow-glass-glow p-4 flex items-center gap-4 animate-fade-in-up">
        <div className="w-24 h-24 flex-shrink-0">
            <FeedbackDoughnutChart score={item.score} color={color} trackColor={trackColor} />
        </div>
        <div className="flex-1">
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-400 mb-2">{item.description}</p>
            <button onClick={() => onReview(item.reviewId)} className="text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300">
                Review Answer &rarr;
            </button>
        </div>
    </div>
);


const FeedbackScreen: React.FC<ScreenProps> = ({ navigate, theme, interviewData }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTranscript, setSelectedTranscript] = useState<TranscriptItem | null>(null);

    const interview = interviewData || INTERVIEW_HISTORY_DATA[0];

    const handleReview = (reviewId: number) => {
        const transcriptItem = ANSWER_TRANSCRIPTS[reviewId];
        if (transcriptItem) {
            setSelectedTranscript(transcriptItem);
            setIsModalVisible(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedTranscript(null);
    };
    
    // Dynamically get colors from CSS variables to match the theme
    const style = getComputedStyle(document.documentElement);
    const primaryColor = `hsl(${style.getPropertyValue('--brand-primary-raw')})`;
    const secondaryColor = `hsl(${style.getPropertyValue('--brand-secondary-raw')})`;
    const trackColor = theme === 'dark' ? 'hsla(0,0%,100%,0.1)' : 'hsla(0,0%,0%,0.05)';

    return (
        <>
            <FeedbackModal 
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                transcript={selectedTranscript?.transcript || ''}
                timestamp={selectedTranscript?.timestamp || ''}
            />
            <div className="p-4 md:p-8 h-full overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="text-center animate-fade-in-up">
                        <h1 className="text-3xl font-bold">Feedback Report</h1>
                        <p className="text-slate-700 dark:text-slate-400">Session from {interview.date} - {interview.role}</p>
                    </div>

                    {/* Summary Card */}
                    <div className="glass-card shadow-glass-glow p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="flex flex-col items-center">
                                <h2 className="text-xl font-bold mb-4 text-center">Overall Score</h2>
                                <div className="w-full h-64 max-w-xs">
                                    <ScoreChart theme={theme!} score={interview.score} />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0 0 12 22z"/><path d="m9 12 2 2 4-4"/></svg>
                                        What Went Well (Glows)
                                    </h3>
                                    <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300 pl-2">
                                        {GLOWS_DATA.map(item => <li key={item.reviewId}>{item.title}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 13-2.5 2.5a4 4 0 0 1-5 0 4 4 0 0 1 0-5l2.5-2.5"/><path d="m6 11 2.5-2.5a4 4 0 0 1 5 0 4 4 0 0 1 0 5l-2.5 2.5"/><path d="M12 22v-2"/><path d="M12 4V2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>
                                        Areas for Improvement (Grows)
                                    </h3>
                                    <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300 pl-2">
                                        {GROWS_DATA.map(item => <li key={item.reviewId}>{item.title}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Competency Breakdown */}
                    <div className="glass-card shadow-glass-glow p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-xl font-bold mb-4">Overall Competency Breakdown</h2>
                        <div className="w-full h-80">
                            <CompetencyChart theme={theme!} />
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                         <h2 className="text-2xl font-bold mb-4">Detailed Analysis</h2>
                         <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-amber-500 dark:text-amber-400">Glows</h3>
                                <div className="space-y-4">
                                    {GLOWS_DATA.map((item, index) => (
                                        <div key={item.reviewId} style={{ animationDelay: `${index * 100}ms` }}>
                                            <FeedbackCard item={item} color={primaryColor} trackColor={trackColor} onReview={handleReview} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-yellow-500 dark:text-yellow-400">Grows</h3>
                                <div className="space-y-4">
                                     {GROWS_DATA.map((item, index) => (
                                        <div key={item.reviewId} style={{ animationDelay: `${index * 100}ms` }}>
                                            <FeedbackCard item={item} color={secondaryColor} trackColor={trackColor} onReview={handleReview} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                         </div>
                    </div>


                    <div className="text-center pt-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <button onClick={() => navigate(Screen.PracticeCenter)} className="btn-primary text-lg">
                            Back to Practice Center
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeedbackScreen;