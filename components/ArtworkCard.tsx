
import React, { useState } from 'react';
import { Artwork } from '../types';
import { Heart, Check, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import CreatorTag from './CreatorTag';

interface ArtworkCardProps {
  artwork: Artwork;
  onBuy: (id: string) => void;
  onClick: (id: string) => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onBuy, onClick }) => {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative h-full"
    >
      <div 
        onClick={() => onClick(artwork.id)}
        className={`relative overflow-hidden rounded-2xl bg-[#242933] shadow-[0_12px_40px_rgb(0,0,0,0.6)] cursor-pointer h-full flex flex-col border transition-all duration-500 ease-out 
          ${artwork.isOwned 
            ? 'border-steam-blue/60 shadow-[0_0_25px_rgba(102,252,241,0.15)]' 
            : 'border-white/30 hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]'
          }`}
      >
        
        {/* Image Container */}
        <div className="relative w-full aspect-video overflow-hidden bg-black">
            <img 
              src={artwork.imageUrl} 
              alt={artwork.title} 
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out opacity-95 group-hover:opacity-100"
            />
            
            {/* Top-Left Badges (Always Visible) */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                {artwork.category === 'workshop' && (
                    <div className="px-2.5 py-1 rounded-md bg-black/90 backdrop-blur-md border border-steam-blue/50 flex items-center gap-1.5 shadow-xl">
                        <PlayCircle size={12} className="text-steam-blue" />
                        <span className="text-[10px] font-black text-steam-blue uppercase tracking-widest">Animated</span>
                    </div>
                )}
                {artwork.isOwned && (
                    <div className="px-2.5 py-1 rounded-md bg-steam-blue text-black border border-steam-blue/50 flex items-center gap-1.5 shadow-xl">
                        <Check size={12} className="font-bold" />
                        <span className="text-[10px] font-black uppercase tracking-widest">In Library</span>
                    </div>
                )}
            </div>

            {/* HOVER OVERLAYS - LIKES (Top Right) */}
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div 
                  onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border shadow-2xl transition-all ${liked ? 'text-red-500 border-red-500/40' : 'text-white border-white/20 hover:border-white/40'}`}
                >
                    <Heart size={14} fill={liked ? "currentColor" : "none"} className={liked ? "animate-pulse" : ""} />
                    <span className="text-[10px] font-black">{artwork.likes + (liked ? 1 : 0)}</span>
                </div>
            </div>

            {/* HOVER OVERLAYS - CREATOR INFO (Bottom Left) */}
            <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 shadow-2xl">
                    <p className="text-white text-[10px] font-medium flex items-center gap-1.5 truncate leading-none">
                        <span className="opacity-70 shrink-0">by</span> 
                        <span className="text-steam-blue font-bold truncate">{artwork.creatorName}</span>
                    </p>
                    <CreatorTag status={artwork.creatorStatus} className="scale-75 origin-left" />
                </div>
            </div>
            
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Info Section (Bottom Bar) */}
        <div className="p-4 bg-[#2d343f] flex items-center justify-between border-t border-white/20 min-h-[64px] gap-4">
            {/* Artwork Name - Now positioned on the left of the bottom bar */}
            <h3 className="text-white font-extrabold text-sm truncate group-hover:text-steam-blue transition-colors max-w-[180px]">
                {artwork.title}
            </h3>

            {/* Action Area (Right) */}
            <div className="shrink-0">
                {artwork.isOwned ? (
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest">Collected</span>
                  </div>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onBuy(artwork.id); }}
                    className={`px-5 py-2 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 group/btn shadow-xl ${
                        artwork.price === 0 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500 hover:text-black' 
                        : 'bg-yellow-500 text-black border border-yellow-400 hover:bg-white hover:border-white hover:scale-105 active:scale-95 shadow-yellow-500/20'
                    }`}
                  >
                    {artwork.price === 0 ? 'Free' : `${artwork.price} AC`}
                  </button>
                )}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
