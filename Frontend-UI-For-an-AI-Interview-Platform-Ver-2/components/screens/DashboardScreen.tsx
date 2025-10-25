import React from 'react';
import { Screen, ScreenProps } from '../../types';
import { INTERVIEW_HISTORY_DATA, KEY_IMPROVEMENT_AREAS } from '../../constants';
import ScoreChart from '../charts/ScoreChart';
import CompetencyChart from '../charts/CompetencyChart';

const DashboardScreen: React.FC<ScreenProps> = ({ navigate, theme, setInterviewMode }) => {

    const handleStartOfficialInterview = () => {
        setInterviewMode?.('official');
        navigate(Screen.CvSetup);
    };

    return (
        <>
            <div className="p-4 md:p-8 h-full overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Welcome & CTA */}
                    <div className="glass-card shadow-glass-glow p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Welcome back, Alex!</h1>
                            <p className="text-slate-400">Ready to sharpen your skills and land your next role?</p>
                        </div>
                        <button 
                            onClick={handleStartOfficialInterview}
                            className="btn-primary py-3 px-8 w-full sm:w-auto"
                        >
                            Start Official Interview
                        </button>
                    </div>

                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <div className="glass-card shadow-glass-glow p-6 h-full flex flex-col items-center">
                                <h2 className="text-xl font-bold mb-4">Latest Interview Score</h2>
                                <div className="w-full h-64">
                                    <ScoreChart theme={theme!} score={INTERVIEW_HISTORY_DATA[0].score} />
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="glass-card shadow-glass-glow p-6 h-full">
                                <h2 className="text-xl font-bold mb-4">Competency Breakdown</h2>
                                <div className="w-full h-64">
                                    <CompetencyChart theme={theme!} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Grid */}
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="glass-card shadow-glass-glow p-6">
                                <h2 className="text-xl font-bold mb-4">Interview History</h2>
                                <ul className="space-y-3 max-h-64 overflow-y-auto">
                                    {INTERVIEW_HISTORY_DATA.map(item => (
                                        <li key={item.id} className="flex justify-between items-center p-3 bg-slate-500/10 rounded-lg">
                                            <div>
                                                <p className="font-semibold">{item.role}</p>
                                                <p className="text-sm text-slate-400">{item.date}</p>
                                            </div>
                                            <div className="font-bold text-lg text-amber-500 dark:text-amber-400">{item.score}%</div>
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
                                        <div key={area.skill} className="bg-slate-500/10 p-4 rounded-lg">
                                            <h3 className="font-semibold text-amber-500 dark:text-amber-400">{area.skill}</h3>
                                            <p className="text-sm text-slate-400">{area.advice}</p>
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

export default DashboardScreen;