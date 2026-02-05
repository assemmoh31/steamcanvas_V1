import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Check, Zap, Crown, Star, Sparkles, ShieldCheck } from 'lucide-react';

const COIN_PACKS = [
    {
        id: 'STARTER',
        name: 'Starter Pack',
        price: 5.99,
        coins: 500,
        bonus: 0,
        features: ['Instant Delivery', 'Basic Support'],
        icon: Coins,
        color: '#94a3b8' // Slate-400
    },
    {
        id: 'POPULAR',
        name: 'Popular Pack',
        price: 11.99,
        coins: 1100,
        bonus: 100,
        features: ['Most Common Choice', 'Instant Delivery', 'Priority Support'],
        popular: true,
        icon: Star,
        color: '#38bdf8' // Sky-400
    },
    {
        id: 'PRO',
        name: 'Pro Pack',
        price: 26.99,
        coins: 2750,
        bonus: 250,
        features: ['Great for Collectors', 'Instant Delivery', 'Priority Support'],
        bestValue: true,
        icon: Zap,
        color: '#a855f7' // Purple-500
    },
    {
        id: 'COLLECTOR',
        name: 'Collector Pack',
        price: 54.99,
        coins: 6000,
        bonus: 1000,
        features: ['Huge Savings', 'Instant Delivery', 'VIP Support'],
        icon: Crown,
        color: '#f59e0b' // Amber-500
    },
    {
        id: 'MASTER',
        name: 'Master Pack',
        price: 99.99,
        coins: 12000,
        bonus: 2000,
        features: ['Maximum Value', 'Instant Delivery', 'VIP Support', 'Profile Badge'],
        godTier: true,
        icon: Sparkles,
        color: '#ef4444' // Red-500
    }
];

const CoinShop: React.FC = () => {
    const [loading, setLoading] = useState<string | null>(null);

    const handleBuy = async (packId: string) => {
        setLoading(packId);
        try {
            const token = localStorage.getItem('token'); // Assuming JWT is stored here
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8787'}/api/v1/payments/create-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ pack_name: packId })
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Failed to initiate checkout. Please try again.');
                setLoading(null);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred. Please try again.');
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#060709] text-gray-200 font-sans selection:bg-white selection:text-black py-20 px-4 md:px-8">

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-16 text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-black uppercase tracking-widest mb-4"
                >
                    <Sparkles size={14} /> Premium Currency
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black text-white tracking-tight"
                >
                    Top Up Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Wallet</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed"
                >
                    Purchase Art Coins (AC) to buy exclusive profiles, showcase artworks, and support your favorite creators on SteamCanvas.
                </motion.p>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {COIN_PACKS.map((pack, index) => (
                    <motion.div
                        key={pack.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className={`relative flex flex-col p-6 rounded-3xl border backdrop-blur-md transition-all duration-300 group
              ${pack.godTier
                                ? 'bg-gradient-to-b from-red-500/20 to-red-900/10 border-red-500/50 ring-1 ring-red-500/30'
                                : pack.popular || pack.bestValue
                                    ? `bg-[#1a1d26] border-${pack.color.replace('#', '')}/50 ring-1 ring-${pack.color.replace('#', '')}/30`
                                    : 'bg-[#16181d] border-white/10 hover:border-white/20'
                            }
            `}
                        style={{
                            borderColor: (pack.popular || pack.bestValue) ? pack.color : undefined,
                            boxShadow: pack.godTier ? '0 20px 40px -10px rgba(239, 68, 68, 0.4)' : (pack.popular || pack.bestValue) ? `0 20px 40px -10px ${pack.color}40` : '0 10px 30px -10px rgba(0,0,0,0.5)'
                        }}
                    >
                        {/* Badges */}
                        {pack.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-white/10 z-10">
                                Most Popular
                            </div>
                        )}
                        {pack.bestValue && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-white/10 z-10">
                                Best Value
                            </div>
                        )}
                        {pack.godTier && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-white/10 animate-pulse z-10">
                                Ultimate
                            </div>
                        )}

                        {/* Icon */}
                        <div className="mb-6 mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-inner">
                            <pack.icon size={40} style={{ color: pack.color }} />
                        </div>

                        {/* Content */}
                        <div className="text-center space-y-2 mb-8">
                            <h3 className="text-white font-black text-xl uppercase tracking-wider">{pack.name}</h3>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-4xl font-black text-white drop-shadow-md">{pack.coins.toLocaleString()}</span>
                                <span className="text-sm font-black text-yellow-500 uppercase tracking-widest">AC</span>
                            </div>
                            {pack.bonus > 0 && (
                                <div className="inline-block px-3 py-1 rounded bg-green-500/20 text-green-400 text-[11px] font-black uppercase tracking-widest border border-green-500/20">
                                    +{pack.bonus.toLocaleString()} Bonus
                                </div>
                            )}
                        </div>

                        {/* Features */}
                        <div className="space-y-4 mb-8 flex-grow bg-black/20 p-4 rounded-2xl border border-white/5">
                            {pack.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs text-gray-300 font-bold">
                                    <div className="p-1 rounded-full bg-green-500/20">
                                        <Check size={10} className="text-green-500 flex-shrink-0" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Price & Action */}
                        <div className="mt-auto space-y-4">
                            <div className="text-center">
                                <span className="text-3xl font-black text-white tracking-tight">€{pack.price}</span>
                            </div>

                            <button
                                onClick={() => handleBuy(pack.id)}
                                disabled={loading !== null}
                                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-[0.15em] transition-all shadow-xl
                  ${pack.godTier
                                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                                        : 'bg-white text-black hover:bg-gray-200 shadow-white/10'
                                    }
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
                `}
                            >
                                {loading === pack.id ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <span>Purchase</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-1.5 opacity-40">
                            <ShieldCheck size={12} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Secure Checkout</span>
                        </div>

                    </motion.div>
                ))}
            </div>

            {/* Footer Note */}
            <div className="mt-16 text-center">
                <p className="text-xs text-gray-500 font-medium">
                    Payments are processed securely via Stripe. SteamCanvas does not store your card details.
                </p>
            </div>

        </div>
    );
};

export default CoinShop;
