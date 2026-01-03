import React from 'react';
import { eachDayOfInterval, subDays, format, isSameDay } from 'date-fns';
import { useAppStore } from '../store';

const Heatmap: React.FC = () => {
  const { state } = useAppStore();
  
  // Last 365 days
  const today = new Date();
  const startDate = subDays(today, 119); // Show roughly 4 months for mobile fit, or 365 for desktop
  const dates = eachDayOfInterval({ start: startDate, end: today });

  // Aggregate activity
  const getActivityLevel = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    let totalValue = 0;
    
    state.habits.forEach(habit => {
      if (habit.history[dateStr]) {
        // Normalize value: 100% of target = 1 "point" for heatmap
        totalValue += Math.min(1, habit.history[dateStr] / habit.dailyTarget);
      }
    });

    if (totalValue === 0) return 'bg-gray-800 border border-gray-700'; // Much brighter empty state
    if (totalValue <= 0.5) return 'bg-green-900 border border-green-700';
    if (totalValue <= 1.5) return 'bg-green-700 border border-green-500';
    if (totalValue <= 2.5) return 'bg-green-500 border border-green-400';
    return 'bg-cyber-neon shadow-[0_0_10px_#00ff41] border-2 border-white';
  };

  return (
    <div className="border border-gray-700 bg-[#151515] p-5 rounded-md">
      <h3 className="text-white font-display text-base mb-4 uppercase tracking-widest flex items-center border-b border-gray-800 pb-2">
        <span className="w-3 h-3 bg-cyber-neon rounded-full mr-3 animate-pulse-fast shadow-neon"></span>
        System Activity Log
      </h3>
      <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
        {dates.map((date) => (
          <div
            key={date.toISOString()}
            title={`${format(date, 'MMM do')}`}
            className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-sm ${getActivityLevel(date)} transition-all duration-200 hover:border-white hover:z-10 cursor-help`}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end text-xs text-gray-300 font-mono gap-3 font-semibold">
        <span>IDLE</span>
        <div className="flex gap-1.5">
            <div className="w-4 h-4 bg-gray-800 rounded-sm border border-gray-700"></div>
            <div className="w-4 h-4 bg-green-900 rounded-sm"></div>
            <div className="w-4 h-4 bg-green-700 rounded-sm"></div>
            <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
            <div className="w-4 h-4 bg-cyber-neon rounded-sm shadow-neon"></div>
        </div>
        <span className="text-white">OVERCLOCK</span>
      </div>
    </div>
  );
};

export default Heatmap;