
export enum Language {
  EN = 'en',
  HI = 'hi'
}

export enum View {
  HOME = 'home',
  QUIZ = 'quiz',
  SOLVE = 'solve',
  CAMERA = 'camera',
  PROFILE = 'profile',
  CALCULATOR = 'calculator',
  FORMULA = 'formula',
  LEADERBOARD = 'leaderboard',
  SETTINGS = 'settings',
  PRIVACY = 'privacy'
}

export interface Question {
  id: string;
  text_en: string;
  text_hi: string;
  options_en: string[];
  options_hi: string[];
  correctAnswer: number;
  explanation_en: string;
  explanation_hi: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'mcq' | 'boolean' | 'numerical';
}

export interface UserProfile {
  name: string;
  email: string;
  class: string;
  score: number;
  xp: number;
  level: number;
  quizzesTaken: number;
  joinedDate: string;
}

export interface CalculationResult {
  formula: string;
  result: string;
}
