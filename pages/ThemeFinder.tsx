
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Search, Compass, Zap, Moon, Sun, Ghost, Coins, ExternalLink } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  game: string;
  image: string;
  mood: 'calm' | 'energetic' | 'dark' | 'bright';
  steamPointsCost: number;
}

const THEMES: Theme[] = [
  {
    id: 'cyberpunk-grid',
    name: 'Night City Grid',
    game: 'Cyberpunk 2077',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop',
    mood: 'energetic',
    steamPointsCost: 2000
  },
  {
    id: 'hades-flames',
    name: 'Underworld Embers',
    game: 'Hades',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2069&auto=format&fit=crop',
    mood: 'dark',
    steamPointsCost: 2000
  },
  {
    id: 'stardew-sunset',
    name: 'Pelican Town Sunset',
    game: 'Stardew Valley',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?q=80&w=2070&auto=format&fit=crop',
    mood: 'calm',
    steamPointsCost: 500
  },
  {
    id: 'elden-tree',
    name: 'Erdtree Horizon',
    game: 'Elden Ring',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2088&auto=format&fit=crop',
    mood: 'bright',
    steamPointsCost: 2000
  },
  {
    id: 'portal-white',
    name: 'Aperture Laboratory',
    game: 'Portal 2',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop',
    mood: 'bright',
    steamPointsCost: 500
  },
  {
    id: 'witcher-wild',
    name: 'Skellige Mists',
    game: 'The Witcher 3',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
    mood: 'calm',
    steamPointsCost: 500
  },
  {
    id: 'neon-tokyo',
    name: 'Shinjuku Rain',
    game: 'Ghostwire: Tokyo',
    image: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=2074&auto=format&fit=crop',
    mood: 'dark',
    steamPointsCost: 2000
  },
  {
    id: 'limbo-monochrome',
    name: 'Void Forest',
    game: 'LIMBO',
    image: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?q=80&w=1974&auto=format&fit=crop',
    mood: 'dark',
    steamPointsCost: 500
  }
];

interface ThemeFinderProps {
  setPage: (page: string) => void;
}

const ThemeFinder: React.FC<ThemeFinderProps> = ({ setPage }) => {
  const [activeMood, setActiveMood] = useState<'all' | Theme['mood']>('all');
  const [search, setSearch] = useState('');

  const filteredThemes = THEMES.filter(t => {
    const matchesMood = activeMood === 'all' || t.mood === activeMood;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.game.toLowerCase().includes(search.toLowerCase());
    return matchesMood && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-steam-blue/20 flex items-center justify-center text-steam-blue border border-steam-blue/30 shadow-[0_0_15px_rgba(102,252,241,0.2)]">
                <Compass size={24} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Theme <span className="text-steam-blue">Finder</span></h1>
        </div>
        <p className="text-white text-lg font-medium max-w-2xl leading-relaxed">
            Find the perfect Steam background. Browse official Point Shop assets filtered by aesthetic mood.
        </p>
      </header>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="flex bg-[#1c212b] p-1.5 rounded-2xl border border-white/20 w-full md:w-auto overflow-x-auto no-scrollbar">
              {['all', 'calm', 'energetic', 'dark', 'bright'].map((m) => (
                <button 
                  key={m}
                  onClick={() => setActiveMood(m as any)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeMood === m ? 'bg-steam-blue text-black shadow-lg' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {m === 'calm' && <Moon size={12} />}
                  {m === 'energetic' && <Zap size={12} />}
                  {m === 'dark' && <Ghost size={12} />}
                  {m === 'bright' && <Sun size={12} />}
                  {m === 'all' ? 'All Assets' : m}
                </button>
              ))}
          </div>

          <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-steam-blue transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search game..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1c212b] border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-steam-blue transition-all"
              />
          </div>
      </div>

      {/* Themes Grid - Set to 3 columns for desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredThemes.map((theme, idx) => (
                <motion.div
                    key={theme.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group relative h-[240px] rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl cursor-pointer"
                >
                    {/* Background Preview */}
                    <div className="absolute inset-0 z-0">
                        <img 
                          src={theme.image} 
                          alt={theme.name} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100" 
                        />
                        {/* Shadow Overlays */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Cost Badge - Always Visible */}
                    <div className="absolute top-4 right-4 z-20">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-xl">
                            <Coins size={12} className="text-blue-400" />
                            <span className="text-[11px] font-black text-white">{theme.steamPointsCost}</span>
                        </div>
                    </div>

                    {/* Interactive Hover Content */}
                    <div className="absolute inset-0 z-10 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h2 className="text-sm font-black text-white mb-1 uppercase tracking-tight truncate">{theme.name}</h2>
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-steam-blue uppercase tracking-widest">{theme.game}</span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setPage('marketplace'); }}
                                className="p-2 rounded-lg bg-steam-blue text-black hover:scale-110 active:scale-95 transition-all shadow-lg shadow-steam-blue/20"
                            >
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
          </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredThemes.length === 0 && (
          <div className="py-40 text-center">
              <Sparkles size={48} className="text-white/10 mx-auto mb-6" />
              <h3 className="text-xl font-black text-white mb-2">No results</h3>
              <p className="text-white/60 text-sm mb-8">Try clearing your filters.</p>
              <button 
                onClick={() => { setActiveMood('all'); setSearch(''); }}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-widest rounded-xl border border-white/10"
              >
                Reset
              </button>
          </div>
      )}

      {/* Simplified Footer */}
      <section className="mt-20 flex flex-col items-center text-center">
          <div className="w-px h-16 bg-gradient-to-b from-steam-blue/50 to-transparent mb-10"></div>
          <h3 className="text-xl font-black text-white mb-3">Sync with Marketplace</h3>
          <p className="text-white/60 text-sm max-w-lg mb-8">
              Pick your background cost and mood, then use our matching engine to find the perfect artwork for your choice.
          </p>
          <button 
            onClick={() => setPage('marketplace')}
            className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 transition-all"
          >
              Go to Marketplace
          </button>
      </section>
    </div>
  );
};

export default ThemeFinder;
