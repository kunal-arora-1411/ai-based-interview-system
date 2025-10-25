import React from 'react';
import { Screen, ScreenProps } from '../../types';
import { INTERVIEW_HISTORY_DATA, SKILL_PROGRESS_DATA } from '../../constants';
import SkillsLineChart from '../charts/SkillsLineChart';

const HistoryScreen: React.FC<ScreenProps> = ({ navigate, theme }) => {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Feedback History</h1>
                    <p className="text-slate-700 dark:text-slate-400">Track your progress and review past interviews.</p>
                </div>
                
                {/* Progress Chart */}
                <div className="glass-card shadow-glass-glow p-6">
                    <h2 className="text-xl font-bold mb-4">Skill Progress Over Time</h2>
                    <div className="w-full h-80">
                        <SkillsLineChart theme={theme!} data={SKILL_PROGRESS_DATA} />
                    </div>
                </div>

                {/* Interview History List */}
                <div className="glass-card shadow-glass-glow p-6">
                    <h2 className="text-xl font-bold mb-4">Past Interview Sessions</h2>
                    <div className="space-y-3">
                        {INTERVIEW_HISTORY_DATA.map(item => (
                            <div key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-4 bg-slate-500/10 rounded-lg">
                                <div>
                                    <p className="font-semibold text-lg">{item.role}</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-400">{item.date}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-700 dark:text-slate-400">Score</p>
                                        <p className="font-bold text-2xl text-amber-600 dark:text-amber-400">{item.score}%</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(Screen.Feedback, { interviewData: item })}
                                        className="btn-secondary py-2 px-4 whitespace-nowrap"
                                    >
                                        View Report
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HistoryScreen;