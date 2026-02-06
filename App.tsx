import React, { useState, useEffect } from 'react';
import { View, Language, UserProfile } from './types';
import { NAV_ITEMS, TRANSLATIONS } from './constants';
import { QuizView } from './components/QuizView';
import { CameraView } from './components/CameraView';
import { CalculatorView } from './components/CalculatorView';
import { LoginView } from './components/LoginView';
import { Sidebar } from './components/Sidebar';
import { PrivacyView } from './components/PrivacyView';
import { authService } from './components/services/authService';
import { solveQuestion, fastExplain } from './components/services/geminiService';
import { 
  Sparkles, Send, Zap, Menu, Star, ChevronLeft, Brain, 
  Camera, Loader2, Trophy, Search, ArrowRight, X,
  Settings, LogOut, ShieldCheck
} from 'lucide-react';

// --- ONBOARDING COMPONENT ---
const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [slide, setSlide] = useState(0);
  const slides = [
    { title: "AI Homework Helper", desc: "Stuck on a problem? Just snap a photo or type it out.", icon: <Brain size={64} className="text-blue-400" /> },
    { title: "Smart Quizzes", desc: "Test your knowledge with AI-generated bilingual quizzes.", icon: <Trophy size={64} className="text-amber-400" /> },
    { title: "Instant Doubts", desc: "Get quick definitions and explanations in Hindi & English.", icon: <Zap size={64} className="text-purple-400" /> }
  ];

  return (
    <div className="fixed inset-0 bg-black text-white z-50 flex flex-col items-center justify-between p-8 pb-12">
      <div className="w-full flex justify-end">
        <button onClick={onComplete} className="text-gray-400 font-bold text-sm">SKIP</button>
      </div>
      <div className="text-center animate-slide-in">
        <div className="mb-8 flex justify-center">{slides[slide].icon}</div>
        <h2 className="text-3xl font-black mb-4">{slides[slide].title}</h2>
        <p className="text-gray-400 text-lg leading-relaxed">{slides[slide].desc}</p>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === slide ? 'w-8 bg-blue-500' : 'w-2 bg-gray-700'}`} />
          ))}
        </div>
        <button 
          onClick={() => slide < 2 ? setSlide(s => s + 1) : onComplete()}
          className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center font-bold active:scale-90 transition-all"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [user, setUser] = useState<UserProfile | null>(authService.getUser());
  
  // Sidebar & Logic States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState("");
  const [quickResponse, setQuickResponse] = useState("");
  const [isQuickLoading, setIsQuickLoading] = useState(false);
  const [solvePrompt, setSolvePrompt] = useState("");
  const [solveResult, setSolveResult] = useState("");
  const [isSolverLoading, setIsSolverLoading] = useState(false);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    // Check if first time user
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    setTimeout(() => {
      setIsAppLoading(false);
      if (!user && !hasSeenOnboarding) setShowOnboarding(true);
    }, 2000);
  }, [user]);

  const finishOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleLogin = (newUser: UserProfile) => {
    authService.saveUser(newUser);
    setUser(newUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsSidebarOpen(false);
  };

  // --- API HANDLERS ---
  const handleQuickAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    setIsQuickLoading(true);
    setQuickResponse("");
    try {
      const res = await fastExplain(quickPrompt, language);
      setQuickResponse(res);
    } catch (err) { setQuickResponse("Connection Error"); }
    setIsQuickLoading(false);
  };

  const handleSolve = async () => {
    if (!solvePrompt.trim()) return;
    setIsSolverLoading(true);
    try {
      const res = await solveQuestion(solvePrompt, language);
      setSolveResult(res);
    } catch (err) { setSolveResult("Could not solve at this moment."); }
    setIsSolverLoading(false);
  };

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-[60px] opacity-40"></div>
          <Brain size={60} className="text-white relative z-10 animate-bounce" />
        </div>
        <h1 className="text-white text-2xl font-black mt-6 tracking-widest">MASTER SAHAB</h1>
      </div>
    );
  }

  if (showOnboarding) return <Onboarding onComplete={finishOnboarding} />;
  if (!user) return <LoginView onLogin={handleLogin} />;

  // --- DASHBOARD RENDERER ---
  const renderContent = () => {
    if (currentView === View.HOME) return (
      <div className="p-6 pb-32 animate-slide-in space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Welcome back</p>
            <h1 className="text-3xl font-black text-gray-800">{user.name.split(' ')[0]}</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <Menu size={24} />
          </button>
        </header>

        {/* Hero Search */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white p-2 rounded-[2rem] border border-gray-100 shadow-xl flex items-center gap-2 pr-2">
             <div className="p-3 bg-gray-50 rounded-full text-gray-400"><Search size={20} /></div>
             <input 
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Ask anything..." 
              className="flex-1 bg-transparent outline-none font-medium text-gray-700"
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAsk(e)}
             />
             <button onClick={handleQuickAsk} disabled={isQuickLoading} className="p-3 bg-black text-white rounded-full">
               {isQuickLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
             </button>
          </div>
        </div>

        {quickResponse && (
          <div className="bg-gray-900 text-gray-100 p-6 rounded-[2rem] animate-slide-in relative overflow-hidden">
