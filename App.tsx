import React, { useState } from 'react';
import { AppProvider, useAppStore } from './store';
import { ViewState } from './types';
import HabitCard from './components/HabitCard';
import Heatmap from './components/Heatmap';
import AntiScroll from './components/AntiScroll';
import Analytics from './components/Analytics';
import { LayoutDashboard, BarChart3, ShieldAlert, Calendar as CalendarIcon, Terminal, PlusCircle } from 'lucide-react';

// --- Dashboard Component ---
const Dashboard = () => {
    const { state, dispatch } = useAppStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');

    const createHabit = () => {
        if(!newHabitName.trim()) return;
        
        dispatch({
            type: 'ADD_HABIT',
            payload: {
                id: Date.now().toString(),
                name: newHabitName,
                category: 'misc',
                dailyTarget: 30, // Default
                unit: 'mins',
                currentValue: 0,
                level: 1,
                xp: 0,
                nextLevelXp: 100,
                streak: 0,
                completedToday: false,
                history: {}
            }
        });
        setNewHabitName('');
        setIsCreating(false);
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats */}
                <div className="space-y-6">
                    <div className="border-2 border-cyber-neon bg-[#111] p-6 rounded-lg shadow-neon-box">
                         <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded bg-cyber-neon flex items-center justify-center text-black font-bold text-2xl font-display shadow-[0_0_15px_#00ff41]">
                                {state.habits.reduce((acc, h) => acc + h.level, 0)}
                            </div>
                            <div>
                                <h2 className="text-white font-display text-xl drop-shadow-md">SYSTEM LEVEL</h2>
                                <p className="text-sm text-gray-300 font-mono tracking-wider font-semibold">COMBINED METRICS</p>
                            </div>
                         </div>
                    </div>
                    <Heatmap />
                </div>

                {/* Right Column: Habits */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                        <h2 className="text-2xl font-display text-white tracking-wider flex items-center gap-3 drop-shadow-md">
                            <Terminal size={24} className="text-cyber-neon" />
                            ACTIVE PROTOCOLS
                        </h2>
                        <button 
                            onClick={() => setIsCreating(!isCreating)}
                            className="text-cyber-neon hover:text-white transition-colors hover:drop-shadow-[0_0_5px_#fff]"
                        >
                            <PlusCircle size={28} />
                        </button>
                    </div>

                    {isCreating && (
                        <div className="bg-[#1a1a1a] p-5 mb-6 border-2 border-cyber-neon rounded flex gap-3 shadow-neon-box">
                            <input 
                                className="bg-black border-2 border-gray-600 text-white px-4 py-2 font-mono text-base flex-1 outline-none focus:border-cyber-neon transition-colors rounded-sm"
                                placeholder="New Protocol Name..."
                                value={newHabitName}
                                onChange={e => setNewHabitName(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && createHabit()}
                            />
                            <button 
                                onClick={createHabit}
                                className="bg-cyber-neon text-black px-6 py-2 font-bold font-mono text-sm hover:bg-white transition-colors rounded-sm"
                            >
                                INIT
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {state.habits.length === 0 ? (
                            <div className="col-span-2 p-8 text-center border-2 border-dashed border-gray-800 rounded text-gray-500 font-mono">
                                NO PROTOCOLS ACTIVE. INITIATE NEW HABIT.
                            </div>
                        ) : (
                            state.habits.map(habit => (
                                <HabitCard key={habit.id} habit={habit} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Planner Placeholder ---
const Planner = () => (
    <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-600 bg-[#151515] text-gray-300 font-mono flex-col gap-4 rounded-lg">
        <CalendarIcon size={64} className="text-gray-500" />
        <p className="text-2xl font-bold">CALENDAR_MODULE_OFFLINE</p>
        <p className="text-sm text-cyber-alert animate-pulse font-bold">MANUAL OVERRIDE ONLY</p>
    </div>
)

// --- Main Layout ---

const MainContent = () => {
    const [view, setView] = useState<ViewState>('dashboard');

    return (
        <div className="min-h-screen grid-bg relative selection:bg-cyber-neon selection:text-black">
            
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 border-b border-gray-700 bg-black px-6 py-4 flex justify-between items-center shadow-lg shadow-black/80">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-cyber-neon rounded-full animate-pulse shadow-[0_0_10px_#00ff41]"></div>
                    <h1 className="text-2xl font-display font-bold text-white tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                        LIFE<span className="text-cyber-neon">OS</span>
                    </h1>
                </div>
                
                <div className="flex gap-2 bg-[#111] p-1.5 rounded-lg border border-gray-700 overflow-x-auto max-w-[60vw] md:max-w-none">
                    <button 
                        onClick={() => setView('dashboard')}
                        className={`px-5 py-2 rounded-md flex items-center gap-2 text-sm font-mono transition-all font-bold whitespace-nowrap ${view === 'dashboard' ? 'bg-cyber-neon text-black shadow-[0_0_15px_#00ff41]' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                    >
                        <LayoutDashboard size={16} /> <span className="hidden sm:inline">DASHBOARD</span>
                    </button>
                    <button 
                        onClick={() => setView('antiscroll')}
                        className={`px-5 py-2 rounded-md flex items-center gap-2 text-sm font-mono transition-all font-bold whitespace-nowrap ${view === 'antiscroll' ? 'bg-cyber-alert text-black shadow-[0_0_15px_#ff003c]' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                    >
                        <ShieldAlert size={16} /> <span className="hidden sm:inline">CONVERTER</span>
                    </button>
                    <button 
                        onClick={() => setView('analytics')}
                        className={`px-5 py-2 rounded-md flex items-center gap-2 text-sm font-mono transition-all font-bold whitespace-nowrap ${view === 'analytics' ? 'bg-blue-500 text-black shadow-[0_0_15px_#3b82f6]' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                    >
                        <BarChart3 size={16} /> <span className="hidden sm:inline">ANALYTICS</span>
                    </button>
                    <button 
                        onClick={() => setView('planner')}
                        className={`px-5 py-2 rounded-md flex items-center gap-2 text-sm font-mono transition-all font-bold whitespace-nowrap ${view === 'planner' ? 'bg-purple-500 text-black shadow-[0_0_15px_#a855f7]' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                    >
                        <CalendarIcon size={16} /> <span className="hidden sm:inline">PLANNER</span>
                    </button>
                </div>
                
                <div className="hidden md:block text-xs font-mono text-gray-400 font-bold">
                    V.2.0.77 // <span className="text-cyber-neon">ONLINE</span>
                </div>
            </nav>

            {/* Content Area */}
            <main className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
                {view === 'dashboard' && <Dashboard />}
                {view === 'antiscroll' && <AntiScroll />}
                {view === 'analytics' && <Analytics />}
                {view === 'planner' && <Planner />}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <MainContent />
        </AppProvider>
    );
};

export default App;