import React from 'react';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import ActivityTicker from '../components/ActivityTicker';

interface HomeProps {
  setPage: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ setPage }) => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C10] via-[#1F2833]/50 to-[#0B0C10] z-0"></div>
        <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Level Up Your <span className="text-steam-blue">Steam Profile</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            The premier marketplace for custom Steam artwork, showcase designs, and profile aesthetics. Support creators and stand out.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => setPage('marketplace')}
              className="px-8 py-4 bg-steam-blue hover:bg-steam-deepBlue text-black font-bold text-lg rounded-full transition-all shadow-[0_0_20px_rgba(102,252,241,0.3)] hover:shadow-[0_0_30px_rgba(102,252,241,0.5)] flex items-center gap-2"
            >
              Explore Marketplace <ArrowRight size={20} />
            </button>
            <button 
                onClick={() => setPage('dashboard')}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold text-lg rounded-full border border-white/10 transition-all backdrop-blur-sm"
            >
              Become a Creator
            </button>
          </motion.div>
        </div>

        {/* Live Activity Ticker */}
        <ActivityTicker />
      </section>

      {/* Featured Showcase Preview (Middle) */}
      <section className="py-20 bg-gradient-to-t from-[#0B0C10] to-[#15171e]">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Trending This Week</h2>
                    <p className="text-gray-400">Top selling aesthetics from the community.</p>
                </div>
                <button onClick={() => setPage('marketplace')} className="text-steam-blue hover:text-white font-medium transition-colors">View All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Static Preview Cards */}
                 <div onClick={() => setPage('marketplace')} className="cursor-pointer group">
                    <div className="overflow-hidden rounded-xl aspect-video mb-4 relative">
                        <img src="https://picsum.photos/id/237/600/340" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" alt="Featured" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <h4 className="text-white font-bold text-lg">Cyberpunk Glitch</h4>
                    <p className="text-gray-500 text-sm">by NeonDreamer</p>
                 </div>
                 <div onClick={() => setPage('marketplace')} className="cursor-pointer group">
                    <div className="overflow-hidden rounded-xl aspect-video mb-4 relative">
                        <img src="https://picsum.photos/id/45/600/340" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" alt="Featured" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <h4 className="text-white font-bold text-lg">Anime Aesthetic</h4>
                    <p className="text-gray-500 text-sm">by SteamDesigner_X</p>
                 </div>
                 <div onClick={() => setPage('marketplace')} className="cursor-pointer group">
                    <div className="overflow-hidden rounded-xl aspect-video mb-4 relative">
                        <img src="https://picsum.photos/id/77/600/340" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" alt="Featured" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <h4 className="text-white font-bold text-lg">Dark Souls Tribute</h4>
                    <p className="text-gray-500 text-sm">by PraiseTheSun</p>
                 </div>
            </div>
        </div>
      </section>

      {/* Features Grid (Bottom) */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#1c1e26] border border-white/5 hover:border-steam-blue/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-steam-blue/10 flex items-center justify-center text-steam-blue mb-4">
                    <Star size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Curated Quality</h3>
                <p className="text-gray-400">Every design is vetted for quality. High-resolution assets perfectly sized for Steam showcases.</p>
            </div>
            <div className="p-8 rounded-2xl bg-[#1c1e26] border border-white/5 hover:border-steam-blue/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                    <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Transactions</h3>
                <p className="text-gray-400">Safe payments and instant delivery. Your purchases are stored forever in your account.</p>
            </div>
            <div className="p-8 rounded-2xl bg-[#1c1e26] border border-white/5 hover:border-steam-blue/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-4">
                    <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Support Creators</h3>
                <p className="text-gray-400">70% of every sale goes directly to the artist. Build your favorite artist's career.</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;