import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { AppState, Habit, AntiScrollSession } from './types';
import { format } from 'date-fns';

// --- Constants ---
const STORAGE_KEY = 'CYBERPUNK_OS_V1';

// --- Utils ---
const calculateNextLevelXp = (level: number) => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Default state used ONLY for first-time users
const defaultState: AppState = {
  habits: [
    {
      id: '1',
      name: 'Code Project',
      category: 'career',
      dailyTarget: 60,
      unit: 'mins',
      currentValue: 0,
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      streak: 0,
      completedToday: false,
      history: {}
    },
    {
      id: '2',
      name: 'Read Sci-Fi',
      category: 'learning',
      dailyTarget: 30,
      unit: 'mins',
      currentValue: 0,
      level: 2,
      xp: 120,
      nextLevelXp: 150,
      streak: 3,
      completedToday: false,
      history: {}
    }
  ],
  antiScrollSessions: [],
  userLevel: 1,
  lastLogin: new Date().toISOString()
};

// --- Actions ---
type Action =
  | { type: 'INIT_STATE'; payload: AppState }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'LOG_ACTIVITY'; payload: { habitId: string; amount: number } }
  | { type: 'ADD_ANTI_SCROLL'; payload: AntiScrollSession }
  | { type: 'RESET_DAILY' };

// --- Reducer ---
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'INIT_STATE':
      return { ...action.payload };

    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };

    case 'LOG_ACTIVITY': {
      const { habitId, amount } = action.payload;
      const today = format(new Date(), 'yyyy-MM-dd');

      return {
        ...state,
        habits: state.habits.map((h) => {
          if (h.id !== habitId) return h;

          const newCurrentValue = h.currentValue + amount;
          const isComplete = newCurrentValue >= h.dailyTarget;
          
          // XP Logic
          let newXp = h.xp + amount; 
          let newLevel = h.level;
          let newNextLevelXp = h.nextLevelXp;

          // Level Up Loop
          while (newXp >= newNextLevelXp) {
            newXp -= newNextLevelXp;
            newLevel += 1;
            newNextLevelXp = calculateNextLevelXp(newLevel);
          }

          // Streak Logic
          let newStreak = h.streak;
          if (isComplete && !h.completedToday) {
            newStreak += 1;
          }

          return {
            ...h,
            currentValue: newCurrentValue,
            completedToday: isComplete,
            level: newLevel,
            xp: newXp,
            nextLevelXp: newNextLevelXp,
            streak: newStreak,
            history: {
              ...h.history,
              [today]: (h.history[today] || 0) + amount
            }
          };
        })
      };
    }

    case 'ADD_ANTI_SCROLL':
      return {
        ...state,
        antiScrollSessions: [action.payload, ...state.antiScrollSessions]
      };
    
    case 'RESET_DAILY':
      return {
        ...state,
        lastLogin: new Date().toISOString(),
        habits: state.habits.map(h => ({
          ...h,
          currentValue: 0,
          completedToday: false,
        }))
      };

    default:
      return state;
  }
};

// --- Context ---
interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextProps>({ 
  state: defaultState, 
  dispatch: () => null,
  isLoaded: false 
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load from LocalStorage (Effect runs once on mount)
  useEffect(() => {
    // Ensure we are in the browser
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          dispatch({ type: 'INIT_STATE', payload: parsed });
        }
      } catch (e) {
        console.error("Failed to load state", e);
      } finally {
        setIsLoaded(true); // Mark as loaded even if failed or empty
      }
    }
  }, []);

  // 2. Save to LocalStorage & Check Daily Reset
  useEffect(() => {
    // CRITICAL: Do not save default state over existing data before load finishes
    if (!isLoaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    // Daily Reset Logic
    try {
        const lastLoginDate = format(new Date(state.lastLogin), 'yyyy-MM-dd');
        const todayDate = format(new Date(), 'yyyy-MM-dd');

        if (lastLoginDate !== todayDate) {
          dispatch({ type: 'RESET_DAILY' });
        }
    } catch (e) {
        console.error("Date parsing error", e);
    }

  }, [state, isLoaded]);

  // Don't render children until loaded to avoid flash of default content
  if (!isLoaded) return null;

  return (
    <AppContext.Provider value={{ state, dispatch, isLoaded }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => useContext(AppContext);