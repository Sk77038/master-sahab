
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
  ShieldAlert
} from 'lucide-react';

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isSolverLoading, setIsSolverLoading] = useState(false);
  const [solveResult, setSolveResult] = useState("");
  const [solvePrompt, setSolvePrompt] = useState("");
  const [solveError, setSolveError] = useState(false);
  
  // App states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(authService.getUser());
  
  // Quick Ask States
  const [quickPrompt, setQuickPrompt] = useState("");
  const [quickResponse, setQuickResponse] = useState("");
  const [isQuickLoading, setIsQuickLoading] = useState(false);

  // Key Selection State
  const [hasKey, setHasKey] = useState(true);

  // Mock Data
  const leaderboardData = [
    { rank: 1, name: "Rahul S.", score: 4500, avatar: "R", level: 12 },
    { rank: 2, name: "Priya M.", score: 4250, avatar: "P", level: 11 },
    { rank: 3, name: "Amit K.", score: 3900, avatar: "A", level: 10 },
    { rank: 4, name: "Sneha G.", score: 3600, avatar: "S", level: 9 },
    { rank: 5, name: "Vikram P.", score: 3100, avatar: "V", level: 8 },
  ];

  const dailyProgress = [
    { day: 'Mon', value: 40 },
    { day: 'Tue', value: 70 },
    { day: 'Wed', value: 90 },
    { day: 'Thu', value: 65 },
    { day: 'Fri', value: 85 },
    { day: 'Sat', value: 30 },
    { day: 'Sun', value: 50 },
  ];

  const quizHistory = [
    { id: 'q1', subject: 'Mathematics', score: '18/20', grade: 'A', date: '21 May' },
    { id: 'q2', subject: 'Chemistry', score: '17/20', grade: 'A', date: '19 May' },
    { id: 'q3', subject: 'English', score: '20/20', grade: 'A+', date: '15 May' },
  ];

  const t = TRANSLATIONS[language];

  useEffect(() => {
    // Initializing App with Splash delay
    const init = async () => {
      await checkKeyStatus();
      setTimeout(() => setIsAppLoading(false), 2500);
    };
    init();
  }, []);

  const checkKeyStatus = async () => {
    if (window.aistudio?.hasSelectedApiKey) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const handleOpenKeySelection = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

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
    if (!quickPrompt.trim()) return;
    setIsQuickLoading(true);
    setQuickResponse("");
    try {
      const res = await fastExplain(quickPrompt, language);
      setQuickResponse(res || "");
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
      }
      setQuickResponse(t.apiError);
    } finally {
      setIsQuickLoading(false);
    }
  };

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solvePrompt.trim()) return;
    setIsSolverLoading(true);
    setSolveResult("");
    setSolveError(false);
    try {
      const res = await solveQuestion(solvePrompt, language);
      setSolveResult(res || "No solution found.");
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
      }
      setSolveError(true);
      setSolveResult(t.apiError);
    } finally {
      setIsSolverLoading(false);
    }
  };

  const handleQuizComplete = (score: number) => {
    if (!user) return;
    const xpEarned = score * 10;
    const updatedUser = {
        ...user,
        score: user.score + xpEarned,
        xp: user.xp + xpEarned,
        quizzesTaken: user.quizzesTaken + 1,
        level: Math.floor((user.xp + xpEarned) / 500) + 1
    };
    setUser(updatedUser);
    authService.saveUser(updatedUser);
  };

  // Splash Screen Component
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
           <span className="text-[10px] font-black opacity-50">POWERED BY GEMINI 2.5</span>
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
                  className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 active:scale-95 transition-all"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t.welcome}</h1>
                  <p className="text-xl font-black text-gray-900 leading-tight">{user.name.split(' ')[0]}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleLanguage}
                  className="bg-blue-50 text-blue-600 px-3 py-2 rounded-xl text-xs font-black shadow-sm flex items-center gap-2"
                >
                  <Languages size={14} /> {language === Language.EN ? 'HI' : 'EN'}
                </button>
                <div onClick={() => setCurrentView(View.PROFILE)} className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 cursor-pointer">
                  {user.name.charAt(0)}
                </div>
              </div>
            </header>

            {/* Level Stats Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-blue-50">
               <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-gray-800">LVL {user.level}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{user.xp % 500} / 500 XP</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-black flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> {user.score} TOTAL SCORE
                  </span>
               </div>
               <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500" 
                    style={{ width: `${(user.xp % 500) / 5}%` }}
                  />
               </div>
            </div>

            {/* AI Search Tool */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-amber-100 ring-4 ring-amber-50/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-amber-100 text-amber-600 rounded-xl">
                  <Zap size={18} fill="currentColor" />
                </div>
                <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest">{t.quickAsk}</h3>
                <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg border border-amber-200 font-black ml-auto">{t.fastMode}</span>
              </div>
              <form onSubmit={handleQuickAsk} className="relative">
                <input 
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder={t.quickAskPlaceholder}
                  className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-amber-400 rounded-2xl py-4 px-4 pr-14 text-sm text-gray-700 font-medium"
                />
                <button 
                  type="submit"
                  disabled={isQuickLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-200 flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
                >
                  {isQuickLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : <ArrowRight size={20} />}
                </button>
              </form>
              {quickResponse && (
                <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-sm text-gray-800 animate-slide-in">
                  <p className="font-black text-amber-700 text-xs uppercase mb-1 tracking-widest">Master Sahab Says:</p>
                  <p className="font-medium leading-relaxed">{quickResponse}</p>
                </div>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => setCurrentView(View.LEADERBOARD)} className="bg-gradient-to-br from-blue-600 to-blue-800 p-5 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden group cursor-pointer">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Trophy size={80} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">XP Points</p>
                <p className="text-3xl font-black">{user.xp}</p>
              </div>
              <div onClick={() => setCurrentView(View.PROFILE)} className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden group cursor-pointer">
                 <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                  <History size={80} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Quizzes</p>
                <p className="text-3xl font-black">{user.quizzesTaken}</p>
              </div>
            </div>

            {/* Main Feature Cards */}
            <section className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
               <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-3">
                   <Award size={24} className="text-blue-300" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Featured Quiz</span>
                 </div>
                 <h2 className="text-2xl font-black mb-2 leading-tight">Master Quiz Marathon</h2>
                 <p className="text-blue-100 mb-6 text-sm font-medium opacity-80">Test your brain with AI-generated challenges.</p>
                 <button 
                   onClick={() => setCurrentView(View.QUIZ)}
                   className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2"
                 >
                   {t.startQuiz} <ArrowRight size={18} />
                 </button>
               </div>
               <Sparkles className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10" />
            </section>
          </div>
        );

      case View.QUIZ:
        return <QuizView language={language} onComplete={handleQuizComplete} onExit={() => setCurrentView(View.HOME)} />;

      case View.LEADERBOARD:
        return (
          <div className="p-4 flex flex-col gap-6 animate-slide-in pb-20">
            <header className="flex items-center justify-between mt-2">
               <button onClick={() => setCurrentView(View.HOME)} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"><ChevronLeft size={24} /></button>
               <h2 className="text-xl font-black text-gray-900">Leaderboard</h2>
               <div className="w-10"></div>
            </header>

            {/* Top 3 Podiums */}
            <div className="flex justify-center items-end gap-2 py-6 h-64">
              {/* 2nd Place */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-2xl border-4 border-white shadow-lg mb-2">{leaderboardData[1].avatar}</div>
                <div className="w-full bg-white h-24 rounded-t-3xl shadow-sm border border-gray-100 flex flex-col items-center pt-2">
                  <span className="text-xs font-black text-gray-400">#2</span>
                  <span className="text-sm font-bold truncate w-20 text-center">{leaderboardData[1].name}</span>
                </div>
              </div>
              {/* 1st Place */}
              <div className="flex flex-col items-center flex-1 z-10">
                <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center font-black text-3xl border-4 border-amber-400 shadow-xl mb-2 relative">
                   <Star className="absolute -top-3 -right-3 text-amber-500 animate-bounce" size={24} fill="currentColor" />
                   {leaderboardData[0].avatar}
                </div>
                <div className="w-full bg-blue-600 h-32 rounded-t-3xl shadow-xl flex flex-col items-center pt-2 text-white">
                  <span className="text-xs font-black text-blue-200">#1</span>
                  <span className="text-sm font-black truncate w-24 text-center">{leaderboardData[0].name}</span>
                  <span className="text-xs font-bold mt-2 bg-white/20 px-2 py-0.5 rounded-full">{leaderboardData[0].score} pts</span>
                </div>
              </div>
              {/* 3rd Place */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center font-black text-2xl border-4 border-orange-200 shadow-lg mb-2">{leaderboardData[2].avatar}</div>
                <div className="w-full bg-white h-20 rounded-t-3xl shadow-sm border border-gray-100 flex flex-col items-center pt-2">
                  <span className="text-xs font-black text-gray-400">#3</span>
                  <span className="text-sm font-bold truncate w-20 text-center">{leaderboardData[2].name}</span>
                </div>
              </div>
            </div>

            {/* Other Ranks List */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              {leaderboardData.slice(3).map((player) => (
                <div key={player.rank} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-center font-black text-gray-400 text-xs">#{player.rank}</span>
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-gray-600">{player.avatar}</div>
                    <div>
                      <p className="text-sm font-black text-gray-800">{player.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Level {player.level}</p>
                    </div>
                  </div>
                  <span className="text-blue-600 font-black text-sm">{player.score} XP</span>
                </div>
              ))}
            </div>
          </div>
        );

      case View.SETTINGS:
        return (
          <div className="p-4 flex flex-col gap-6 animate-slide-in pb-20">
            <header className="flex items-center justify-between mt-2">
               <button onClick={() => setCurrentView(View.HOME)} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"><ChevronLeft size={24} /></button>
               <h2 className="text-xl font-black text-gray-900">Settings</h2>
               <div className="w-10"></div>
            </header>

            <div className="space-y-6">
              {/* Account Section */}
              <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Account</h3>
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                  <button onClick={() => setCurrentView(View.PROFILE)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><User size={20} /></div>
                      <span className="font-bold text-gray-700">Edit Profile</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Shield size={20} /></div>
                      <span className="font-bold text-gray-700">Privacy & Security</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><Bell size={20} /></div>
                      <span className="font-bold text-gray-700">Notifications</span>
                    </div>
                    <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                    </div>
                  </button>
                </div>
              </section>

              {/* Preferences Section */}
              <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">App Preferences</h3>
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                  <button onClick={toggleLanguage} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Languages size={20} /></div>
                      <span className="font-bold text-gray-700">App Language</span>
                    </div>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                      {language === Language.EN ? 'English' : 'हिंदी'}
                    </span>
                  </button>
                  <button onClick={handleOpenKeySelection} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-gray-50 text-gray-600 rounded-xl"><Sparkles size={20} /></div>
                      <span className="font-bold text-gray-700">AI Configuration</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                </div>
              </section>

              {/* Support & Legal Section */}
              <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Support & Legal</h3>
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                  <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><HelpCircle size={20} /></div>
                      <span className="font-bold text-gray-700">Help Center</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                  <button onClick={() => setCurrentView(View.PRIVACY)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-red-50 text-red-600 rounded-xl"><ShieldAlert size={20} /></div>
                      <span className="font-bold text-gray-700">Privacy Policy</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                </div>
              </section>

              <button 
                onClick={handleLogout}
                className="w-full p-5 bg-red-50 text-red-600 font-black rounded-3xl active:scale-95 transition-all text-sm uppercase tracking-widest shadow-sm border border-red-100 mt-4"
              >
                Logout Account
              </button>

              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-4">
                Master Sahab AI • Version 2.1.0 (Play Store Ready)
              </p>
            </div>
          </div>
        );

      case View.SOLVE:
        return (
          <div className="p-4 flex flex-col gap-6 animate-slide-in pb-20">
            <header className="flex items-center justify-between mt-2">
               <button onClick={() => setCurrentView(View.HOME)} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"><ChevronLeft size={24} /></button>
               <h2 className="text-xl font-black text-gray-900">AI Solver</h2>
               <div className="p-2 w-10"></div>
            </header>
            
            <form onSubmit={handleSolve} className="relative">
              <textarea 
                value={solvePrompt}
                onChange={(e) => setSolvePrompt(e.target.value)}
                placeholder={t.solvePrompt}
                className="w-full h-56 p-6 rounded-[2rem] border-2 border-blue-50 focus:border-blue-500 outline-none resize-none shadow-sm text-lg font-medium placeholder:text-gray-300 bg-white"
              />
              <button 
                type="submit"
                disabled={isSolverLoading}
                className="absolute bottom-6 right-6 bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-90 transition-all disabled:opacity-50"
              >
                {isSolverLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : <Send size={24} />}
              </button>
            </form>

            {isSolverLoading && (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                   <div className="animate-bounce"><Sparkles className="text-blue-500" size={32} /></div>
                </div>
                <p className="text-gray-400 font-black text-xs uppercase tracking-widest">{t.processing}</p>
              </div>
            )}

            {solveResult && !isSolverLoading && (
              <div className={`p-8 rounded-[2rem] shadow-sm border animate-slide-in ${solveError ? 'bg-red-50 border-red-100' : 'bg-white border-blue-50'}`}>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-6 pb-2 border-b flex items-center gap-2 ${solveError ? 'text-red-700 border-red-200' : 'text-blue-600 border-blue-50'}`}>
                  {solveError ? <AlertTriangle size={16} /> : <BookOpen size={16} />}
                  {solveError ? 'Error Occurred' : t.stepByStep}
                </h3>
                <div className={`prose max-w-none whitespace-pre-wrap text-base leading-relaxed font-medium ${solveError ? 'text-red-600' : 'text-gray-700'}`}>
                  {solveResult}
                </div>
                {solveError && (
                  <button 
                    onClick={handleSolve}
                    className="mt-6 flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl text-sm font-black uppercase shadow-lg shadow-red-200"
                  >
                    <History size={18} /> {t.retry}
                  </button>
                )}
              </div>
            )}
          </div>
        );

      case View.PROFILE:
        return (
          <div className="p-4 flex flex-col gap-6 animate-slide-in pb-28">
            <header className="flex items-center justify-between mt-2">
               <button onClick={() => setCurrentView(View.HOME)} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"><ChevronLeft size={24} /></button>
               <h2 className="text-xl font-black text-gray-900">My Profile</h2>
               <button onClick={() => setCurrentView(View.SETTINGS)} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"><Settings size={20} /></button>
            </header>

            {/* Profile Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm text-center relative overflow-hidden border border-blue-50">
              <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl shadow-blue-100 ring-8 ring-blue-50">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Class {user.class}th • Joined {user.joinedDate}</p>
              
              <div className="grid grid-cols-3 gap-2 mt-8">
                 <div className="bg-blue-50 p-4 rounded-2xl">
                   <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter mb-1">Score</p>
                   <p className="text-xl font-black text-blue-700">{user.score}</p>
                 </div>
                 <div className="bg-amber-50 p-4 rounded-2xl">
                   <p className="text-[10px] text-amber-400 font-black uppercase tracking-tighter mb-1">Level</p>
                   <p className="text-xl font-black text-amber-700">{user.level}</p>
                 </div>
                 <div className="bg-indigo-50 p-4 rounded-2xl">
                   <p className="text-[10px] text-indigo-400 font-black uppercase tracking-tighter mb-1">Quizzes</p>
                   <p className="text-xl font-black text-indigo-700">{user.quizzesTaken}</p>
                 </div>
              </div>
            </div>

            {/* Daily Progress Chart */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-gray-800 flex items-center gap-2 text-sm uppercase tracking-widest">
                  <Calendar size={18} className="text-blue-500" /> Activity History
                </h3>
              </div>
              <div className="flex items-end justify-between h-36 gap-2 px-2">
                {dailyProgress.map((p, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 gap-3">
                    <div 
                      className="w-full bg-blue-50 rounded-xl relative group overflow-hidden shadow-inner" 
                      style={{ height: `${p.value}%` }}
                    >
                      <div className="absolute inset-0 bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase">{p.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-gray-800 flex items-center gap-2 text-sm uppercase tracking-widest">
                  <Award size={18} className="text-amber-500" /> Quiz Record
                </h3>
              </div>
              <div className="space-y-4">
                {quizHistory.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-white">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">{h.subject}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{h.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-blue-600 leading-none mb-1">{h.score}</p>
                      <span className="text-[9px] font-black text-green-600 bg-green-100 px-2 py-0.5 rounded uppercase">{h.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case View.CALCULATOR:
        return <CalculatorView onBack={() => setCurrentView(View.HOME)} />;

      case View.CAMERA:
        return <CameraView language={language} onBack={() => setCurrentView(View.HOME)} />;

      case View.PRIVACY:
        return <PrivacyView onBack={() => setCurrentView(View.SETTINGS)} />;

      default:
        return <div>View not found</div>;
    }
  };

  const isUtilityView = [View.CALCULATOR, View.CAMERA].includes(currentView);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#FDFDFD] relative overflow-hidden selection:bg-blue-100">
      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={setCurrentView}
        onLogout={handleLogout}
      />

      <main className={`flex-1 ${!isUtilityView ? 'bottom-nav-safe' : ''} overflow-y-auto`}>
        {renderContent()}
      </main>

      {!isUtilityView && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-xl border-t border-gray-50 flex justify-around items-center py-4 px-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`flex flex-col items-center gap-1 transition-all relative ${
                currentView === item.id 
                ? 'text-blue-600' 
                : 'text-gray-300 hover:text-gray-500'
              }`}
            >
              <div className={`transition-all duration-300 ${currentView === item.id ? 'transform -translate-y-1' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${currentView === item.id ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
              {currentView === item.id && (
                <div className="absolute -top-1 w-1.5 h-1.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default App;
