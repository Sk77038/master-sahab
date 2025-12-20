
import React, { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS, SUBJECTS, CLASSES } from '../constants';
import { Language, Question } from '../types';
import { CheckCircle, XCircle, Clock, ArrowRight, RotateCcw, Brain, Sparkles, Volume2 } from 'lucide-react';
import { generateAIQuiz } from './services/geminiService';

interface QuizProps {
  language: Language;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const CORRECT_SOUND = "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3";
const WRONG_SOUND = "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3";
const CLICK_SOUND = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3";

export const QuizView: React.FC<QuizProps> = ({ language, onComplete, onExit }) => {
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState<'selection' | 'loading' | 'active' | 'result'>('selection');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10); 
  const [selectedClass, setSelectedClass] = useState(CLASSES[4]); // default 10th
  const [selectedSub, setSelectedSub] = useState(SUBJECTS[0]);
  const [error, setError] = useState<string | null>(null);

  const correctAudio = useRef(new Audio(CORRECT_SOUND));
  const wrongAudio = useRef(new Audio(WRONG_SOUND));
  const clickAudio = useRef(new Audio(CLICK_SOUND));

  useEffect(() => {
    let interval: any;
    if (step === 'active' && !isAnswered && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && !isAnswered) {
      handleAnswer(-1); // Timeout
    }
    return () => clearInterval(interval);
  }, [step, isAnswered, timer]);

  const playSound = (type: 'correct' | 'wrong' | 'click') => {
    const sound = type === 'correct' ? correctAudio.current : type === 'wrong' ? wrongAudio.current : clickAudio.current;
    sound.currentTime = 0;
    sound.play().catch(() => {}); 
  };

