
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Settings as Gear, 
  Star, 
  ShieldCheck, 
  Crown, 
  TrendingUp 
} from 'lucide-react';
import { calculateCreatorLevel } from '../utils/leveling';

interface CreatorAvatarProps {
  src: string;
  totalSales: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CreatorAvatar: React.FC<CreatorAvatarProps> = ({ src, totalSales, size = 'md', className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const info = calculateCreatorLevel(totalSales);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const badgeSizeClasses = {
    sm: 'w-4 h-4 p-0.5',
    md: 'w-6 h-6 p-1',
    lg: 'w-8 h-8 p-1.5',
    xl: 'w-10 h-10 p-2',
  };

  const getBadgeIcon = () => {
    switch (info.level) {
      case 1: return <Compass className="text-orange-400" />;
      case 2: return <Gear className="text-gray-300" />;
      case 3: return <Star className="text-yellow-400" />;
      case 4: return <ShieldCheck className="text-blue-300" />;
      case 5: return <Crown className="text-purple-400" />;
      default: return null;
    }
  };

  const getBadgeColor = () => {
    switch (info.level) {
      case 1: return 'bg-[#3e2723] border-[#795548]';
      case 2: return 'bg-[#37474f] border-[#78909c]';
      case 3: return 'bg-[#3e2e01] border-[#fbc02d]';
      case 4: return 'bg-[#012a3e] border-[#03a9f4]';
      case 5: return 'bg-[#2a013e] border-[#9c27b0]';
      default: return 'bg-black border-white/10';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Level 5 Mythic Aura */}
      {info.level === 5 && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className={`absolute inset-[-8px] rounded-full border-2 border-dashed border-purple-500/30 blur-[2px]`}
        />
      )}
      {info.level === 5 && (
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className={`absolute inset-[-4px] rounded-full bg-gradient-to-r from-purple-600 via-transparent to-pink-500 opacity-40 blur-md`}
        />
      )}

      {/* Main Avatar */}
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/10 relative z-10 bg-black shadow-2xl`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={src} alt="Creator" className="w-full h-full object-cover" />
      </div>

      {/* Badge Overlay */}
      {info.level > 0 && (
        <div 
          className={`absolute bottom-0 right-0 z-20 rounded-full border shadow-lg flex items-center justify-center transition-transform hover:scale-110 ${getBadgeColor()} ${badgeSizeClasses[size]}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {getBadgeIcon()}
        </div>
      )}

      {/* Progress Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-50 w-56 bg-[#12141a] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Creator Status</span>
              <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${getBadgeColor()}`}>Lvl {info.level}</span>
            </div>
            
            <h4 className="text-white font-black text-sm mb-1">{info.tierName} Creator</h4>
            
            <div className="space-y-1.5 mt-4">
              <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                <span>{info.currentXP.toLocaleString()} AC</span>
                {info.nextLevelXP && <span>{info.nextLevelXP.toLocaleString()} AC</span>}
              </div>
              
              {/* Custom Progress Bar */}
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${info.progressPercent}%` }}
                  className={`h-full rounded-full ${
                    info.level === 5 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-steam-blue'
                  }`}
                />
              </div>
              
              {info.nextLevelXP ? (
                <p className="text-[8px] text-steam-blue font-bold uppercase text-center mt-2 flex items-center justify-center gap-1">
                  <TrendingUp size={8} /> {(info.nextLevelXP - info.currentXP).toLocaleString()} AC to next tier
                </p>
              ) : (
                <p className="text-[8px] text-purple-400 font-black uppercase text-center mt-2">Maximum Mastery Achieved</p>
              )}
            </div>

            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#12141a]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatorAvatar;
