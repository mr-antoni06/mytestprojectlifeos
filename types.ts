export interface Habit {
  id: string;
  name: string;
  category: 'health' | 'creation' | 'learning' | 'career' | 'misc';
  dailyTarget: number;
  unit: string;
  currentValue: number; // For the current day
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  completedToday: boolean;
  history: Record<string, number>; // "YYYY-MM-DD": value
}

export interface AntiScrollSession {
  id: string;
  date: string; // ISO String
  potentialScrollTime: number; // Minutes
  productiveActivityId: string; // ID of the habit done instead
  actualProductiveTime: number; // Minutes
}

export interface AppState {
  habits: Habit[];
  antiScrollSessions: AntiScrollSession[];
  userLevel: number; // Global user level
  lastLogin: string;
}

export type ViewState = 'dashboard' | 'analytics' | 'antiscroll' | 'planner';

export const LEVELS = {
  1: 100,
  2: 250,
  3: 500,
  4: 1000,
  5: 2000,
  6: 4000,
  7: 8000,
  8: 16000,
  9: 32000,
  10: 64000
};