  const startAIQuiz = async () => {
    setStep('loading');
    setError(null);
    try {
      const q = await generateAIQuiz(selectedClass, selectedSub);
      if (q && q.length > 0) {
        setQuestions(q);
        setStep('active');
        setCurrentIdx(0);
        setScore(0);
        setTimer(10);
      } else {
        throw new Error("Empty questions received");
      }
    } catch (e) {
      console.error("Quiz generation error:", e);
      setError("Master Sahab encountered an error while preparing your quiz. Please try again.");
      setStep('selection');
    }
  };

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setIsAnswered(true);
    if (questions[currentIdx] && idx === questions[currentIdx].correctAnswer) {
      setScore(prev => prev + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const nextQuestion = () => {
    playSound('click');
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimer(10);
    } else {
      setStep('result');
      onComplete(score);
    }
  };

  if (step === 'selection') {
    return (
      <div className="p-6 flex flex-col gap-6 animate-slide-in">
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Brain /></div>
           <h2 className="text-2xl font-bold text-gray-800">{t.startQuiz}</h2>
        </div>
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
            <XCircle size={18} /> {error}
          </div>
        )}
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-600 mb-2 font-semibold block">{t.selectClass}</span>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-blue-100 bg-white focus:border-blue-500 outline-none font-bold"
            >
              {CLASSES.map(c => <option key={c} value={c}>Class {c}th</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-gray-600 mb-2 font-semibold block">{t.selectSubject}</span>
            <select 
              value={selectedSub}
              onChange={(e) => setSelectedSub(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-blue-100 bg-white focus:border-blue-500 outline-none font-bold"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <button 
          onClick={startAIQuiz}
          className="bg-blue-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
        >
          <Sparkles size={22} /> {language === Language.EN ? 'Start 20 Questions Quiz' : '20 प्रश्नों की क्विज़ शुरू करें'}
        </button>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[70vh] text-center gap-8 animate-pulse">
        <div className="relative">
          <div className="w-28 h-28 border-8 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
          <Brain className="absolute inset-0 m-auto text-blue-600" size={40} />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Master Sahab is thinking...</h3>
          <p className="text-gray-500 font-medium px-4">Creating 20 unique bilingual questions for {selectedSub} (Class {selectedClass})</p>
        </div>
        <div className="w-full max-w-xs bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full animate-[loading_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="p-6 flex flex-col items-center gap-8 animate-slide-in text-center pt-10">
        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2 shadow-inner border-4 border-white">
          <CheckCircle size={64} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900">{t.results}</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Quiz Completed Successfully</p>
        </div>
        <div className="text-7xl font-black text-blue-600 drop-shadow-sm">{score} <span className="text-2xl text-gray-300">/ {questions.length}</span></div>
        <div className="bg-blue-50 p-6 rounded-[2rem] w-full border border-blue-100">
           <p className="text-blue-800 font-black text-lg mb-1">XP Earned: +{score * 10}</p>
           <p className="text-blue-600 text-sm font-medium">Keep it up! Your global rank is improving.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full mt-4">
          <button onClick={() => setStep('selection')} className="flex items-center justify-center gap-2 p-5 border-2 border-blue-600 text-blue-600 rounded-2xl font-black active:scale-95 transition-all">
            <RotateCcw size={20} /> Retake
          </button>
          <button onClick={onExit} className="flex items-center justify-center gap-2 p-5 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-all">
            Home <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  if (!q) return null;

  return (
    <div className="p-4 flex flex-col gap-5 animate-slide-in pb-20">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl text-lg font-black shadow-lg shadow-blue-100">
             {currentIdx + 1}
           </div>
           <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Question OF {questions.length}</span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-black ${timer < 5 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-gray-50 text-gray-600'}`}>
          <Clock size={18} /> {timer}s
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-blue-50 relative overflow-hidden ring-4 ring-blue-50/30">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Brain size={80} /></div>
        <p className="text-xl font-black text-gray-900 mb-4 leading-tight">{q.text_en}</p>
        <p className="text-base font-bold text-blue-600 border-t border-blue-50 pt-4 leading-relaxed">{q.text_hi}</p>
      </div>

      <div className="flex flex-col gap-3">
        {q.options_en.map((opt, i) => {
          let styles = "bg-white border-2 border-gray-100 text-left shadow-sm";
          if (isAnswered) {
            if (i === q.correctAnswer) styles = "bg-green-100 border-green-500 text-green-700 ring-4 ring-green-50";
            else if (i === selectedAnswer) styles = "bg-red-100 border-red-500 text-red-700 ring-4 ring-red-50";
            else styles = "bg-gray-50 opacity-50 border-gray-100";
          } else {
             styles += " active:scale-[0.98] hover:border-blue-300 transition-transform";
          }
          
          return (
            <button
              key={i}
              disabled={isAnswered}
              onClick={() => handleAnswer(i)}
              className={`p-5 rounded-2xl transition-all duration-200 ${styles}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-black text-sm mb-1">{opt}</p>
                  <p className="text-xs font-bold opacity-60 leading-tight">{q.options_hi[i]}</p>
                </div>
                {isAnswered && i === q.correctAnswer && <CheckCircle className="shrink-0 text-green-600" size={24} />}
                {isAnswered && i === selectedAnswer && i !== q.correctAnswer && <XCircle className="shrink-0 text-red-600" size={24} />}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="p-6 bg-white rounded-[2rem] border-2 border-blue-600 animate-slide-in shadow-2xl mb-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
          <div className="flex items-center gap-2 mb-4">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Volume2 size={18} /></div>
             <p className="font-black text-blue-800 text-xs uppercase tracking-[0.2em]">{t.explanation}</p>
          </div>
          <p className="text-gray-900 text-sm mb-3 font-bold leading-relaxed">{q.explanation_en}</p>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-blue-700 text-xs font-black italic">{q.explanation_hi}</p>
          </div>
          <button 
            onClick={nextQuestion}
            className="w-full mt-6 bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {currentIdx === questions.length - 1 ? 'Finish Quiz' : t.next} <ArrowRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
};
