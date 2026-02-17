
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
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Use the first color as dominant, fallback to steam blue if not present
  const dominantColor = artwork.colors?.[0] || '#66c0f4';

  React.useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => { });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative h-full rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={() => onClick(artwork.id)}
        className="relative h-full w-full overflow-hidden rounded-2xl bg-[#0e1014] transition-all duration-500 ease-out border border-white/5"
        style={{
          boxShadow: isHovered ? `0 0 30px ${dominantColor}40` : '0 10px 30px rgba(0,0,0,0.5)',
          borderColor: isHovered ? `${dominantColor}80` : 'rgba(255,255,255,0.05)'
        }}
      >

        {/* Image/Video Container */}
        <div className="relative w-full aspect-[4/3] bg-black">
          {artwork.imageUrl?.endsWith('.webm') ? (
            <video
              ref={videoRef}
              src={artwork.imageUrl}
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
            />
          ) : (
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
          )}

          {/* Top-Left Badges - Always Visible */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {(artwork.category === 'workshop' || artwork.imageUrl?.endsWith('.webm')) && (
              <div className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 transition-all duration-300 group-hover:-translate-y-1">
                <PlayCircle size={12} className="text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Animated</span>
              </div>
            )}
            {artwork.isOwned && (
              <div className="px-2.5 py-1 rounded-md bg-steam-blue text-black border border-steam-blue/50 flex items-center gap-1.5 shadow-xl">
                <Check size={12} className="font-bold" />
                <span className="text-[10px] font-black uppercase tracking-widest">Owned</span>
              </div>
            )}
          </div>

          {/* Like Button - Always Visible but low opacity until hover */}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <div
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              className={`p-2 rounded-full backdrop-blur-md border transition-all ${liked ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-black/40 border-white/10 text-white hover:bg-white/20'}`}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
            </div>
          </div>
        </div>

        {/* Bottom Info Overlay - Shown on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <div className="space-y-1 overflow-hidden">
                <h3 className="text-white font-black text-lg leading-tight truncate drop-shadow-lg">{artwork.title}</h3>
                <div className="text-[10px] text-gray-300 uppercase tracking-widest font-bold flex items-center gap-1">
                  by <span className="text-white relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all group-hover:after:w-full">{artwork.creatorName}</span>
                  <CreatorTag status={artwork.creatorStatus} size="sm" className="scale-75 origin-left" />
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end">
                <span className={`text-lg font-black ${artwork.price === 0 ? 'text-green-400' : 'text-white'}`} style={{ textShadow: `0 0 20px ${dominantColor}60` }}>
                  {artwork.price === 0 ? 'FREE' : `${artwork.price} AC`}
                </span>
              </div>
            </div>


          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ArtworkCard;
