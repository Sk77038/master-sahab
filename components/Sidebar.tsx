
import React from 'react';
import { 
  Trophy, 
  Settings, 
  HelpCircle, 
  LogOut, 
  X, 
  Brain, 
  ChevronRight,
  ShieldCheck,
  Star,
  Home
} from 'lucide-react';
import { UserProfile, View } from '../types';

interface SidebarProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

interface MenuItem {
  id: View;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose, onNavigate, onLogout }) => {
  if (!isOpen) return null;

  // Ensuring all IDs are strictly from the View enum to prevent build-time TS errors
  const menuItems: MenuItem[] = [
    { id: View.HOME, label: 'Home Dashboard', icon: <Home className="text-blue-500" size={20} /> },
    { id: View.LEADERBOARD, label: 'Leaderboard', icon: <Trophy className="text-amber-500" size={20} />, badge: 'Global' },
    { id: View.PROFILE, label: 'My Profile', icon: <Brain className="text-indigo-500" size={20} /> },
    { id: View.SETTINGS, label: 'Settings', icon: <Settings className="text-gray-500" size={20} /> },
    { id: View.PRIVACY, label: 'Privacy Policy', icon: <HelpCircle className="text-teal-500" size={20} /> },
  ];

  const handleItemClick = (id: View) => {
    onNavigate(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-slide-in">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="p-6 bg-blue-600 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-lg">
              <Brain size={24} />
            </div>
            <span className="font-black text-xl tracking-tight">Master Sahab</span>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="w-14 h-14 bg-blue-500 border-2 border-blue-400 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="bg-blue-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Level {user.level}</span>
                <span className="text-blue-200 text-[10px] font-bold uppercase">{user.xp} XP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item.id)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                      {item.icon}
                    </div>
                    <span className="font-bold text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.badge && (
                      <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 border-t border-gray-100 pt-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-3xl border border-amber-100 relative overflow-hidden">
               <Star className="absolute -right-2 -top-2 w-12 h-12 text-amber-200 opacity-30" />
               <div className="relative z-10">
                 <h4 className="font-black text-amber-800 text-sm mb-1">PRO Membership</h4>
                 <p className="text-[10px] text-amber-700 font-medium mb-3">Get unlimited scans & expert answers.</p>
                 <button className="bg-amber-500 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-lg shadow-amber-200">UPGRADE NOW</button>
               </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-bold active:scale-95 transition-all"
          >
            <LogOut size={20} /> Logout Account
          </button>
          <div className="flex items-center justify-center gap-1 mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <ShieldCheck size={12} /> Secure Session
          </div>
        </div>
      </div>
    </div>
  );
};
