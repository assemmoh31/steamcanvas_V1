
import React from 'react';
import { motion } from 'framer-motion';

type CreatorStatus = 'Creator' | 'Pro' | 'Elite';

interface CreatorTagProps {
  status?: CreatorStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CreatorTag: React.FC<CreatorTagProps> = ({ status, className = "", size = 'md' }) => {
  if (!status) return null;

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[8px]',
    md: 'px-2 py-1 text-[10px]',
    lg: 'px-3 py-1.5 text-xs'
  };

  const currentSize = sizeStyles[size];

  // 1. CREATOR TAG (Platinum/Silver with Shimmer)
  if (status === 'Creator') {
    return (
      <div className={`relative inline-flex items-center rounded-md bg-gradient-to-br from-gray-300 to-gray-500 overflow-hidden border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.3)] ${currentSize} ${className}`}>
        <span className="font-black uppercase tracking-widest text-black leading-none select-none relative z-10">
          Creator
        </span>
        {/* Shimmer Effect */}
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] z-20"
        />
      </div>
    );
  }

  // 2. PRO TAG (Neon Blue with Breathe)
  if (status === 'Pro') {
    return (
      <motion.span
        animate={{ 
          boxShadow: [
            "0 0 5px rgba(0, 229, 255, 0.4)", 
            "0 0 15px rgba(0, 229, 255, 0.8)", 
            "0 0 5px rgba(0, 229, 255, 0.4)"
          ] 
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className={`inline-flex items-center rounded-md border border-steam-blue bg-steam-blue/5 backdrop-blur-md font-black uppercase tracking-widest text-steam-blue leading-none select-none ${currentSize} ${className}`}
      >
        Pro
      </motion.span>
    );
  }

  // 3. ELITE TAG (Gold/Orange with Flicker)
  if (status === 'Elite') {
    return (
      <motion.span
        animate={{ 
          opacity: [1, 0.4, 1, 0.7, 1],
        }}
        transition={{ 
          duration: 0.4, 
          repeat: Infinity, 
          repeatDelay: 9.6,
          times: [0, 0.2, 0.4, 0.6, 1]
        }}
        className={`inline-flex items-center rounded-md bg-gradient-to-r from-yellow-400 to-orange-600 font-black uppercase tracking-widest text-black shadow-[0_0_12px_rgba(251,191,36,0.5)] leading-none select-none ${currentSize} ${className}`}
        style={{ textShadow: "0 0 2px rgba(255,255,255,0.3)" }}
      >
        Elite
      </motion.span>
    );
  }

  return null;
};

export default CreatorTag;
