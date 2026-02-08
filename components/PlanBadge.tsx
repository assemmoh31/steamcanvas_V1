import React from 'react';
import { Sparkles, Zap, Crown, Star } from 'lucide-react';

interface PlanBadgeProps {
    tier?: string;
    className?: string;
}

const PlanBadge: React.FC<PlanBadgeProps> = ({ tier = 'FREE', className = '' }) => {
    const tierUpper = tier.toUpperCase();

    // Common styling for all badges:
    // rounded-full, px-3 py-1, text-[11px], font-black (heavy)
    const baseStyles = "relative inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest backdrop-blur-md transition-all duration-300";

    let containerStyles = '';
    let textStyles = '';
    let icon = null;
    let overlay = null;

    switch (tierUpper) {
        case 'PRO':
            // Blue-400 to Cyan-500, soft outer glow, glass background
            containerStyles = 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:border-cyan-400/50';
            textStyles = 'text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]';
            // Lightning bolt with flicker
            icon = <Zap size={12} className="text-cyan-400 mr-1.5 animate-flicker" fill="currentColor" strokeWidth={0} />;
            break;

        case 'ELITE':
            // Amethyst-to-Diamond (violet-500 -> fuchsia-500 -> cyan-400)
            containerStyles = 'bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-400/20 border border-fuchsia-400/30 shadow-[0_0_20px_rgba(217,70,239,0.25)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] group overflow-hidden';
            textStyles = 'text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]';
            // Crown icon
            icon = <Crown size={12} className="text-fuchsia-300 mr-1.5" strokeWidth={2.5} />;
            // Holographic overlay
            overlay = <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] group-hover:animate-shimmer" />;
            break;

        case 'CREATOR':
        case 'MASTER':
            // Gold-to-Deep-Orange, Metallic, Burning Glow
            containerStyles = 'bg-gradient-to-r from-amber-400/20 to-red-600/20 border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)]';
            textStyles = 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-red-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]';
            // Star icon
            icon = <Star size={12} className="text-amber-400 mr-1.5" fill="currentColor" />;
            break;

        default: // BASIC / FREE
            containerStyles = 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400';
            textStyles = 'text-gray-400';
            break;
    }

    const label = tierUpper === 'FREE' ? 'BASIC' : (tierUpper === 'MASTER' ? 'MASTER CREATOR' : tierUpper);

    return (
        <span className={`${baseStyles} ${containerStyles} ${className}`}>
            {overlay}
            <span className={`relative flex items-center z-10 ${textStyles}`}>
                {icon}
                {label}
            </span>
        </span>
    );
};

export default PlanBadge;
