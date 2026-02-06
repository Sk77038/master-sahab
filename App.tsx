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
  Camera, Loader2, Trophy, Search, ArrowRight, X
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
            <div className="absolute top-0 right-0 p-4 opacity-10"><Brain size={100} /></div>
            <div className="flex items-center gap-2 mb-3 text-blue-400">
               <Sparkles size={16} /> <span className="text-xs font-black uppercase">AI Answer</span>
            </div>
            <p className="font-medium leading-relaxed opacity-90">{quickResponse}</p>
            <button onClick={() => setQuickResponse("")} className="absolute top-4 right-4 text-gray-600"><X size={20}/></button>
          </div>
        )}

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4">
           {/* Camera Card */}
           <button onClick={() => setCurrentView(View.CAMERA)} className="col-span-2 h-48 bg-[#E3F2FD] rounded-[2.5rem] p-8 relative overflow-hidden group text-left active:scale-[0.98] transition-all">
              <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-blue-200 rounded-full blur-2xl"></div>
              <Camera size={40} className="text-blue-600 mb-12 relative z-10" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-blue-900">Scan & Solve</h3>
                <p className="text-blue-700 font-medium">Take a photo of any question</p>
              </div>
           </button>

           {/* Quiz Card */}
           <button onClick={() => setCurrentView(View.QUIZ)} className="bg-orange-50 rounded-[2.5rem] p-6 flex flex-col justify-between h-44 text-left border border-orange-100 active:scale-95 transition-all">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Trophy size={20} /></div>
              <div>
                <h3 className="text-lg font-black text-gray-800">Quiz</h3>
                <p className="text-xs text-gray-500 font-bold">Play & Earn XP</p>
              </div>
           </button>

           {/* AI Chat Card */}
           <button onClick={() => setCurrentView(View.SOLVE)} className="bg-violet-50 rounded-[2.5rem] p-6 flex flex-col justify-between h-44 text-left border border-violet-100 active:scale-95 transition-all">
              <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center"><Brain size={20} /></div>
              <div>
                <h3 className="text-lg font-black text-gray-800">AI Tutor</h3>
                <p className="text-xs text-gray-500 font-bold">Detailed Help</p>
              </div>
           </button>
        </div>
      </div>
    );

    // Other views mapped here...
    if (currentView === View.SOLVE) return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-6 bg-white rounded-b-[2.5rem] shadow-sm z-10">
           <div className="flex items-center gap-4 mb-4">
             <button onClick={() => setCurrentView(View.HOME)}><ChevronLeft /></button>
             <h2 className="font-black text-xl">AI Problem Solver</h2>
           </div>
           <textarea 
             value={solvePrompt}
             onChange={(e) => setSolvePrompt(e.target.value)}
             className="w-full h-32 bg-gray-50 rounded-2xl p-4 outline-none resize-none font-medium"
             placeholder="Type your question here..."
           />
           <button onClick={handleSolve} disabled={isSolverLoading} className="w-full mt-4 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
             {isSolverLoading ? <Loader2 className="animate-spin" /> : <>Solve <Send size={18} /></>}
           </button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
           {solveResult && <div className="prose bg-white p-6 rounded-3xl shadow-sm">{solveResult}</div>}
        </div>
      </div>
    );
    
    if (currentView === View.QUIZ) return <QuizView language={language} onComplete={() => {}} onExit={() => setCurrentView(View.HOME)} />;
    if (currentView === View.CAMERA) return <CameraView language={language} onBack={() => setCurrentView(View.HOME)} />;
    if (currentView === View.CALCULATOR) return <CalculatorView onBack={() => setCurrentView(View.HOME)} />;
    if (currentView === View.PROFILE) return <div className="p-6"><h1 className="text-2xl font-black mb-4">Profile</h1><button onClick={handleLogout} className="text-red-500 font-bold">Logout</button></div>;
    if (currentView === View.SETTINGS) return <div className="p-6"><h1 className="text-2xl font-black">Settings</h1></div>;
    if (currentView === View.PRIVACY) return <PrivacyView onBack={() => setCurrentView(View.HOME)} />;
    
    return null;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative overflow-hidden font-sans text-gray-900">
      <Sidebar user={user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={setCurrentView} onLogout={handleLogout} />
      <main className="flex-1 h-full overflow-y-auto scrollbar-hide pt-safe">{renderContent()}</main>
      
      {/* Floating Bottom Nav */}
      {currentView === View.HOME && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-4 rounded-full shadow-2xl flex gap-8 items-center z-40">
           {NAV_ITEMS.map((item) => (
             <button key={item.id} onClick={() => setCurrentView(item.id as View)} className={`transition-all ${currentView === item.id ? 'text-blue-400 scale-125' : 'text-gray-500'}`}>
               {item.icon}
             </button>
           ))}
        </div>
      )}
    </div>
  );
};

export default App;  
