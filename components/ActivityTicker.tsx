import React from 'react';
import { Heart, ShoppingBag, UserPlus, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const activities = [
  { type: 'purchase', user: 'GhostRider', item: 'Neon Genesis', time: '2m ago' },
  { type: 'like', user: 'PixelQueen', item: 'Cyberpunk Glitch', time: '5m ago' },
  { type: 'follow', user: 'SteamKing', target: 'NeonDreamer', time: '12m ago' },
  { type: 'purchase', user: 'VaporDave', item: 'Retro Vaporwave', time: '15m ago' },
  { type: 'like', user: 'AnimeFan99', item: 'Forest Mist', time: '22m ago' },
  { type: 'purchase', user: 'DarkSoul', item: 'Dark Souls Tribute', time: '30m ago' },
  { type: 'earning', user: 'NeonDreamer', amount: '500 CC', time: '1h ago' },
  { type: 'like', user: 'GlitchMaster', item: 'Anime Aesthetic', time: '1h ago' },
];

const ActivityTicker: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#0B0C10]/80 backdrop-blur-md border-t border-white/10 overflow-hidden py-3">
        <div className="flex relative">
             {/* Left Fade Overlay */}
             <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0B0C10] to-transparent z-10 pointer-events-none"></div>
             
             {/* Right Fade Overlay */}
             <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0B0C10] to-transparent z-10 pointer-events-none"></div>

             <motion.div 
                className="flex gap-16 whitespace-nowrap pl-4"
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{ 
                    repeat: Infinity, 
                    ease: "linear", 
                    duration: 70 
                }}
             >
                {/* Quadruple data to ensure seamless loop on large screens */}
                {[...activities, ...activities, ...activities, ...activities].map((act, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                         {act.type === 'purchase' && <div className="p-1.5 rounded-full bg-green-500/10 border border-green-500/20"><ShoppingBag size={12} className="text-green-400" /></div>}
                         {act.type === 'like' && <div className="p-1.5 rounded-full bg-red-500/10 border border-red-500/20"><Heart size={12} className="text-red-400" /></div>}
                         {act.type === 'follow' && <div className="p-1.5 rounded-full bg-blue-500/10 border border-blue-500/20"><UserPlus size={12} className="text-blue-400" /></div>}
                         {act.type === 'earning' && <div className="p-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20"><Zap size={12} className="text-yellow-400" /></div>}
                         
                         <span className="flex items-center gap-1">
                            <span className="font-bold text-gray-200">{act.user}</span>
                            <span className="text-gray-500 text-xs">just</span>
                            <span className="text-gray-400">
                                {act.type === 'purchase' && 'bought'}
                                {act.type === 'like' && 'liked'}
                                {act.type === 'follow' && 'followed'}
                                {act.type === 'earning' && 'earned'}
                            </span>
                            <span className="font-semibold text-steam-blue border-b border-transparent hover:border-steam-blue transition-colors cursor-pointer">
                                {act.type === 'earning' ? act.amount : (act.item || act.target)}
                            </span>
                         </span>
                    </div>
                ))}
             </motion.div>
        </div>
    </div>
  );
};

export default ActivityTicker;