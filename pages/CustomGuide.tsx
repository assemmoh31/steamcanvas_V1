
import React, { useState } from 'react';
import { 
  Compass, 
  Gamepad2, 
  TrendingUp, 
  Palette, 
  Image as ImageIcon, 
  Layers, 
  Zap, 
  Layout, 
  Trophy, 
  Crown, 
  UserX, 
  Type, 
  Star, 
  CheckCircle2, 
  Rocket,
  ChevronRight,
  ArrowRight,
  Monitor,
  Code,
  Sparkles,
  MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuidePhase {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const CustomGuide: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => {
  const [activePhase, setActivePhase] = useState('p1');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const toggleCheck = (id: string) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(i => i !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const phases: GuidePhase[] = [
    {
      id: 'p1',
      title: 'Phase 1: The Basics',
      subtitle: 'Level 0 to 10 Journey',
      icon: <Gamepad2 className="text-green-400" />,
      content: (
        <div className="space-y-8">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
            <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-green-400" /> The "Level 10" Requirement
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Before you can customize anything, you must be at least **Steam Level 10**. This is a hard requirement from Valve to unlock your first "Showcase Slot". If you are currently Level 0-9, the showcase option simply will not appear in your profile settings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 hover:border-white/10 transition-colors">
              <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} className="text-yellow-500" /> How to Level Up Fast
              </h3>
              <ul className="space-y-3 text-xs text-gray-500 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0" /> 
                  <span>Craft the **"Community Ambassador"** badge by completing simple tasks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0" /> 
                  <span>Buy **Seasonal Badges** from the Steam Points Shop for a quick 1,000+ XP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0" /> 
                  <span>Craft game badges using trading cards from cheap games.</span>
                </li>
              </ul>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 hover:border-white/10 transition-colors">
              <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Palette size={14} className="text-steam-blue" /> Selecting a Theme
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Don't just pick random items. Choose a **"Primary Color"** based on your favorite game or character. Keeping a consistent palette (e.g., Purple/Cyan) is the difference between a messy profile and an elite one. Use our <span className="text-steam-blue cursor-pointer hover:underline font-bold" onClick={() => setPage('theme-finder')}>Theme Finder</span> to get started.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'p2',
      title: 'Phase 2: The "Artwork" Masterclass',
      subtitle: 'Visual Perfection',
      icon: <ImageIcon className="text-steam-blue" />,
      content: (
        <div className="space-y-8">
          <div className="p-6 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-3xl space-y-4">
            <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <Monitor size={16} className="text-steam-blue" /> The "Long Artwork" Trick
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              By default, Steam caps artwork height at 284px. To upload **"Long"** art (up to 2000px+), you need to use a specific **Console Code** in your browser's Developer Tools (F12) during upload. This tells Steam to ignore the height limit.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setPage('tools')} className="px-4 py-2 bg-steam-blue/10 text-steam-blue border border-steam-blue/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-steam-blue hover:text-black transition-all">
                Use One-Click Uploader
              </button>
              <button className="px-4 py-2 bg-white/5 text-gray-400 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                Copy Manual Code
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
              <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <MousePointer2 size={14} className="text-purple-400" /> Alignment 101
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                To make your profile look seamless, you must match the **"Center"** and **"Right"** panels so the background flows perfectly behind them. Our <span className="text-steam-blue cursor-pointer hover:underline font-bold" onClick={() => setPage('tools')}>Artwork Cropper</span> does the math for you automatically.
              </p>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
              <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} className="text-yellow-500" /> GIF Optimization
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Steam has a **5MB limit** for animations. If your GIF is too heavy, it will be blocked or load slowly. Use high-contrast colors but **avoid red gradients**, as Steam's compression is notoriously hard on the color red, making it look pixelated.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'p3',
      title: 'Phase 3: Advanced Showcases',
      subtitle: 'Elite Tier Customization',
      icon: <Layers className="text-purple-400" />,
      content: (
        <div className="space-y-8">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
            <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <Layout size={16} className="text-purple-400" /> The Workshop Row
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Want a second "wide" artwork row? You can upload **5 specific 100x100px square images** to the Steam Workshop. When selected in the "Workshop Showcase", they align into a clean, wide horizontal bar that sits perfectly under your main artwork.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
              <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Trophy size={14} className="text-yellow-400" /> Achievement Art
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Use specific games like **"Zup!"** or **"Qop"** to unlock icons that are letters or symbols. You can then use the Achievement Showcase to spell out your name or create minimalist pixel art.
              </p>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
              <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Crown size={14} className="text-purple-400" /> The Transparent Profile
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                To see your background through your profile boxes, you must purchase a **"Special Profile"** from the Points Shop. Themes like **Hades**, **Dying Light 2**, or **Cyberpunk 2077** allow for the most transparency.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'p4',
      title: 'Phase 4: Branding & Bio',
      subtitle: 'The Minimalist Touch',
      icon: <UserX className="text-red-400" />,
      content: (
        <div className="space-y-8">
          <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl space-y-4">
            <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <UserX size={16} className="text-red-400" /> The Invisible Name
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              For a ultra-clean look, you can hide your Steam Name. Copy our **Unicode character** (Zero-Width Space) and paste it as your profile name. It will appear completely blank in the header.
            </p>
            <button onClick={() => setPage('tools')} className="text-[10px] font-black uppercase text-red-400 flex items-center gap-2 hover:underline">
              Generate Invisible Name <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
              <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Code size={14} className="text-green-400" /> Custom Info Box (ASCII Art)
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Use your **Custom Info Box** to display PC specs or social links. Use "Invisible" spaces to center your text and fancy ASCII symbols for a professional branding look.
              </p>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
              <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Star size={14} className="text-yellow-400" /> Badge Stacking
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Choose your **"Primary Badge"** and your **"Latest 4"** badges carefully. Ensure their colors match your overall profile palette to tie the entire design together.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'p5',
      title: 'Phase 5: The "Pro" Checklist',
      subtitle: 'Final Verification',
      icon: <Rocket className="text-orange-400" />,
      content: (
        <div className="space-y-8">
          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                  <Rocket size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Final Launch Readiness</h3>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Verify your excellence</p>
               </div>
            </div>

            <div className="space-y-3">
              {[
                { id: 'c1', text: 'Is my Artwork aligned perfectly with my Background?' },
                { id: 'c2', text: 'Does my Avatar Frame match my accent color?' },
                { id: 'c3', text: 'Is my Bio text centered or using "Invisible" spaces?' },
                { id: 'c4', text: 'Are my 5MB GIFs loading quickly without lag?' },
                { id: 'c5', text: 'Have I updated my "Primary Group" to match the theme?' },
                { id: 'c6', text: 'Is my "Invisible Name" character working correctly?' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${checkedItems.includes(item.id) ? 'bg-steam-blue/10 border-steam-blue/30 text-white' : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'}`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${checkedItems.includes(item.id) ? 'bg-steam-blue border-steam-blue text-black' : 'border-white/10'}`}>
                    {checkedItems.includes(item.id) && <CheckCircle2 size={16} strokeWidth={3} />}
                  </div>
                  <span className="text-sm font-bold">{item.text}</span>
                </button>
              ))}
            </div>
            
            <AnimatePresence>
              {checkedItems.length === 6 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 bg-green-500/10 border border-green-500/20 rounded-[32px] text-center space-y-3 shadow-2xl shadow-green-500/5"
                >
                  <Sparkles size={32} className="text-green-400 mx-auto animate-bounce" />
                  <h4 className="text-white font-black text-lg uppercase tracking-tight">Profile Excellence Achieved!</h4>
                  <p className="text-green-400/80 font-bold uppercase tracking-widest text-[10px]">Your profile is officially in the elite 1%.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#060709] pt-28 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="text-center mb-20 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-steam-blue/10 border border-steam-blue/20 rounded-full text-[10px] font-black uppercase tracking-widest text-steam-blue"
          >
            <Compass size={14} /> Global Handbook
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tight">Official <span className="text-steam-blue underline underline-offset-8 decoration-steam-blue/30">Steam Custom Guide</span></h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            The definitive 2026 journey from Level 0 to Elite Designer. Master the art of the profile.
          </p>
        </div>

        {/* Phase Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {phases.map((phase, idx) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all ${activePhase === phase.id ? 'bg-white text-black border-white shadow-xl scale-105' : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10'}`}
            >
              <div className="text-lg">{phase.icon}</div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Step 0{idx + 1}</p>
                <p className="text-xs font-black uppercase tracking-tight">{phase.title.includes(':') ? phase.title.split(': ')[1] : phase.title}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Phase Content Area */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {phases.map((phase) => phase.id === activePhase && (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-12"
              >
                <div className="flex items-center gap-6 border-b border-white/5 pb-10">
                  <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-3xl border border-white/10 shadow-inner">
                    {phase.icon}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tight">{phase.title}</h2>
                    <p className="text-[11px] text-steam-blue font-black uppercase tracking-[0.3em] mt-2">{phase.subtitle}</p>
                  </div>
                </div>

                {phase.content}

                <div className="pt-10 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/5">
                   <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                      <Zap size={14} className="text-yellow-500 animate-pulse" /> Expert Grade Guide
                   </div>
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={() => {
                          const prevIdx = phases.findIndex(p => p.id === activePhase) - 1;
                          if (prevIdx >= 0) setActivePhase(phases[prevIdx].id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={phases.findIndex(p => p.id === activePhase) === 0}
                        className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-20 transition-all"
                      >
                        Previous
                      </button>
                      <button 
                        onClick={() => {
                          const nextIdx = phases.findIndex(p => p.id === activePhase) + 1;
                          if (nextIdx < phases.length) setActivePhase(phases[nextIdx].id);
                          else setPage('marketplace');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-3 px-10 py-4 bg-steam-blue hover:bg-steam-deepBlue text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-steam-blue/10 transition-all group"
                      >
                        {phases.findIndex(p => p.id === activePhase) === phases.length - 1 ? 'Start Designing' : 'Next Step'} 
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Banner */}
        <div className="mt-32 p-16 bg-gradient-to-br from-steam-blue/20 via-transparent to-transparent border border-steam-blue/20 rounded-[48px] text-center relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-steam-blue/10 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-1000" />
          <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Ready to transform your profile?</h3>
          <p className="text-gray-400 mb-12 max-w-lg mx-auto font-medium leading-relaxed">
            Master the basics, push the technical limits, and join the elite ranks of Steam profile designers.
          </p>
          <button 
            onClick={() => setPage('marketplace')}
            className="px-12 py-5 bg-steam-blue text-black font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-steam-blue/20 transition-all hover:scale-105 active:scale-95"
          >
            Explore the Marketplace
          </button>
        </div>

      </div>
    </div>
  );
};

export default CustomGuide;
