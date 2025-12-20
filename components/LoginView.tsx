
import React, { useState } from 'react';
import { Brain, User, Mail, School, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { CLASSES } from '../constants';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userClass, setUserClass] = useState('10');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser: UserProfile = {
      name,
      email,
      class: userClass,
      score: 0,
      xp: 0,
      level: 1,
      quizzesTaken: 0,
      joinedDate: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    };
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-8 animate-slide-in">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-200 mb-6 rotate-3">
            <Brain size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Master Sahab AI</h1>
          <p className="text-gray-500 font-medium">Your personal AI tutor & study partner</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Class</label>
            <div className="relative">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select 
                value={userClass}
                onChange={(e) => setUserClass(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium appearance-none"
              >
                {CLASSES.map(c => <option key={c} value={c}>Class {c}th</option>)}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
          >
            Get Started <ArrowRight size={22} />
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-10">
          By continuing, you agree to Master Sahab's <br/>
          <span className="font-bold text-gray-600">Terms of Service</span> & <span className="font-bold text-gray-600">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};
