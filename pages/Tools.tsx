
import React, { useState } from 'react';
import { 
    Scissors, 
    Monitor, 
    Palette, 
    Layers, 
    Download, 
    Upload, 
    Info, 
    ChevronRight,
    Wrench,
    Sparkles,
    Smartphone,
    MousePointer2,
    ArrowRight,
    Zap,
    UserX,
    Hash,
    Trophy,
    TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const toolsList = [
    {
      id: 'cropper',
      title: 'Artwork Cropper',
      description: 'Slice images into perfectly aligned Long & Side showcase panels.',
      icon: <Scissors className="w-6 h-6" />,
      status: 'Ready'
    },
    {
      id: 'previewer',
      title: 'Profile Visualizer',
      description: 'See exactly how assets look in a mock Steam profile UI.',
      icon: <Monitor className="w-6 h-6" />,
      status: 'Updated'
    },
    {
      id: 'gif-opt',
      title: 'GIF Optimizer',
      description: 'Shrink frames and optimize colors to hit Steams strict file size limits.',
      icon: <Zap className="w-6 h-6" />,
      status: 'Ready'
    },
    {
      id: 'palette',
      title: 'Color Extractor',
      description: 'Get a perfect color palette from any game background.',
      icon: <Palette className="w-6 h-6" />,
      status: 'Ready'
    },
    {
      id: 'workshop',
      title: 'Workshop Slicer',
      description: 'Convert videos into Workshop-compatible loop GIFs.',
      icon: <Layers className="w-6 h-6" />,
      status: 'Beta'
    },
    {
        id: 'invisible',
        title: 'Invisible Character',
        description: 'Generate zero-width characters for clean, minimalist profile names.',
        icon: <UserX className="w-6 h-6" />,
        status: 'Ready'
    },
    {
        id: 'id-convert',
        title: 'Steam ID Converter',
        description: 'Quickly switch between SteamID64, SID3, and profile URLs.',
        icon: <Hash className="w-6 h-6" />,
        status: 'Ready'
    },
    {
        id: 'achievement',
        title: 'Achievement Builder',
        description: 'Plan your showcase layout and sort by rarity or color aesthetics.',
        icon: <Trophy className="w-6 h-6" />,
        status: 'Beta'
    },
    {
        id: 'level-calc',
        title: 'Level Calculator',
        description: 'Detailed XP roadmap for your next profile level milestone.',
        icon: <TrendingUp className="w-6 h-6" />,
        status: 'Ready'
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 max-w-7xl mx-auto pb-20">
      
      {/* Page Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-steam-blue/20 flex items-center justify-center text-steam-blue border border-steam-blue/30">
                <Wrench size={18} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Creative <span className="text-steam-blue">Suite</span></h1>
        </div>
        <p className="text-white/80 text-sm font-medium max-w-xl">
            Specialized utilities for crafting immersive Steam profile experiences.
        </p>
      </header>

      {/* Main Tools Grid */}
      {!activeTool ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {toolsList.map((tool, idx) => (
                <motion.div 
                    key={tool.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => setActiveTool(tool.id)}
                    className="group relative bg-[#1c212b] rounded-3xl border border-white/20 p-6 cursor-pointer overflow-hidden transition-all hover:border-steam-blue/50 hover:bg-[#252b36] shadow-xl flex flex-col h-full"
                >
                    <div className="relative z-10 flex flex-col h-full">
                        {/* Icon Container */}
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-3.5 rounded-2xl bg-white/10 border border-white/20 text-white group-hover:text-steam-blue group-hover:scale-110 transition-all duration-300 shadow-inner`}>
                                {tool.icon}
                            </div>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                                tool.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' : 
                                tool.status === 'Updated' ? 'bg-purple-500/20 text-purple-400 border-purple-500/40' : 
                                'bg-green-500/20 text-green-400 border-green-500/40'
                            }`}>
                                {tool.status}
                            </span>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0 mb-6">
                            <h2 className="text-lg font-black text-white tracking-tight group-hover:text-steam-blue transition-colors mb-2">
                                {tool.title}
                            </h2>
                            <p className="text-white/90 text-xs leading-relaxed">
                                {tool.description}
                            </p>
                        </div>

                        {/* Action Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-white/30 group-hover:text-steam-blue transition-colors">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Launch Module</span>
                            <ArrowRight size={20} />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1c212b] rounded-3xl border border-white/20 min-h-[500px] flex flex-col shadow-2xl"
        >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setActiveTool(null)}
                        className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                    >
                        <ChevronRight className="rotate-180" size={24} />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-white">{toolsList.find(t => t.id === activeTool)?.title}</h2>
                        <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Workspace 1.0</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all">
                        <Info size={20} />
                    </button>
                </div>
            </div>

            {/* Tool Content Area */}
            <div className="flex-1 p-8">
                {activeTool === 'cropper' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="flex flex-col">
                            <div className="flex-1 border-2 border-dashed border-white/20 rounded-2xl bg-black/30 flex flex-col items-center justify-center text-center p-8 group hover:border-steam-blue/50 transition-all cursor-pointer">
                                <div className="w-20 h-20 bg-steam-blue/20 rounded-full flex items-center justify-center text-steam-blue mb-6 group-hover:scale-110 transition-transform">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Upload Background</h3>
                                <p className="text-white/70 text-sm max-w-[240px] mb-8 leading-relaxed">JPG, PNG or WebP up to 25MB. Recommended resolution 1920x1080.</p>
                                <button className="px-8 py-3 bg-steam-blue text-black font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-steam-blue/20">
                                    Select File
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                             <div>
                                 <h4 className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-4">Preview Alignment</h4>
                                 <div className="flex gap-4 h-[300px]">
                                     <div className="flex-1 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                                         <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Main Panel</div>
                                     </div>
                                     <div className="w-[80px] bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                                         <div className="rotate-90 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Side</div>
                                     </div>
                                 </div>
                             </div>
                             <button disabled className="w-full py-5 bg-white/5 text-white/20 font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 cursor-not-allowed">
                                 Download Sliced Assets
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-steam-blue mb-8 border border-white/20 animate-pulse">
                             <Sparkles size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">Syncing Module...</h3>
                        <p className="text-white/80 text-base max-w-[320px] mb-10 leading-relaxed">
                            Initializing the <span className="text-steam-blue font-bold">{toolsList.find(t => t.id === activeTool)?.title}</span> engine. Please hold on.
                        </p>
                        <button 
                            onClick={() => setActiveTool(null)}
                            className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-widest rounded-xl border border-white/20 transition-all"
                        >
                            Return to Suite
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
      )}

      {/* Simplified Footer Info */}
      {!activeTool && (
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/20 pt-16">
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#1c212b] border border-white/20 flex items-center justify-center text-steam-blue shadow-lg">
                    <MousePointer2 size={22} />
                </div>
                <p className="text-sm text-white font-medium leading-relaxed">Calibrated to 1:1 Steam showcase alignment standards.</p>
            </div>
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#1c212b] border border-white/20 flex items-center justify-center text-purple-400 shadow-lg">
                    <Layers size={22} />
                </div>
                <p className="text-sm text-white font-medium leading-relaxed">Batch export entire asset sets in high-quality Zip files.</p>
            </div>
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#1c212b] border border-white/20 flex items-center justify-center text-yellow-400 shadow-lg">
                    <Smartphone size={22} />
                </div>
                <p className="text-sm text-white font-medium leading-relaxed">Responsive simulator included for mobile profile previews.</p>
            </div>
        </section>
      )}
    </div>
  );
};

export default Tools;
