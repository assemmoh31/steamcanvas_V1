
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  BarChart3, 
  Target, 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  Cookie, 
  Info,
  ShieldAlert,
  Save,
  Ban,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CookieCategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefit: string;
  isAlwaysActive?: boolean;
  enabled: boolean;
  onToggle: () => void;
}

const CookieCategory: React.FC<CookieCategoryProps> = ({ 
  icon, title, description, benefit, isAlwaysActive, enabled, onToggle 
}) => (
  <div className={`p-8 rounded-[32px] border transition-all duration-300 ${enabled || isAlwaysActive ? 'bg-[#12141a] border-steam-blue/20' : 'bg-white/[0.02] border-white/5 opacity-60'}`}>
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex gap-4">
        <div className={`p-3 rounded-2xl h-fit ${enabled || isAlwaysActive ? 'bg-steam-blue/10 text-steam-blue' : 'bg-white/5 text-gray-500'}`}>
          {icon}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>
            {isAlwaysActive && (
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-400 text-[8px] font-black uppercase tracking-widest border border-white/10">Always Active</span>
            )}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
            {description}
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black text-steam-blue uppercase tracking-widest bg-steam-blue/5 px-3 py-1 rounded-full border border-steam-blue/10 w-fit">
            <Check size={12} /> Gamer Benefit: "{benefit}"
          </div>
        </div>
      </div>

      {!isAlwaysActive && (
        <button 
          onClick={onToggle}
          className={`relative w-14 h-8 rounded-full transition-all flex items-center px-1 ${enabled ? 'bg-steam-blue' : 'bg-white/10'}`}
        >
          <motion.div 
            animate={{ x: enabled ? 24 : 0 }}
            className="w-6 h-6 bg-white rounded-full shadow-lg"
          />
        </button>
      )}
    </div>
  </div>
);

const CookieSettings: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => {
  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setPage('home');
    }, 1500);
  };

  const handleAcceptAll = () => {
    setFunctional(true);
    setAnalytics(true);
    setMarketing(true);
    handleSave();
  };

  const handleRejectAll = () => {
    setFunctional(false);
    setAnalytics(false);
    setMarketing(false);
    handleSave();
  };

  return (
    <div className="min-h-screen bg-[#060709] pt-28 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
          <button 
            onClick={() => setPage('home')}
            className="group flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-all mb-4"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <div className="p-4 rounded-3xl bg-steam-blue/10 text-steam-blue border border-steam-blue/20 mb-2">
            <Cookie size={40} />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight italic">
            Cookie <span className="text-steam-blue">Preferences</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            We use cookies to make SteamCanvas work smoothly. Some are essential for things like logging into your Steam account and keeping your Coins safe, while others help us understand which tools you use most so we can improve them. You can customize your choices below.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-6 mb-20">
          <CookieCategory 
            icon={<ShieldCheck size={20} />}
            title="Strictly Necessary"
            description="These cookies are essential for the website to function and cannot be switched off. They are used for Steam OpenID authentication, security (CSRF protection), and managing your Coin wallet during transactions."
            benefit="Keeps you logged in and ensures your coin purchases are secure."
            isAlwaysActive
            enabled={true}
            onToggle={() => {}}
          />

          <CookieCategory 
            icon={<Settings size={20} />}
            title="Functional & Preferences"
            description="These allow the site to remember the choices you make, such as your language (English/Spanish) and your 'Edit Mode' layout settings."
            benefit="Remembers your custom profile layout and site theme."
            enabled={functional}
            onToggle={() => setFunctional(!functional)}
          />

          <CookieCategory 
            icon={<BarChart3 size={20} />}
            title="Analytics & Performance"
            description="We use these to collect anonymized data about how people move around the site. This tells us which tools are popular and if any pages are loading slowly."
            benefit="Helps us see which design tools are your favorites so we can build more."
            enabled={analytics}
            onToggle={() => setAnalytics(!analytics)}
          />

          <CookieCategory 
            icon={<Target size={20} />}
            title="Marketing & Partners"
            description="These are used to track the effectiveness of our partnerships with Steam Level-Up services and community creators."
            benefit="Helps us partner with your favorite creators to bring you better deals."
            enabled={marketing}
            onToggle={() => setMarketing(!marketing)}
          />
        </div>

        {/* Inventory Table */}
        <section className="mb-20 space-y-6">
          <div className="flex items-center gap-3">
            <Info size={18} className="text-steam-blue" />
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Detailed Inventory</h2>
          </div>
          
          <div className="overflow-hidden rounded-[32px] border border-white/5 bg-[#12141a]">
            <table className="w-full text-left">
              <thead className="bg-black/20 text-gray-500 text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                <tr>
                  <th className="px-8 py-5">Name</th>
                  <th className="px-8 py-5">Provider</th>
                  <th className="px-8 py-5">Purpose</th>
                  <th className="px-8 py-5">Expiration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                <tr className="group hover:bg-white/[0.01]">
                  <td className="px-8 py-5 text-white font-mono">sc_session</td>
                  <td className="px-8 py-5 text-gray-400">SteamCanvas</td>
                  <td className="px-8 py-5 text-gray-400">Keeps you logged in via Steam</td>
                  <td className="px-8 py-5 text-gray-400">Session</td>
                </tr>
                <tr className="group hover:bg-white/[0.01]">
                  <td className="px-8 py-5 text-white font-mono">sc_consent</td>
                  <td className="px-8 py-5 text-gray-400">SteamCanvas</td>
                  <td className="px-8 py-5 text-gray-400">Stores your cookie preferences</td>
                  <td className="px-8 py-5 text-gray-400">6 Months</td>
                </tr>
                <tr className="group hover:bg-white/[0.01]">
                  <td className="px-8 py-5 text-white font-mono">sc_accent</td>
                  <td className="px-8 py-5 text-gray-400">SteamCanvas</td>
                  <td className="px-8 py-5 text-gray-400">Remembers your blue/teal UI color</td>
                  <td className="px-8 py-5 text-gray-400">1 Year</td>
                </tr>
                <tr className="group hover:bg-white/[0.01]">
                  <td className="px-8 py-5 text-white font-mono">_ga</td>
                  <td className="px-8 py-5 text-gray-400">Google</td>
                  <td className="px-8 py-5 text-gray-400">Anonymized usage tracking</td>
                  <td className="px-8 py-5 text-gray-400">1 Year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Buttons - Button Parity Rule */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={handleRejectAll}
            className="flex-1 max-w-[200px] px-8 py-4 bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Ban size={14} /> Reject All
          </button>
          
          <button 
            onClick={handleSave}
            className="flex-1 max-w-[200px] px-8 py-4 bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Save size={14} /> Save My Choices
          </button>

          <button 
            onClick={handleAcceptAll}
            className="flex-1 max-w-[200px] px-8 py-4 bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={14} /> Accept All
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-20 pt-12 border-t border-white/5 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-[10px] font-medium">
            <ShieldAlert size={14} className="text-steam-blue" />
            <span>You can change your mind at any time by clicking the small "Cookie Shield" icon in the bottom corner of the site.</span>
          </div>
          <p className="text-gray-500 text-[10px] font-medium">
            For more details on how we handle your data, please see our <button onClick={() => setPage('privacy')} className="text-steam-blue hover:underline">Privacy Policy</button>.
          </p>
        </div>

      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-green-500 text-black font-black text-xs uppercase tracking-widest rounded-full shadow-2xl flex items-center gap-3 z-[200]"
          >
            <CheckCircle2 size={18} /> Preferences Updated
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CookieSettings;
