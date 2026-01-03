import React from 'react';
import { useAppStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';

const Analytics: React.FC = () => {
  const { state } = useAppStore();

  // Prepare Last 7 Days Data
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const displayDate = format(date, 'MM/dd');
    
    const dayData: any = { name: displayDate };
    
    state.habits.forEach(habit => {
        dayData[habit.name] = habit.history[dateStr] || 0;
    });
    
    data.push(dayData);
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
       <div className="flex items-center justify-between">
           <h2 className="text-3xl font-display text-white drop-shadow-lg">PERFORMANCE_LOGS</h2>
           <div className="text-sm font-mono text-cyber-neon border-2 border-cyber-neon bg-cyber-neon/10 px-3 py-1 shadow-neon-box font-bold">T: -7 DAYS</div>
       </div>

       <div className="h-[450px] border border-gray-600 bg-[#151515] p-6 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#fff" fontSize={14} tickMargin={10} tick={{fill: '#fff', fontWeight: 'bold'}} />
                    <YAxis stroke="#fff" fontSize={14} tick={{fill: '#fff', fontWeight: 'bold'}} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#222', border: '2px solid #00ff41', color: '#fff', borderRadius: '4px' }}
                        cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
                        labelStyle={{ color: '#00ff41', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.2em' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px', color: '#fff', fontWeight: 'bold' }} />
                    {state.habits.map((habit, index) => (
                        <Bar 
                            key={habit.id} 
                            dataKey={habit.name} 
                            fill={index % 2 === 0 ? '#00ff41' : '#00cc33'} 
                            stackId="a"
                            barSize={30}
                            className="drop-shadow-[0_0_4px_rgba(0,255,65,0.8)]"
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {state.habits.map(habit => (
               <div key={habit.id} className="border-2 border-gray-700 p-5 bg-[#1a1a1a] rounded hover:border-cyber-neon transition-colors shadow-lg">
                   <h4 className="text-white font-mono text-base mb-2 font-bold uppercase">{habit.name}</h4>
                   <div className="text-4xl font-display text-cyber-neon drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]">
                       LVL {habit.level}
                   </div>
                   <p className="text-sm text-gray-300 mt-2 font-mono">Total XP: <span className="text-white font-bold">{habit.xp}</span></p>
               </div>
           ))}
       </div>
    </div>
  );
};

export default Analytics;