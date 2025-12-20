import React, { useState, useEffect } from 'react';
import { View, Language, UserProfile } from './types';
import { NAV_ITEMS, TRANSLATIONS, CLASSES, SUBJECTS } from './constants';
import { QuizView } from './components/QuizView';
import { CameraView } from './components/CameraView';
import { CalculatorView } from './components/CalculatorView';
import { LoginView } from './components/LoginView';
import { Sidebar } from './components/Sidebar';
import { PrivacyView } from './components/PrivacyView';
import { authService } from './components/services/authService';
import { solveQuestion, fastExplain } from './components/services/geminiService';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  Calculator, 
  Languages,
  TrendingUp,
  History,
  Zap,
  ArrowRight,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  Award,
  Menu,
  Star,
  Settings,
  Trophy,
  Bell,
  User,
  Shield,
  HelpCircle,
  ChevronLeft,
  Brain,
  ShieldAlert,
  Camera,
  Loader2
} from 'lucide-react';

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isSolverLoading, setIsSolverLoading] = useState(false);
  const [solveResult, setSolveResult] = useState("");
  const [solvePrompt, setSolvePrompt] = useState("");
  const [solveError, setSolveError] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(authService.getUser());
  
  const [quickPrompt, setQuickPrompt] = useState("");
  const [quickResponse, setQuickResponse] = useState("");
  const [isQuickLoading, setIsQuickLoading] = useState(false);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const init = async () => {
      setTimeout(() => setIsAppLoading(false), 2000);
    };
    init();
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === Language.EN ? Language.HI : Language.EN);
  };

  const handleLogin = (newUser: UserProfile) => {
    authService.saveUser(newUser);
    setUser(newUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsSidebarOpen(false);
    setCurrentView(View.HOME);
  };

  const handleQuickAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim() || isQuickLoading) return;
    setIsQuickLoading(true);
    setQuickResponse("");
    try {
      const res = await fastExplain(quickPrompt, language);
      setQuickResponse(res || "Could not find an answer.");
    } catch (err: any) {
      setQuickResponse(t.apiError);
    } finally {
      setIsQuickLoading(false);
    }
  };

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solvePrompt.trim() || isSolverLoading) return;
    setIsSolverLoading(true);
    setSolveResult("");
    setSolveError(false);
    try {
      const res = await solveQuestion(solvePrompt, language);
      setSolveResult(res || "No solution found.");
    } catch (err: any) {
      setSolveError(true);
      setSolveResult(t.apiError);
    } finally {
      setIsSolverLoading(false);
    }
  };

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-blue-600 flex flex-col items-center justify-center z-[100] text-white">
        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl animate-bounce mb-6">
          <Brain size={50} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter mb-2">MASTER SAHAB AI</h1>
        <p className="text-blue-200 font-bold uppercase tracking-[0.3em] text-[10px]">Your Digital Guru</p>
        <div className="absolute bottom-12 flex flex-col items-center gap-2">
           <div className="w-48 h-1 bg-blue-700 rounded-full overflow-hidden">
             <div className="h-full bg-white w-1/2 animate-[loading_1.5s_infinite_linear]" />
           </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.HOME:
        return (
          <div className="p-4 space-y-6 animate-slide-in pb-24">
            <header className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-600"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t.welcome}</h1>
                  <p className="text-xl font-black text-gray-900 leading-tight">{user.name.split(' ')[0]}</p>
                </div>
              </div>
              <button 
                onClick={toggleLanguage}
                className="bg-blue-50 text-blue-600 px-3 py-2 rounded-xl text-xs font-black shadow-sm flex items-center gap-2"
              >
                <Languages size={14} /> {language === Language.EN ? 'HI' : 'EN'}
              </button>
            </header>

            <div className="bg-white p-4 rounded-3xl shadow-sm border border-blue-50">
               <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-black text-gray-800">LVL {user.level}</span>
                  <span className="text-[10px] text-blue-600 font-black flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> {user.score} XP
                  </span>
               </div>
               <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${(user.xp % 500) / 5}%` }} />
               </div>
            </div>

            <div className="bg-white p-4 rounded-3xl shadow-sm border border-amber-100">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-amber-500" fill="currentColor" />
                <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest">{t.quickAsk}</h3>
              </div>
              <form onSubmit={handleQuickAsk} className="relative">
                <input 
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder={t.quickAskPlaceholder}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 pr-14 text-sm"
                />
                <button 
                  type="submit" 
                  disabled={isQuickLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50"
                >
                  {isQuickLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={20} />}
                </button>
              </form>
              {quickResponse && (
                <div className="mt-4 p-4 bg-amber-50 rounded-2xl text-sm text-gray-800 border border-amber-100 animate-slide-in">
                  <p className="font-black text-amber-700 text-[10px] uppercase mb-1">{t.explanation}:</p>
                  <p className="font-medium">{quickResponse}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setCurrentView(View.QUIZ)} className="bg-blue-600 p-6 rounded-[2.5rem] text-white flex flex-col gap-3 shadow-xl shadow-blue-100 active:scale-95 transition-all">
                <HelpCircle size={32} />
                <span className="font-black text-left">{t.startQuiz}</span>
              </button>
              <button onClick={() => setCurrentView(View.SOLVE)} className="bg-white border border-gray-100 p-6 rounded-[2.5rem] text-blue-600 flex flex-col gap-3 shadow-sm active:scale-95 transition-all">
                <Brain size={32} />
                <span className="font-black text-left text-gray-900">{t.aiSolver}</span>
              </button>
            </div>

            <button onClick={() => setCurrentView(View.CAMERA)} className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 p-6 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl shadow-blue-100 overflow-hidden relative active:scale-[0.98] transition-all">
               <div className="flex flex-col text-left">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-70">New Feature</span>
                 <span className="text-xl font-black">{t.cameraSolve}</span>
               </div>
               <Camera size={40} className="opacity-40" />
            </button>
          </div>
        );

      case View.QUIZ: return <QuizView language={language} onComplete={() => {}} onExit={() => setCurrentView(View.HOME)} />;
      case View.SOLVE: return (
        <div className="p-4 flex flex-col gap-6 animate-slide-in pb-20">
          <header className="flex items-center gap-4 mt-2">
             <button onClick={() => setCurrentView(View.HOME)} className="p-2 bg-white rounded-xl border"><ChevronLeft size={24} /></button>
             <h2 className="text-xl font-black">AI Solver</h2>
          </header>
          <form onSubmit={handleSolve} className="relative">
            <textarea 
              value={solvePrompt}
              onChange={(e) => setSolvePrompt(e.target.value)}
              placeholder={t.solvePrompt}
              className="w-full h-56 p-6 rounded-[2rem] border-2 border-blue-50 focus:border-blue-500 outline-none resize-none bg-white text-lg font-medium shadow-sm"
            />
            <button 
              type="submit" 
              disabled={isSolverLoading}
              className="absolute bottom-6 right-6 bg-blue-600 text-white p-4 rounded-2xl shadow-xl disabled:opacity-50"
            >
              {isSolverLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
            </button>
          </form>
          {solveResult && (
            <div className={`p-6 rounded-[2rem] border shadow-sm animate-slide-in ${solveError ? 'bg-red-50 border-red-100' : 'bg-white border-blue-50'}`}>
              <div className="flex items-center gap-2 mb-4">
                 <Sparkles size={16} className={solveError ? 'text-red-500' : 'text-blue-600'} />
                 <h3 className={`text-xs font-black uppercase tracking-widest ${solveError ? 'text-red-600' : 'text-blue-600'}`}>
                   {solveError ? 'Error Occurred' : t.stepByStep}
                 </h3>
              </div>
              <div className={`prose max-w-none whitespace-pre-wrap font-medium leading-relaxed ${solveError ? 'text-red-700' : 'text-gray-700'}`}>
                {solveResult}
              </div>
            </div>
          )}
        </div>
      );
      case View.CAMERA: return <CameraView language={language} onBack={() => setCurrentView(View.HOME)} />;
      case View.CALCULATOR: return <CalculatorView onBack={() => setCurrentView(View.HOME)} />;
      case View.PROFILE: return (
        <div className="p-4 flex flex-col gap-6 animate-slide-in">
          <header className="flex items-center gap-4 mt-2">
             <button onClick={() => setCurrentView(View.HOME)} className="p-2 bg-white rounded-xl border"><ChevronLeft size={24} /></button>
             <h2 className="text-xl font-black">My Profile</h2>
          </header>
          <div className="bg-white p-8 rounded-[2.5rem] border border-blue-50 text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white text-3xl font-black mb-4">{user.name.charAt(0)}</div>
            <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
            <p className="text-gray-400 font-bold uppercase text-[10px] mt-1">Class {user.class}th • {user.email}</p>
          </div>
          <button onClick={handleLogout} className="w-full p-5 bg-red-50 text-red-600 font-black rounded-3xl mt-4">Logout</button>
        </div>
      );
      case View.PRIVACY: return <PrivacyView onBack={() => setCurrentView(View.HOME)} />;
      case View.SETTINGS: return <div className="p-4"><button onClick={() => setCurrentView(View.HOME)}>Back</button></div>;
      default: return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#FDFDFD] relative overflow-hidden">
      <Sidebar user={user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={setCurrentView} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-xl border-t border-gray-50 flex justify-around items-center py-4 z-40">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} onClick={() => setCurrentView(item.id as View)} className={`flex flex-col items-center gap-1 ${currentView === item.id ? 'text-blue-600' : 'text-gray-300'}`}>
            {item.icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;