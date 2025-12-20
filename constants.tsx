
import React from 'react';
import { 
  Home, 
  HelpCircle, 
  Brain, 
  Camera, 
  User, 
  Calculator, 
  BookOpen,
  History,
  TrendingUp,
  Settings,
  Zap
} from 'lucide-react';

export const CLASSES = ['6', '7', '8', '9', '10', '11', '12'];
export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'History', 'Geography', 'Civics', 'Economics', 
  'English', 'Hindi', 'Computer Basics'
];

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: <Home size={24} /> },
  { id: 'quiz', label: 'Quiz', icon: <HelpCircle size={24} /> },
  { id: 'solve', label: 'AI Solve', icon: <Brain size={24} /> },
  { id: 'camera', label: 'Camera', icon: <Camera size={24} /> },
  { id: 'profile', label: 'Profile', icon: <User size={24} /> },
];

export const TRANSLATIONS = {
  en: {
    welcome: "Welcome Back,",
    searchPlaceholder: "Ask any question...",
    quickTools: "Quick Tools",
    aiSolver: "AI Solver",
    cameraSolve: "Solve with Photo",
    formulas: "Formulas",
    calculator: "Calculator",
    startQuiz: "Master Quiz",
    selectClass: "Select Grade",
    selectSubject: "Select Subject",
    next: "Next Question",
    submit: "Submit Quiz",
    results: "Quiz Scoreboard",
    explanation: "Master Sahab Says",
    solvePrompt: "Type your math or theory question here...",
    processing: "Master Sahab is thinking...",
    stepByStep: "Step-by-Step Solution",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    quickAsk: "Quick Ask",
    quickAskPlaceholder: "Fast definition of photosynthesis...",
    fastMode: "Bilingual Mode Active",
    apiError: "Master Sahab is temporarily unavailable. Please check your connection or try again.",
    noKey: "AI features require setup. Tap to configure.",
    setupKey: "Setup AI",
    retry: "Try Again"
  },
  hi: {
    welcome: "नमस्ते,",
    searchPlaceholder: "कोई भी प्रश्न पूछें...",
    quickTools: "क्विक टूल्स",
    aiSolver: "एआई सॉल्वर",
    cameraSolve: "फोटो से हल करें",
    formulas: "सूत्र (Formulas)",
    calculator: "कैलकुलेटर",
    startQuiz: "मास्टर क्विज़",
    selectClass: "कक्षा चुनें",
    selectSubject: "विषय चुनें",
    next: "अगला प्रश्न",
    submit: "सबमिट करें",
    results: "क्विज़ परिणाम",
    explanation: "मास्टर साहब की व्याख्या",
    solvePrompt: "अपना गणित या थ्योरी प्रश्न यहाँ टाइप करें...",
    processing: "मास्टर साहब सोच रहे हैं...",
    stepByStep: "क्रमबद्ध समाधान (Bilingual)",
    easy: "आसान",
    medium: "मध्यम",
    hard: "कठिन",
    quickAsk: "त्वरित पूछें",
    quickAskPlaceholder: "प्रकाश संश्लेषण की परिभाषा...",
    fastMode: "हिंदी + English सक्रिय",
    apiError: "मास्टर साहब अभी उपलब्ध नहीं हैं। कृपया अपना कनेक्शन जांचें या फिर से प्रयास करें।",
    noKey: "एआई सुविधाओं के लिए सेटअप की आवश्यकता है। कॉन्फ़िगर करने के लिए टैप करें।",
    setupKey: "AI सेटअप करें",
    retry: "पुनः प्रयास करें"
  }
};
