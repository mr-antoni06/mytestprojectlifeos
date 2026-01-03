import React, { useState } from 'react';
import { Habit } from '../types';
import { useAppStore } from '../store';
import { Plus, Zap, CheckCircle2, Trophy } from 'lucide-react';

interface Props {
  habit: Habit;
}

const HabitCard: React.FC<Props> = ({ habit }) => {
  const { dispatch } = useAppStore();
  const [increment, setIncrement] = useState<string>('');

  const progress = Math.min(100, (habit.currentValue / habit.dailyTarget) * 100);
  const xpProgress = Math.min(100, (habit.xp / habit.nextLevelXp) * 100);

  const handleLog = () => {
    const val = parseInt(increment) || 1; // Default to 1 if empty
    dispatch({
        type: 'LOG_ACTIVITY',
        payload: { habitId: habit.id, amount: val }
    });
    setIncrement('');
  };

  return (
    <div className={`relative group border-2 ${habit.completedToday ? 'border-cyber-neon shadow-neon' : 'border-gray-700'} bg-[#1a1a1a] p-5 rounded-lg transition-all duration-300 hover:border-cyber-neon hover:bg-[#222]`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
            <div className="flex items-center gap-2">
                <h3 className="text-white font-display font-bold text-xl tracking-wide drop-shadow-md">{habit.name}</h3>
                {habit.completedToday && <CheckCircle2 size={20} className="text-cyber-neon drop-shadow-md" />}
            </div>
            <p className="text-sm text-gray-300 font-mono mt-1 uppercase tracking-wider font-semibold">
                LVL {habit.level} <span className="text-cyber-neon mx-1">|</span> {habit.category}
            </p>
        </div>
        <div className="flex flex-col items-end">
             <div className="flex items-center gap-1 text-yellow-400 drop-shadow-sm bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/30">
                <Zap size={16} fill="currentColor" />
                <span className="font-mono font-bold text-base">{habit.streak}</span>
             </div>
        </div>
      </div>

      {/* Daily Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm font-mono text-gray-200 mb-1 font-medium">
            <span>DAILY: {habit.currentValue} / {habit.dailyTarget} {habit.unit}</span>
            <span className="text-cyber-neon font-bold">{Math.floor(progress)}%</span>
        </div>
        <div className="w-full h-4 bg-gray-700 rounded-sm overflow-hidden border border-gray-600">
            <div 
                className="h-full bg-cyber-neon transition-all duration-500 ease-out shadow-[0_0_10px_#00ff41]"
                style={{ width: `${progress}%` }}
            />
        </div>
      </div>

      {/* XP/Level Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
            <span>XP: {habit.xp} / {habit.nextLevelXp}</span>
            <span>NEXT LVL</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-sm overflow-hidden">
            <div 
                className="h-full bg-blue-400 transition-all duration-500 ease-out shadow-[0_0_8px_#60a5fa]"
                style={{ width: `${xpProgress}%` }}
            />
        </div>
      </div>

      {/* Input Action */}
      <div className="flex gap-2 items-center mt-auto">
        <input 
            type="number" 
            value={increment}
            onChange={(e) => setIncrement(e.target.value)}
            placeholder="Qty"
            className="w-24 bg-gray-800 border-2 border-gray-600 text-white font-mono text-base px-3 py-2 focus:outline-none focus:border-cyber-neon transition-colors text-center placeholder-gray-500 font-bold rounded-sm"
        />
        <button 
            onClick={handleLog}
            className="flex-1 bg-cyber-neon/10 hover:bg-cyber-neon hover:text-black border-2 border-cyber-neon text-cyber-neon font-mono text-sm py-2 px-3 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-neon-box hover:shadow-neon font-bold rounded-sm"
        >
            <Plus size={16} /> LOG DATA
        </button>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-neon"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-neon"></div>
    </div>
  );
};

export default HabitCard;