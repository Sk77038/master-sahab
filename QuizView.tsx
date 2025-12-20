
import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, SUBJECTS } from '../constants';
import { Language, Question } from '../types';
import { CheckCircle, XCircle, Clock, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizProps {
  language: Language;
  onComplete: (score: number) => void;
  onExit: () => void;
}

// Mock questions for demonstration - updated to match Question interface in types.ts
const MOCK_QUESTIONS: Question[] = [
  { 
    id: '1', 
    text_en: "What is the powerhouse of the cell?", 
    text_hi: "कोशिका का पावरहाउस क्या है?",
    options_en: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"], 
    options_hi: ["नाभिक", "माइटोकॉन्ड्रिया", "राइबोसोम", "गोल्गी बॉडी"],
    correctAnswer: 1, 
    explanation_en: "Mitochondria generate most of the cell's supply of ATP, used as a source of chemical energy.", 
    explanation_hi: "माइटोकॉन्ड्रिया एटीपी की अधिकांश आपूर्ति उत्पन्न करते हैं, जिसका उपयोग रासायनिक ऊर्जा के स्रोत के रूप में किया जाता है।",
    difficulty: 'easy', 
    type: 'mcq' 
  },
  { 
    id: '2', 
    text_en: "Newton's First Law of Motion is also known as...", 
    text_hi: "न्यूटन के गति के प्रथम नियम को किस नाम से भी जाना जाता है?",
    options_en: ["Law of Inertia", "Law of Acceleration", "Law of Action-Reaction", "Law of Gravity"], 
    options_hi: ["जड़त्व का नियम", "त्वरण का नियम", "क्रिया-प्रतिक्रिया का नियम", "गुरुत्वाकर्षण का नियम"],
    correctAnswer: 0, 
    explanation_en: "The law of inertia states that an object at rest stays at rest unless acted upon.", 
    explanation_hi: "जड़त्व का नियम कहता है कि विराम अवस्था में कोई वस्तु तब तक विराम अवस्था में ही रहती है जब तक उस पर कोई बाहरी बल न लगाया जाए।",
    difficulty: 'medium', 
    type: 'mcq' 
  },
  { 
    id: '3', 
    text_en: "What is the capital of France?", 
    text_hi: "फ्रांस की राजधानी क्या है?",
    options_en: ["Berlin", "Madrid", "Paris", "Rome"], 
    options_hi: ["बर्लिन", "मैड्रिड", "पेरिस", "रोम"],
    correctAnswer: 2, 
    explanation_en: "Paris is the capital and largest city of France.", 
    explanation_hi: "पेरिस फ्रांस की राजधानी और सबसे बड़ा शहर है।",
    difficulty: 'easy', 
    type: 'mcq' 
  },
];

export const QuizView: React.FC<QuizProps> = ({ language, onComplete, onExit }) => {
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState<'selection' | 'active' | 'result'>('selection');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: any;
    if (step === 'active' && !isAnswered && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && !isAnswered) {
      handleAnswer(-1); // Timeout
    }
    return () => clearInterval(interval);
  }, [step, isAnswered, timer]);

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setIsAnswered(true);
    if (idx === MOCK_QUESTIONS[currentIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < MOCK_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimer(30);
    } else {
      setStep('result');
      onComplete(score);
    }
  };

  if (step === 'selection') {
    return (
      <div className="p-6 flex flex-col gap-6 animate-slide-in">
        <h2 className="text-2xl font-bold text-gray-800">{t.startQuiz}</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-600 mb-2 block">{t.selectClass}</span>
            <select className="w-full p-4 rounded-xl border-2 border-blue-100 bg-white">
              {[6,7,8,9,10,11,12].map(c => <option key={c}>Class {c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-gray-600 mb-2 block">{t.selectSubject}</span>
            <select className="w-full p-4 rounded-xl border-2 border-blue-100 bg-white">
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <button 
          onClick={() => setStep('active')}
          className="bg-blue-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all"
        >
          {t.startQuiz}
        </button>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="p-6 flex flex-col items-center gap-6 animate-slide-in text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold">{t.results}</h2>
        <div className="text-6xl font-black text-blue-600">{score} / {MOCK_QUESTIONS.length}</div>
        <p className="text-gray-500">Great job! Keep practicing to improve your score.</p>
        <div className="grid grid-cols-2 gap-4 w-full mt-4">
          <button onClick={() => setStep('selection')} className="flex items-center justify-center gap-2 p-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold">
            <RotateCcw size={20} /> Retake
          </button>
          <button onClick={onExit} className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-xl font-bold">
            Home <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  const q = MOCK_QUESTIONS[currentIdx];

  return (
    <div className="p-6 flex flex-col gap-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold text-sm">
          Question {currentIdx + 1} of {MOCK_QUESTIONS.length}
        </span>
        <div className={`flex items-center gap-2 font-mono font-bold ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
          <Clock size={20} /> {timer}s
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-xl font-semibold text-gray-800">
          {language === Language.EN ? q.text_en : q.text_hi}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {(language === Language.EN ? q.options_en : q.options_hi).map((opt, i) => {
          let styles = "bg-white border-2 border-gray-100 text-left";
          if (isAnswered) {
            if (i === q.correctAnswer) styles = "bg-green-100 border-green-500 text-green-700";
            else if (i === selectedAnswer) styles = "bg-red-100 border-red-500 text-red-700";
            else styles = "bg-gray-50 opacity-50";
          }
          
          return (
            <button
              key={i}
              disabled={isAnswered}
              onClick={() => handleAnswer(i)}
              className={`p-4 rounded-xl font-medium transition-all ${styles}`}
            >
              <div className="flex justify-between items-center">
                {opt}
                {isAnswered && i === q.correctAnswer && <CheckCircle size={20} />}
                {isAnswered && i === selectedAnswer && i !== q.correctAnswer && <XCircle size={20} />}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 animate-slide-in">
          <p className="font-bold text-blue-800 mb-1">{t.explanation}:</p>
          <p className="text-blue-700 text-sm">
            {language === Language.EN ? q.explanation_en : q.explanation_hi}
          </p>
          <button 
            onClick={nextQuestion}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold"
          >
            {t.next}
          </button>
        </div>
      )}
    </div>
  );
};
