import React, { useState } from 'react';
import { ArrowRight, User, Mail, School, Sparkles, BookOpen } from 'lucide-react';
import { UserProfile } from '../types';
import { CLASSES } from '../constants';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', class: '10' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      ...formData,
      score: 0,
      xp: 0,
      level: 1,
      quizzesTaken: 0,
      joinedDate: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    };
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col justify-end">
      {/* Abstract Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

      <div className="relative z-10 p-8 pb-12 animate-slide-in">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
          <Sparkles className="text-white" size={32} />
        </div>
        
        <h1 className="text-4xl font-black tracking-tight mb-2">Master Sahab <span className="text-blue-500">AI</span></h1>
        <p className="text-gray-400 font-medium text-lg mb-8">Your intelligent study companion.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
            <div className="flex items-center gap-4 border-b border-white/10 pb-2">
              <User className="text-gray-400" size={20} />
              <input 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="What's your name?"
                className="bg-transparent w-full outline-none text-white placeholder:text-gray-500 font-medium h-10"
              />
            </div>
            
            <div className="flex items-center gap-4 border-b border-white/10 pb-2">
              <Mail className="text-gray-400" size={20} />
              <input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Student Email ID"
                className="bg-transparent w-full outline-none text-white placeholder:text-gray-500 font-medium h-10"
              />
            </div>

            <div className="flex items-center gap-4">
              <School className="text-gray-400" size={20} />
              <select 
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
                className="bg-transparent w-full outline-none text-white font-medium h-10 [&>option]:bg-gray-900"
              >
                {CLASSES.map(c => <option key={c} value={c}>Class {c}th</option>)}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold text-lg flex items-center justify-between group active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            <span>Start Learning</span>
            <div className="bg-white/20 p-2 rounded-xl group-hover:translate-x-1 transition-transform">
              <ArrowRight size={20} />
            </div>
          </button>
        </form>
        
        <p className="text-center text-xs text-gray-500 mt-6 font-medium">
          By joining, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};
