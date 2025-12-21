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
  Languages,
  Zap,
  ArrowRight,
  Menu,
  Star,
  ChevronLeft,
  Brain,
  Camera,
  Loader2,
  Trophy,
  Bell,
  AlertTriangle
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
      setQuickResponse(res);
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
      setSolveResult(res);
    } catch (err: any) {
      setSolveError(true);
      setSolveResult(err.message || t.apiError);
    } finally {
      setIsSolverLoading(false);
    }
  };

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-blue-600 flex flex-col items-center justify-center z-[100] text-white">
        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl animate-bounce mb-6">
          <Brain size={50} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter mb-2">MASTER SAHAB AI</h1>
        <p className="text-blue-200 font-bold uppercase tracking-[0.3em] text-[10px]">Premium Study Suite</p>
        <div className="absolute bottom-12 flex flex-col items-center gap-2">
           <div className="w-48 h-1.5 bg-blue-700 rounded-full overflow-hidden">
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
          <div className="p-4 space-y-6 animate-slide-in pb-28">
            <header className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 active:scale-90 transition-transform"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t.welcome}</h1>
                  <p className="text-xl font-black text-gray-900 leading-tight">{user.name.split(' ')[0]}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 bg-gray-50 text-gray-400 rounded-xl">
                  <Bell size={20} />
                </button>
                <button 
                  onClick={toggleLanguage}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-blue-100 flex items-center gap-2"
                >
                  <Languages size={14} /> {language === Language.EN ? 'EN' : 'HI'}
                </button>
              </div>
            </header>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
               <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
                 <Trophy size={160} />
               </div>
               <div className="flex justify-between items-end mb-4 relative z-10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Current Progress</span>
                    <p className="text-2xl font-black">Level {user.level}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-black flex items-center gap-2">
                    <Star size={14} fill="white" /> {user.score} XP
                  </div>
               </div>
               <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden relative z-10">
                  <div className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" style={{ width: `${(user.xp % 500) / 5}%` }} />
               </div>
               <p className="mt-3 text-[10px] font-bold opacity-70 relative z-10 uppercase tracking-widest">Next Level at {Math.ceil((user.xp / 500) + 1) * 500} XP</p>
            </div>

            <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                  <Zap size={18} fill="currentColor" />
                </div>
                <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest">{t.quickAsk}</h3>
              </div>
              <form onSubmit={handleQuickAsk} className="relative">
                <input 
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder={t.quickAskPlaceholder}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-400 focus:bg-white transition-all rounded-[1.5rem] py-4 px-5 pr-14 text-sm font-medium outline-none"
                />
                <button 
                  type="submit" 
                  disabled={isQuickLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50 shadow-lg shadow-amber-100"
                >
                  {isQuickLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={20} />}
                </button>
              </form>
              {quickResponse && (
                <div className="mt-4 p-5 bg-amber-50 rounded-3xl text-sm text-gray-800 border border-amber-100 animate-slide-in">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain size={14} className="text-amber-600" />
                    <span className="font-black text-amber-700 text-[10px] uppercase tracking-widest">{t.explanation}</span>
                  </div>
                  <p className="font-medium leading-relaxed">{quickResponse}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setCurrentView(View.QUIZ)} className="group bg-indigo-600 p-6 rounded-[2.5rem] text-white flex flex-col gap-4 shadow-xl shadow-indigo-100 active:scale-95 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Brain size={60} /></div>
                <div className="bg-white/20 p-3 rounded-2xl w-fit"><Sparkles size={24} /></div>
                <span className="font-black text-lg leading-tight text-left">{t.startQuiz}</span>
              </button>
              
              <button onClick={() => setCurrentView(View.SOLVE)} className="group bg-white border border-gray-100 p-6 rounded-[2.5rem] text-blue-600 flex flex-col gap-4 shadow-sm active:scale-95 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Sparkles size={60} /></div>
                <div className="bg-blue-50 p-3 rounded-2xl w-fit"><Brain size={24} /></div>
                <span className="font-black text-lg leading-tight text-left text-gray-900">{t.aiSolver}</span>
              </button>
            </div>

            <button onClick={() => setCurrentView(View.CAMERA)} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl shadow-emerald-100 overflow-hidden relative active:scale-[0.98] transition-all group">
               <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
               <div className="flex flex-col text-left relative z-10">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">OCR Scanner</span>
                 <span className="text-2xl font-black">{t.cameraSolve}</span>
               </div>
               <div className="relative z-10 p-4 bg-white/20 rounded-3xl backdrop-blur-sm">
                 <Camera size={32} />
               </div>
            </button>
          </div>
        );

      case View.QUIZ: return <QuizView language={language} onComplete={() => {}} onExit={() => setCurrentView(View.HOME)} />;
      case View.SOLVE: return (
        <div className="p-4 flex flex-col gap-6 animate-slide-in pb-20">
          <header className="flex items-center gap-4 mt-2">
             <button onClick={() => setCurrentView(View.HOME)} className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-90 transition-transform"><ChevronLeft size={24} /></button>
             <h2 className="text-xl font-black">AI Study Guru</h2>
          </header>
          <form onSubmit={handleSolve} className="relative">
            <textarea 
              value={solvePrompt}
              onChange={(e) => setSolvePrompt(e.target.value)}
              placeholder={t.solvePrompt}
              className="w-full h-64 p-7 rounded-[2.5rem] border-2 border-gray-100 focus:border-blue-500 outline-none resize-none bg-white text-lg font-medium shadow-sm transition-all"
            />
            <button 
              type="submit" 
              disabled={isSolverLoading}
              className="absolute bottom-6 right-6 bg-blue-600 text-white p-5 rounded-3xl shadow-xl shadow-blue-200 disabled:opacity-50 active:scale-90 transition-all"
            >
              {isSolverLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
            </button>
          </form>
          {solveResult && (
            <div className={`p-8 rounded-[2.5rem] border shadow-sm animate-slide-in mb-10 ${solveError ? 'bg-red-50 border-red-100' : 'bg-white border-blue-50'}`}>
              <div className="flex items-center gap-3 mb-6">
                 <div className={`p-2 rounded-xl ${solveError ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                   {solveError ? <AlertTriangle size={20} /> : <Sparkles size={20} />}
                 </div>
                 <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${solveError ? 'text-red-600' : 'text-blue-600'}`}>
                   {solveError ? 'Error Message' : t.stepByStep}
                 </h3>
              </div>
              <div className={`prose max-w-none whitespace-pre-wrap font-medium leading-relaxed ${solveError ? 'text-red-700 italic' : 'text-gray-700'}`}>
                {solveResult}
              </div>
              <button 
                onClick={() => setSolveResult("")}
                className="mt-8 w-full py-4 border-2 border-gray-100 text-gray-400 font-black rounded-2xl text-xs uppercase tracking-widest"
              >
                Clear Screen
              </button>
            </div>
          )}
        </div>
      );
      case View.CAMERA: return <CameraView language={language} onBack={() => setCurrentView(View.HOME)} />;
      case View.CALCULATOR: return <CalculatorView onBack={() => setCurrentView(View.HOME)} />;
      case View.PROFILE: return (
        <div className="p-4 flex flex-col gap-6 animate-slide-in">
          <header className="flex items-center gap-4 mt-2">
             <button onClick={() => setCurrentView(View.HOME)} className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm"><ChevronLeft size={24} /></button>
             <h2 className="text-xl font-black">My Profile</h2>
          </header>
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-blue-600/5 -mt-2"></div>
            <div className="relative z-10 w-28 h-28 bg-blue-600 rounded-[2.5rem] mx-auto flex items-center justify-center text-white text-4xl font-black mb-6 shadow-xl shadow-blue-100 border-4 border-white">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-3xl font-black text-gray-900 leading-tight">{user.name}</h2>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest bg-gray-50 px-3 py-1 rounded-full">Class {user.class}th</span>
              <span className="text-blue-600 font-bold uppercase text-[10px] tracking-widest bg-blue-50 px-3 py-1 rounded-full">Scholar</span>
            </div>
            <p className="text-gray-400 font-medium text-sm mt-4">{user.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
               <p className="text-[10px] font-black text-gray-400 uppercase mb-1">XP Points</p>
               <p className="text-2xl font-black text-blue-600">{user.xp}</p>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
               <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Rank</p>
               <p className="text-2xl font-black text-amber-600">#124</p>
             </div>
          </div>
          <button onClick={handleLogout} className="w-full p-6 bg-red-50 text-red-600 font-black rounded-[2rem] mt-4 border border-red-100 active:bg-red-100 transition-colors">Logout Account</button>
        </div>
      );
      case View.PRIVACY: return <PrivacyView onBack={() => setCurrentView(View.HOME)} />;
      case View.SETTINGS: return (
        <div className="p-4 flex flex-col gap-6 animate-slide-in">
          <header className="flex items-center gap-4 mt-2">
             <button onClick={() => setCurrentView(View.HOME)} className="p-3 bg-white rounded-2xl border"><ChevronLeft size={24} /></button>
             <h2 className="text-xl font-black">App Settings</h2>
          </header>
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 space-y-4">
            <div className="flex items-center justify-between p-2">
              <span className="font-bold text-gray-700">Dark Mode</span>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div></div>
            </div>
            <div className="flex items-center justify-between p-2">
              <span className="font-bold text-gray-700">Push Notifications</span>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div></div>
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#FAFAFA] relative overflow-hidden">
      <Sidebar user={user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={setCurrentView} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto pt-safe">{renderContent()}</main>
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-2xl border-t border-gray-50 flex justify-around items-center py-5 z-40 px-4 rounded-t-[2.5rem] shadow-2xl">
        {NAV_ITEMS.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setCurrentView(item.id as View)} 
            className={`flex flex-col items-center gap-1.5 transition-all relative ${currentView === item.id ? 'text-blue-600 scale-110' : 'text-gray-300'}`}
          >
            {currentView === item.id && <div className="absolute -top-1 w-1 h-1 bg-blue-600 rounded-full" />}
            {item.icon}
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;