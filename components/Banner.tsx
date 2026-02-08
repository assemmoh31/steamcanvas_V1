
import React, { useRef, useEffect } from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface BannerProps {
    banner: {
        id: number;
        media_url: string;
        redirect_url: string | null;
    };
}

const Banner: React.FC<BannerProps> = ({ banner }) => {
    const ref = useRef<HTMLDivElement>(null);
    const hasViewed = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasViewed.current) {
                    hasViewed.current = true;
                    // Track view
                    const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8787";
                    fetch(`${API_URL}/api/v1/banners/${banner.id}/view`, {
                        method: "POST",
                    }).catch(console.error);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [banner.id]);

    const handleClick = () => {
        const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8787";
        fetch(`${API_URL}/api/v1/banners/${banner.id}/click`, {
            method: "POST",
        }).catch(console.error);

        if (banner.redirect_url) {
            window.open(banner.redirect_url, "_blank");
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group border border-steam-blue/20 rounded-xl overflow-hidden cursor-pointer h-full min-h-[300px]"
            onClick={handleClick}
        >
            {/* Background Media */}
            <img
                src={banner.media_url}
                alt="Partner Ad"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Ad Label */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded text-[10px] font-black tracking-widest text-gray-400 uppercase">
                Sponsored
            </div>

            {/* CTA Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                <div className="flex items-center gap-2 mb-2 text-steam-blue">
                    <Sparkles size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Featured Partner</span>
                </div>
                <h3 className="text-white font-black text-xl mb-4 leading-tight">
                    Checkout this amazing offer
                </h3>
                <button className="w-full py-3 bg-steam-blue text-black font-black uppercase text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 group-hover:bg-steam-deepBlue transition-colors">
                    Visit Site <ExternalLink size={14} />
                </button>
            </div>
        </motion.div>
    );
};

export default Banner;
