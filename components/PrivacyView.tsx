
import React from 'react';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Server, 
  Cpu, 
  UserPlus, 
  Trash2, 
  Baby, 
  FileText,
  Mail
} from 'lucide-react';

export const PrivacyView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col animate-slide-in pb-20">
      <header className="p-4 bg-white border-b sticky top-0 z-10 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-gray-900">Privacy Policy</h1>
      </header>

      <div className="p-6 space-y-8 overflow-y-auto">
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
          <ShieldCheck className="text-blue-600 mb-4" size={40} />
          <h2 className="text-2xl font-black text-blue-900 mb-2">Master Sahab Safety</h2>
          <p className="text-blue-700 text-sm font-medium leading-relaxed">
            At Master Sahab AI, we believe in "Privacy by Design." Your data is your property, and we only use it to power your learning journey.
          </p>
        </div>

        {/* 1. Introduction */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-xl text-gray-600"><FileText size={20} /></div>
            <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">1. Introduction</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            This Privacy Policy explains how Master Sahab AI collects, uses, and protects your information when you use our mobile application. By using the app, you agree to the practices described in this policy.
          </p>
        </section>

        {/* 2. Personal Information */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><UserPlus size={20} /></div>
            <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">2. Information We Collect</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 text-sm leading-relaxed font-bold">A. Information You Provide:</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              When you register, we collect your Name, Email Address, and Academic Grade. This helps us customize the AI difficulty and quiz content for your specific class level.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed font-bold mt-2">B. Usage Data:</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              We track quiz scores, XP earned, and app interaction logs to provide you with progress reports and leaderboard rankings.
            </p>
          </div>
        </section>

        {/* 3. Camera & Microphone */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><Eye size={20} /></div>
            <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">3. Device Permissions</h3>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
              <p className="text-gray-700 text-sm font-bold mb-1">Camera Permission:</p>
              <p className="text-gray-600 text-xs leading-relaxed">
                Required for the 'Camera Solver' feature. Photos are used only to extract text/equations. Images are processed in real-time and NOT saved to your gallery or our persistent servers.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-700 text-sm font-bold mb-1">Local Storage:</p>
              <p className="text-gray-600 text-xs leading-relaxed">
                Used to save your session and study progress so you don't lose your data when you close the app.
              </p>
            </div>
          </div>
        </section>

        {/* 4. AI Processing (Third Parties) */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600"><Cpu size={20} /></div>
            <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">4. AI & Third-Party Services</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            We use <strong>Google Gemini API</strong> for processing educational queries and image analysis. While data is sent to Google for processing, it is done under high security. No data is shared with advertisers or third-party marketers.
          </p>
        </section>

        {/* 5. Children's Privacy */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><Baby size={20} /></div>
            <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">5. Children's Privacy (COPPA)</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Master Sahab is designed for students in grades 6-12. We encourage parents to monitor their children's use of AI tools. We do not knowingly collect behavioral data for marketing from children under 13. All data collected is strictly for educational performance tracking.
          </p>
        </section>

        {/* 6. Data Deletion */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-xl text-red-600"><Trash2 size={20} /></div>
            <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">6. Your Rights & Data Deletion</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            You have the right to access, update, or delete your personal information at any time. You can clear your local data by logging out or clicking "Reset Profile" in settings. For permanent account deletion from our records, please contact us.
          </p>
        </section>

        {/* 7. Contact */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Mail size={20} /></div>
            <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">7. Contact Support</h3>
          </div>
          <div className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
            <p className="text-gray-600 text-sm mb-3">For any privacy-related queries, email our Data Protection Officer:</p>
            <a href="mailto:privacy@mastersahab.ai" className="text-blue-600 font-black text-base underline decoration-2 underline-offset-4">
              privacy@mastersahab.ai
            </a>
          </div>
        </section>

        <div className="pt-10 pb-6 text-center border-t border-gray-50">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
            © 2024 Master Sahab AI Study Suite
          </p>
          <p className="text-[10px] text-gray-300 font-bold">
            Version 2.1.0 • Built for Indian Students
          </p>
        </div>
      </div>
    </div>
  );
};
