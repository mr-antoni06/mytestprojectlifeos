import React, { useState } from 'react';
import { useAppStore } from '../store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Shield, ArrowRight, Smartphone, BookOpen } from 'lucide-react';

const AntiScroll: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const [potentialTime, setPotentialTime] = useState('');
  const [selectedHabitId, setSelectedHabitId] = useState(state.habits[0]?.id || '');
  const [actualTime, setActualTime] = useState('');

  const handleConvert = () => {
    if (!potentialTime || !actualTime || !selectedHabitId) return;

    const session = {
      id: Date.now().toString(), // Simple ID
      date: new Date().toISOString(),
      potentialScrollTime: parseInt(potentialTime),
      productiveActivityId: selectedHabitId,
      actualProductiveTime: parseInt(actualTime)
    };

    dispatch({ type: 'ADD_ANTI_SCROLL', payload: session });
    
    // Also log the actual habit
    dispatch({ 
        type: 'LOG_ACTIVITY', 
        payload: { habitId: selectedHabitId, amount: parseInt(actualTime) } 
    });

    setPotentialTime('');
    setActualTime('');
  };

  // Analytics Data Preparation
  const totalPotential = state.antiScrollSessions.reduce((acc, s) => acc + s.potentialScrollTime, 0);
  const totalSaved = state.antiScrollSessions.reduce((acc, s) => acc + s.actualProductiveTime, 0);
  
  const chartData = [
    { name: 'Saved (Productive)', value: totalSaved, color: '#00ff41' },
    { name: 'Lost to Scroll', value: Math.max(0, totalPotential - totalSaved), color: '#333' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-2 border-cyber-alert/50 bg-[#1a1111] p-6 rounded-lg relative overflow-hidden shadow-[0_0_20px_rgba(255,0,60,0.15)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-alert to-transparent opacity-100"></div>
        <h2 className="text-3xl font-display text-cyber-alert mb-3 flex items-center gap-3 drop-shadow-md">
            <Shield className="animate-pulse" size={32} />
            DOOMSCROLL CONVERTER
        </h2>
        <p className="text-gray-100 font-mono text-base max-w-2xl leading-relaxed">
            Intercept neural hijack attempts. When you feel the urge to scroll, choose a protocol below instead. 
            Log the time you <em>would have</em> wasted versus the time you <em>actually</em> invested.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Converter Form */}
        <div className="border border-gray-700 bg-[#151515] p-6 rounded-lg">
            <h3 className="text-cyber-neon font-mono mb-6 border-b border-gray-700 pb-2 tracking-widest font-bold text-lg">INPUT_STREAM</h3>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold font-mono text-gray-300 mb-2">URGE DURATION (MINS)</label>
                    <div className="flex items-center gap-2 text-cyber-alert">
                        <Smartphone size={24} />
                        <input 
                            type="number" 
                            className="w-full bg-gray-800 border-2 border-gray-600 focus:border-cyber-alert text-white p-3 font-mono outline-none transition-colors placeholder-gray-500 rounded font-bold text-lg"
                            placeholder="e.g. 30"
                            value={potentialTime}
                            onChange={e => setPotentialTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <ArrowRight className="text-gray-400 rotate-90 lg:rotate-0" size={32} />
                </div>

                <div>
                    <label className="block text-sm font-bold font-mono text-gray-300 mb-2">REDIRECT PROTOCOL</label>
                    <div className="flex items-center gap-2 text-cyber-neon">
                        <BookOpen size={24} />
                        <select 
                            className="w-full bg-gray-800 border-2 border-gray-600 focus:border-cyber-neon text-white p-3 font-mono outline-none transition-colors rounded font-bold text-lg"
                            value={selectedHabitId}
                            onChange={e => setSelectedHabitId(e.target.value)}
                        >
                            {state.habits.map(h => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold font-mono text-gray-300 mb-2">ACTUAL EXECUTION (MINS)</label>
                    <input 
                        type="number" 
                        className="w-full bg-gray-800 border-2 border-gray-600 focus:border-cyber-neon text-white p-3 font-mono outline-none transition-colors placeholder-gray-500 rounded font-bold text-lg"
                        placeholder="e.g. 25"
                        value={actualTime}
                        onChange={e => setActualTime(e.target.value)}
                    />
                </div>

                <button 
                    onClick={handleConvert}
                    className="w-full bg-cyber-neon text-black font-display font-bold text-lg py-4 hover:bg-white hover:shadow-[0_0_20px_#fff] transition-all tracking-widest mt-4 rounded-sm uppercase"
                >
                    CONVERT ENERGY
                </button>
            </div>
        </div>

        {/* Analytics Visual */}
        <div className="border border-gray-700 bg-[#151515] p-6 rounded-lg flex flex-col">
            <h3 className="text-cyber-neon font-mono mb-4 border-b border-gray-700 pb-2 tracking-widest font-bold text-lg">RETENTION_METRICS</h3>
            
            <div className="flex-1 min-h-[300px] relative bg-[#111] rounded border border-gray-800 p-4">
                {totalPotential === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-mono text-sm border-2 border-dashed border-gray-700 m-4 rounded">
                        NO DATA AVAILABLE
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.name.includes('Saved') ? '#fff' : 'transparent'} strokeWidth={1} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#222', border: '1px solid #00ff41' }}
                                itemStyle={{ color: '#fff', fontFamily: 'monospace', fontWeight: 'bold' }}
                            />
                            <Legend wrapperStyle={{ color: '#fff', fontWeight: 'bold' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded border border-gray-600">
                    <p className="text-xs font-bold text-gray-400 mb-1">POTENTIAL DOOM</p>
                    <p className="text-2xl font-mono text-white font-bold">{totalPotential} <span className="text-sm font-normal text-gray-400">mins</span></p>
                </div>
                <div className="bg-gray-800 p-4 rounded border border-cyber-neon shadow-neon-box">
                    <p className="text-xs font-bold text-gray-400 mb-1">RECLAIMED LIFE</p>
                    <p className="text-2xl font-mono text-cyber-neon font-bold drop-shadow-sm">{totalSaved} <span className="text-sm font-normal text-white">mins</span></p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AntiScroll;