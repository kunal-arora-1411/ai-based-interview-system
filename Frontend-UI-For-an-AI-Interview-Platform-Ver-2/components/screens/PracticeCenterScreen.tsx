import React, { useState, useEffect } from 'react';
import { Screen, ScreenProps } from '../../types';
import { INTERVIEW_HISTORY_DATA, KEY_IMPROVEMENT_AREAS, SKILL_PROGRESS_DATA } from '../../constants';
import SkillsLineChart from '../charts/SkillsLineChart';
import StartInterviewModal from '../ui/StartInterviewModal';

const PracticeCenterScreen: React.FC<ScreenProps> = ({ navigate, theme, setInterviewMode }) => {
    const latestInterview = INTERVIEW_HISTORY_DATA[0];
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStartDrill = (skill: string) => {
        setInterviewMode?.('practice');
        navigate(Screen.Interview, { drillType: skill });
    };

    return (
        <>
            {isModalOpen && <StartInterviewModal navigate={navigate} onClose={() => setIsModalOpen(false)} setInterviewMode={setInterviewMode} />}
            <div className="p-4 md:p-8 h-full overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Welcome & CTA */}
                    <div className="glass-card shadow-glass-glow p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Welcome back, Alex!</h1>
                            <p className="text-slate-700 dark:text-slate-300">Ready to sharpen your skills and land your next role?</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary py-3 px-6 text-base font-bold w-full sm:w-auto"
                        >
                            Start New Interview
                        </button>
                    </div>

                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <div className="glass-card shadow-glass-glow p-6 h-full flex flex-col">
                                <h2 className="text-xl font-bold mb-4">Latest Interview Score</h2>
                                <div className="flex flex-col items-center flex-1">
                                    <p className="text-6xl font-bold text-gradient">{latestInterview.score}%</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{latestInterview.role}</p>
                                </div>
                                <div className="space-y-3 mt-4 text-sm">
                                    <div className="p-3 bg-slate-900/5 dark:bg-slate-500/10 rounded-lg">
                                        <p className="font-bold text-amber-500 dark:text-amber-400">Top Skill: <span className="text-slate-800 dark:text-slate-200">Technical Depth</span></p>
                                    </div>
                                    <div className="p-3 bg-slate-900/5 dark:bg-slate-500/10 rounded-lg">
                                        <p className="font-bold text-yellow-500 dark:text-yellow-400">Biggest Opportunity: <span className="text-slate-800 dark:text-slate-200">STAR Method</span></p>
                                    </div>
                                </div>
                                <button onClick={() => navigate(Screen.Feedback, { interviewData: latestInterview })} className="mt-4 w-full btn-secondary py-2">
                                    View Full Report
                                </button>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="glass-card shadow-glass-glow p-6 h-full">
                                <h2 className="text-xl font-bold mb-4">Progress Over Time</h2>
                                <div className="w-full h-80">
                                    <SkillsLineChart theme={theme!} data={SKILL_PROGRESS_DATA} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="lg:col-span-1">
                            <div className="glass-card shadow-glass-glow p-6">
                                <h2 className="text-xl font-bold mb-4">Interview History</h2>
                                <ul className="space-y-3 max-h-64 overflow-y-auto">
                                    {INTERVIEW_HISTORY_DATA.map(item => (
                                        <li key={item.id} className="flex justify-between items-center p-3 bg-slate-900/5 dark:bg-slate-500/10 rounded-lg cursor-pointer hover:bg-slate-900/10 dark:hover:bg-slate-500/20 transition-colors" onClick={() => navigate(Screen.Feedback, { interviewData: item })}>
                                            <div>
                                                <p className="font-semibold">{item.role}</p>
                                                <p className="text-sm text-slate-700 dark:text-slate-400">{item.date}</p>
                                            </div>
                                            <div className="font-bold text-lg text-amber-600 dark:text-amber-400">{item.score}%</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="glass-card shadow-glass-glow p-6 h-full">
                                <h2 className="text-xl font-bold mb-4">Key Improvement Areas</h2>
                                <div className="space-y-4">
                                    {KEY_IMPROVEMENT_AREAS.map(area => (
                                        <div key={area.skill} className="bg-slate-900/5 dark:bg-slate-500/10 p-4 rounded-lg">
                                            <h3 className="font-semibold text-amber-600 dark:text-amber-400">{area.skill}</h3>
                                            <p className="text-sm text-slate-700 dark:text-slate-400">{area.advice}</p>
                                            <button onClick={() => handleStartDrill(area.skill)} className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 mt-2">Practice this skill &rarr;</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PracticeCenterScreen;