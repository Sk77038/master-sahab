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
  AlertTriangle,
  RefreshCcw,
  Search
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
      setSolveResult(err.message === "SERVER_CONFIG_ERROR" 
        ? "System setup in progress. Please set the API_KEY in your deployment dashboard." 
        : err.message || t.apiError);
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
        <h1 className="text-3xl font-black tracking-tighter mb-2">MASTER SAHAB</h1>
        <p className="text-blue-200 font-bold uppercase tracking-[0.3em] text-[10px]">AI Study Companion</p>
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
          <div className="p-5 space-y-6 animate-slide-in pb-32">
            {/* New Glass Header */}
            <header className="flex justify-between items-center bg-white/60 backdrop-blur-xl p-4 rounded-[2rem] border border-white/50 shadow-sm sticky top-2 z-30">
              <div className="flex items-center gap-3">
                <div onClick={() => setIsSidebarOpen(true)} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm cursor-pointer active:scale-95 transition-transform">
                  <Menu size={24} className="text-gray-700" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t.welcome}</p>
                   <h2 className="text-xl font-black text-gray-800 leading-none">{user.name.split(' ')[0]}</h2>
                </div>
              </div>
              <button 
                onClick={toggleLanguage}
                className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 active:scale-95 transition-transform"
              >
                <span className="font-bold text-xs">{language === Language.EN ? 'EN' : 'HI'}</span>
              </button>
            </header>

            {/* Hero Progress Card */}
            <div className="relative overflow-hidden bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200">
              <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12"><Trophy size={140} /></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-200 border border-white/10">Level {user.level}</span>
                    <h2 className="text-4xl font-black mt-2">{user.score} <span className="text-sm font-bold text-slate-400">XP</span></h2>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Star fill="white" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                     <span>Progress</span>
                     <span>{Math.ceil((user.xp / 500) + 1) * 500} XP Goal</span>
                   </div>
                   <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" style={{ width: `${(user.xp % 500) / 5}%` }} />
                   </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Bento Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Quiz Card - Large */}
              <button onClick={() => setCurrentView(View.QUIZ)} className="col-span-2 group relative overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 p-6 h-44 rounded-[2.5rem] text-white text-left shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all">
                <div className="absolute right-0 bottom-0 opacity-20 group-hover:scale-110 transition-transform duration-500">
                  <Brain size={120} />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{t.startQuiz}</h3>
                    <p className="text-indigo-200 text-xs font-medium">Test your knowledge now</p>
                  </div>
                </div>
              </button>

              {/* AI Solver - Tall */}
              <button onClick={() => setCurrentView(View.SOLVE)} className="bg-white p-5 rounded-[2.5rem] flex flex-col justify-between h-48 border border-gray-100 shadow-sm active:scale-95 transition-all group">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Zap size={24} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-black text-gray-800 leading-tight">{t.aiSolver}</h3>
                  <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase">Ask AI</p>
                </div>
              </button>

              {/* Camera - Tall */}
              <button onClick={() => setCurrentView(View.CAMERA)} className="bg-emerald-50 p-5 rounded-[2.5rem] flex flex-col justify-between h-48 border border-emerald-100 shadow-sm active:scale-95 transition-all relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10 text-emerald-600"><Camera size={100} /></div>
                <div className="w-12 h-12 bg-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-center relative z-10">
                  <Camera size={24} />
                </div>
                <div className="text-left relative z-10">
                  <h3 className="text-lg font-black text-emerald-900 leading-tight">{t.cameraSolve}</h3>
                  <p className="text-emerald-600 text-[10px] font-bold mt-1 uppercase">Scan & Solve</p>
                </div>
              </button>
            </div>

            {/* Quick Ask Input */}
            <div className="bg-white p-2 pr-3 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-100 flex items-center gap-2">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
                <Search size={20} />
              </div>
              <input 
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder={t.quickAskPlaceholder}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400"
              />
              <button 
                onClick={handleQuickAsk}
                disabled={isQuickLoading}
                className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all"
              >
                {isQuickLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={18} />}
              </button>
            </div>
            
            {quickResponse && (
               <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 animate-slide-in">
                 <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Quick Answer</p>
                 <p className="text-gray-800 font-medium leading-relaxed">{quickResponse}</p>
               </div>
            )}
          </div>
        );

      case View.QUIZ: return <QuizView language={language} onComplete={() => {}} onExit={() => setCurrentView(View.HOME)} />;
      case View.SOLVE: return (
        <div className="p-5 flex flex-col h-full animate-slide-in">
          <header className="flex items-center gap-4 mb-6">
             <button onClick={() => setCurrentView(View.HOME)} className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm"><ChevronLeft size={24} /></button>
             <h2 className="text-2xl font-black text-gray-800">AI Teacher</h2>
          </header>
          <div className="flex-1 flex flex-col gap-4 relative">
             <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-blue-50 flex-1 relative">
                <textarea 
                  value={solvePrompt}
                  onChange={(e) => setSolvePrompt(e.target.value)}
                  placeholder={t.solvePrompt}
                  className="w-full h-full p-4 resize-none outline-none text-lg font-medium text-gray-700 placeholder:text-gray-300 bg-transparent"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                   <button onClick={() => setSolvePrompt('')} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100"><RefreshCcw size={20} /></button>
                   <button 
                    onClick={handleSolve}
                    disabled={isSolverLoading}
                    className="bg-blue-600 text-white py-4 px-8 rounded-2xl font-black shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center gap-2"
                  >
                    {isSolverLoading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Solve</>}
                  </button>
                </div>
             </div>
             {solveResult && (
              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-lg animate-slide-in max-h-[40vh] overflow-y-auto">
                 <div className="flex items-center gap-2 mb-3 text-blue-600">
                    <Sparkles size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Solution</span>
                 </div>
                 <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                   {solveResult}
                 </div>
              </div>
             )}
          </div>
        </div>
      );
      case View.CAMERA: return <CameraView language={language} onBack={() => setCurrentView(View.HOME)} />;
      case View.CALCULATOR: return <CalculatorView onBack={() => setCurrentView(View.HOME)} />;
      case View.PROFILE: return (
        <div className="p-5 animate-slide-in pb-24">
          <header className="flex items-center gap-4 mb-8">
             <button onClick={() => setCurrentView(View.HOME)} className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm"><ChevronLeft size={24} /></button>
             <h2 className="text-2xl font-black text-gray-800">My Profile</h2>
          </header>
          <div className="bg-white p-8 rounded-[3rem] text-center shadow-xl shadow-gray-100 border border-gray-50 relative overflow-hidden mb-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-4 p-1 border-4 border-white shadow-lg">
               <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-black">
                 {user.name.charAt(0)}
               </div>
            </div>
            <h2 className="text-3xl font-black text-gray-900">{user.name}</h2>
            <p className="text-gray-400 font-medium mb-6">{user.email}</p>
            <div className="flex justify-center gap-2">
              <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest">Class {user.class}</span>
              <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-black uppercase tracking-widest">Scholar</span>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-5 bg-red-50 text-red-500 rounded-[2rem] font-bold active:scale-95 transition-all">Logout Account</button>
        </div>
      );
      case View.PRIVACY: return <PrivacyView onBack={() => setCurrentView(View.HOME)} />;
      case View.SETTINGS: return (
        <div className="p-5 animate-slide-in">
           <header className="flex items-center gap-4 mb-8">
             <button onClick={() => setCurrentView(View.HOME)} className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm"><ChevronLeft size={24} /></button>
             <h2 className="text-2xl font-black text-gray-800">Settings</h2>
          </header>
          <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100">
             <div className="flex items-center justify-between py-4 border-b border-gray-50">
               <span className="font-bold text-gray-700">Dark Mode</span>
               <div className="w-12 h-7 bg-gray-200 rounded-full p-1"><div className="w-5 h-5 bg-white rounded-full shadow-sm"></div></div>
             </div>
             <div className="flex items-center justify-between py-4">
               <span className="font-bold text-gray-700">Notifications</span>
               <div className="w-12 h-7 bg-blue-600 rounded-full p-1 flex justify-end"><div className="w-5 h-5 bg-white rounded-full shadow-sm"></div></div>
             </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#F8FAFC] relative overflow-hidden font-sans">
      <Sidebar user={user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={setCurrentView} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto scrollbar-hide pt-safe">{renderContent()}</main>
      
      {/* Floating Glass Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-white/40 flex justify-between items-center py-4 px-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 z-50">
        {NAV_ITEMS.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setCurrentView(item.id as View)} 
            className={`flex flex-col items-center gap-1 transition-all relative ${currentView === item.id ? 'text-blue-600 -translate-y-1' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {currentView === item.id && <div className="absolute -bottom-9 w-12 h-12 bg-blue-600/20 blur-xl rounded-full" />}
            {item.icon}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
