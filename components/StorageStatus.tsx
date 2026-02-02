
import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface StorageStatusProps {
  usedGB: number;
  limitGB: number;
  onUpgrade: () => void;
}

const StorageStatus: React.FC<StorageStatusProps> = ({ usedGB, limitGB, onUpgrade }) => {
  const percentage = (usedGB / limitGB) * 100;
  const isWarning = percentage >= 80 && percentage < 95;
  const isFull = percentage >= 95;
  const showUpgrade = percentage > 90;

  const getBarColor = () => {
    if (isFull) return '#FF3D00';
    if (isWarning) return '#FFAB00';
    return '#00E5FF';
  };

  return (
    <div className="relative group/storage w-24">
      {/* Usage Labels (displayed on top/hover or in compact mode) */}
      <div className="flex items-center justify-between mb-1 px-0.5">
        <span className="text-[7px] font-black text-gray-500 uppercase tracking-tighter truncate w-full">
          {usedGB.toFixed(1)}GB / {limitGB.toFixed(1)}GB
        </span>
      </div>

      {/* Mini Progress Bar (height: 6px) */}
      <div className="h-[6px] w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ 
            width: `${Math.min(percentage, 100)}%`,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${isFull ? 'animate-pulse' : ''}`}
          style={{ 
            backgroundColor: getBarColor(),
            boxShadow: isFull ? '0 0 10px rgba(255, 61, 0, 0.4)' : isWarning ? '0 0 5px rgba(255, 171, 0, 0.2)' : 'none'
          }}
        />
      </div>

      {/* Upgrade Tag */}
      {showUpgrade && (
        <div className="mt-1 flex justify-center">
            <button 
              onClick={(e) => { e.stopPropagation(); onUpgrade(); }}
              className="text-[7px] font-black text-white px-1 py-0.5 rounded bg-orange-600 animate-pulse hover:bg-orange-500 transition-colors shadow-[0_0_8px_rgba(234,88,12,0.5)] leading-none"
            >
              UPGRADE
            </button>
        </div>
      )}

      {/* Tooltip on Hover */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-[60] w-48 opacity-0 invisible group-hover/storage:opacity-100 group-hover/storage:visible transition-all duration-200 pointer-events-none">
         <div className="bg-[#12141a] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <Info size={12} className="text-steam-blue" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Storage Status</span>
            </div>
            <div className="space-y-1">
                <p className="text-[9px] text-gray-200 font-bold">Plan: Free Account</p>
                <p className="text-[9px] text-gray-400 leading-relaxed">
                  25 Artworks max. Upgrade to Elite for 50GB and Unlimited uploads.
                </p>
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-white/10" />
         </div>
      </div>
    </div>
  );
};

export default StorageStatus;
