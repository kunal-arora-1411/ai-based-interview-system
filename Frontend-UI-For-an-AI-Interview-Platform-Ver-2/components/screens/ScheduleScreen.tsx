import React, { useState } from 'react';
import { Screen, ScreenProps, ScheduleEvent } from '../../types';
import { SCHEDULED_EVENTS } from '../../constants';

const IntegrationToggle: React.FC<{
    label: string;
    icon: React.ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
}> = ({ label, icon, checked, onChange }) => (
    <div className="flex items-center justify-between p-3 bg-slate-500/10 rounded-lg">
        <div className="flex items-center gap-3">
            {icon}
            <span className="font-semibold">{label}</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-500/30 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
        </label>
    </div>
);

const ScheduleScreen: React.FC<ScreenProps> = ({ navigate, setInterviewMode }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [events, setEvents] = useState<ScheduleEvent[]>(SCHEDULED_EVENTS);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const handleJoinInterview = (companyName: string) => {
        setInterviewMode?.('official');
        navigate(Screen.BriefingRoom, { companyName });
    };

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const changeMonth = (offset: number) => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const handleIntegrationChange = (eventId: number, integration: 'google' | 'outlook' | 'notion', value: boolean) => {
        setEvents(prevEvents => prevEvents.map(event =>
            event.id === eventId
                ? { ...event, integrations: { ...event.integrations, [integration]: value } }
                : event
        ));
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const filteredEvents = events.filter(e => e.date === selectedDate);

    const renderCalendar = () => {
        const totalDays = daysInMonth(currentMonth);
        const startDay = firstDayOfMonth(currentMonth);
        const blanks = Array(startDay).fill(null);
        const days = Array.from({ length: totalDays }, (_, i) => i + 1);

        return (
            <div className="glass-card shadow-glass-glow p-6">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <h2 className="text-xl font-bold">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-slate-700 dark:text-slate-400 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                    {days.map(day => {
                        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isSelected = dateStr === selectedDate;
                        const isToday = dateStr === todayStr;
                        const hasEvent = events.some(e => e.date === dateStr);

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-colors ${
                                    isSelected ? 'bg-amber-600 text-white' :
                                    isToday ? 'bg-amber-600/20 text-amber-600 dark:text-amber-400' :
                                    'hover:bg-slate-500/10'
                                }`}
                            >
                                {day}
                                {hasEvent && <div className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-600'}`}></div>}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-4 flex justify-center">
                    <button onClick={() => { setSelectedDate(todayStr); setCurrentMonth(new Date()); }} className="btn-secondary px-4 py-1.5 text-sm">
                        Today
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Calendar & Integrations */}
                <div className="lg:col-span-1 space-y-8">
                    {renderCalendar()}
                    <div className="glass-card shadow-glass-glow p-6">
                        <h2 className="text-xl font-bold mb-4">Integrations</h2>
                        <div className="space-y-3">
                            <IntegrationToggle label="Google Calendar" checked={true} onChange={() => {}} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>} />
                            <IntegrationToggle label="Outlook Calendar" checked={false} onChange={() => {}} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M20 20.5H8.75V19h10v-3.5H8.75V14h10V9.5H8.75V8h10V4.5H8.75V3H20a1.5 1.5 0 0 1 1.5 1.5v14.5a1.5 1.5 0 0 1-1.5 1.5M4 17.5a1.5 1.5 0 0 1-1.5-1.5V8A1.5 1.5 0 0 1 4 6.5h1.5v12H4a1.5 1.5 0 0 1-1.5-1.5Z" /></svg>} />
                            <IntegrationToggle label="Notion" checked={true} onChange={() => {}} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m14.5 11l-3-3l-3 3l-2-2v9h3v-4l2-2l2 2v4h3v-9zM3.5 3h17v18h-17z" /></svg>} />
                        </div>
                    </div>
                </div>

                {/* Right Side: Events */}
                <div className="lg:col-span-2">
                    <div className="glass-card shadow-glass-glow p-6 min-h-full">
                        <h1 className="text-3xl font-bold mb-4">
                            Schedule for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h1>
                        {filteredEvents.length > 0 ? (
                            <div className="space-y-6">
                                {filteredEvents.map(event => (
                                    <div key={event.id} className="p-5 bg-slate-500/10 rounded-xl">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div>
                                                <p className="text-sm text-amber-500 dark:text-amber-400 font-bold">{event.time}</p>
                                                <h3 className="text-xl font-bold">{event.title}</h3>
                                                <p className="text-slate-700 dark:text-slate-400">with {event.company}</p>
                                            </div>
                                            <button onClick={() => handleJoinInterview(event.company)} className="btn-primary py-2 px-6 w-full sm:w-auto">
                                                Join Interview
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500 mb-4"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                                <h2 className="text-xl font-bold">No Events Scheduled</h2>
                                <p className="text-slate-700 dark:text-slate-400">You have no interviews scheduled for this day.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleScreen;