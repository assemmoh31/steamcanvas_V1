
import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Wrench, 
  Star, 
  HelpCircle, 
  BookOpen, 
  Mail, 
  Activity, 
  Scale, 
  Shield, 
  Cookie, 
  Undo2, 
  Info, 
  MessageSquare, 
  Twitter, 
  Video, 
  Bell, 
  Globe,
  ArrowRight,
  CreditCard,
  Check,
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FooterProps {
  setPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lang, setLang] = useState<'EN' | 'ES'>('EN');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-[#060709] border-t border-white/5 pt-20 pb-12 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-steam-blue/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Column 1: Navigation & Discovery */}
          <div className="space-y-6">
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.25em] flex items-center gap-2">
              <Compass size={14} className="text-steam-blue" /> Discovery Hub
            </h3>
            <ul className="space-y-4">
              <li>
                <button onClick={() => setPage('marketplace')} className="text-gray-400 hover:text-steam-blue text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 text-left">
                  <ShoppingBag size={14} /> Explore Marketplace
                </button>
              </li>
              <li className="space-y-2">
                <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Tag size={10} /> Top Categories
                </span>
                <div className="flex flex-wrap gap-2 ml-4">
                  {['Anime', 'Cyberpunk', 'Minimalist'].map(tag => (
                    <button key={tag} onClick={() => setPage('marketplace')} className="text-[10px] text-gray-500 hover:text-white transition-colors">
                      #{tag}
                    </button>
                  ))}
                </div>
              </li>
              <li>
                <button onClick={() => setPage('tools')} className="text-gray-400 hover:text-steam-blue text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 text-left">
                  <Wrench size={14} /> Creative Tools
                </button>
              </li>
              <li>
                <button onClick={() => setPage('marketplace')} className="text-gray-400 hover:text-steam-blue text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 text-left">
                  <Star size={14} /> Featured Creators
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Support & Resources */}
          <div className="space-y-6">
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.25em] flex items-center gap-2">
              <HelpCircle size={14} className="text-steam-blue" /> Resources
            </h3>
            <ul className="space-y-4">
              <li>
                <button onClick={() => setPage('help-center')} className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 text-left">
                  <HelpCircle size={14} /> Help Center / FAQ
                </button>
              </li>
              <li>
                <button onClick={() => setPage('custom-guide')} className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 text-left">
                  <BookOpen size={14} /> Steam Custom Guide
                </button>
              </li>
              <li>
                <button onClick={() => setPage('contact-support')} className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 text-left">
                  <Mail size={14} /> Contact Support
                </button>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-xl w-fit">
                  <div className="relative flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-40" />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Systems: 100% Online</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Trust */}
          <div className="space-y-6">
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.25em] flex items-center gap-2">
              <Scale size={14} className="text-steam-blue" /> Legal & Trust
            </h3>
            <ul className="space-y-4">
              <li>
                <button onClick={() => setPage('tos')} className="text-gray-500 hover:text-gray-300 text-xs font-medium transition-colors flex items-center gap-2 text-left">
                  <Scale size={14} className="opacity-50" /> Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setPage('privacy')} className="text-gray-500 hover:text-gray-300 text-xs font-medium transition-colors flex items-center gap-2 text-left">
                  <Shield size={14} className="opacity-50" /> Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setPage('cookies')} className="text-gray-500 hover:text-gray-300 text-xs font-medium transition-colors flex items-center gap-2 text-left">
                  <Cookie size={14} className="opacity-50" /> Cookies Settings (EU)
                </button>
              </li>
              <li>
                <button onClick={() => setPage('refund-policy')} className="text-gray-500 hover:text-gray-300 text-xs font-medium transition-colors flex items-center gap-2 text-left">
                  <Undo2 size={14} className="opacity-50" /> Refund Policy
                </button>
              </li>
              <li>
                <a href="#" className="text-steam-blue/60 hover:text-steam-blue text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                  <Info size={14} /> Impressum (Aviso Legal)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Branding */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-white font-black text-[10px] uppercase tracking-[0.25em] flex items-center gap-2">
                <MessageSquare size={14} className="text-steam-blue" /> Join Community
              </h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-[#5865F2] hover:text-white hover:border-[#5865F2] transition-all">
                  <MessageSquare size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-white/20 transition-all">
                  <Video size={20} />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-black text-[10px] uppercase tracking-[0.25em] flex items-center gap-2">
                <Bell size={14} className="text-steam-blue" /> Newsletter
              </h3>
              <form onSubmit={handleSubscribe} className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Get notified..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 text-xs text-white focus:outline-none focus:border-steam-blue transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-steam-blue hover:text-white transition-colors">
                  {isSubscribed ? <Check size={18} /> : <ArrowRight size={18} />}
                </button>
              </form>
            </div>

            <div className="space-y-4 pt-2">
               <div className="flex items-center justify-between border-t border-white/5 pt-6">
                 <button 
                  onClick={() => setLang(lang === 'EN' ? 'ES' : 'EN')}
                  className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                 >
                   <Globe size={14} /> {lang === 'EN' ? '🇺🇸 English' : '🇪🇸 Español'}
                 </button>
                 <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all">
                    <CreditCard size={18} className="text-white" />
                    <span className="text-[10px] font-bold text-white">VISA</span>
                    <span className="text-[10px] font-bold text-white">PAYPAL</span>
                 </div>
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-steam-blue" />
            <span className="text-xs font-bold text-gray-500">© 2026 SteamCanvas. Built with passion in Barcelona.</span>
          </div>
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
            Not affiliated with Valve Corporation or Steam.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
