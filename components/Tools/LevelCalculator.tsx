import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, TrendingUp, Users, Wallet, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Constants ---
const DEFAULT_SET_PRICE = 0.25; // USD

const LevelCalculator: React.FC = () => {
    // --- State ---
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [targetLevel, setTargetLevel] = useState<number>(0);
    const [currentXP, setCurrentXP] = useState<number>(0); // XP into current level
    const [setPrice, setSetPrice] = useState<number>(DEFAULT_SET_PRICE);

    // --- Helpers ---
    // Steam XP Logic:
    // Levels 1-10: 100 XP per level
    // Levels 11-20: 200 XP per level
    // Levels 21-30: 300 XP per level
    // ...
    // Formula for total XP to reach level L:
    // This is a summation series.
    // 100 * (L/10) * ((L/10) + 1) / 2 * 10?? No, that's complex.
    // Let's use the explicit bracket logic or the known formula.
    // Known formula for total XP to reach level L (where L is multiple of 10? No).
    // Let's use a function to calculate total accumulative XP for any level.

    const calculateTotalXPForLevel = (level: number): number => {
        if (level <= 0) return 0;
        let total = 0;
        // Calculate based on tens
        // 1-10 needs 1000xp total (100 each)
        // 11-20 needs 2000xp total (200 each)
        // Logic: For every 10 levels, cost increases by 100.
        // Level 0 -> 1: 100XP. Level 10 -> 11: 200XP.

        // Easier approach: Calculate cost for each bracket full 10s, then remainder.
        // Actually simpler formula: 
        // XP = 100 * (Level) * (Level + 1) / 2  <-- This is for simple linear. Steam is step linear.

        // Correct Steam Algo:
        // Level 0-10: 100xp/level. Total 1000.
        // Level 10-20: 200xp/level. Total 2000.
        // XP(Level) = 0.5 * Level * (Level + 1) * 10? No.

        // Let's stick to a loop for accuracy up to reasonable limits (e.g. 5000), it's fast enough for JS.
        // Or analytical:
        // Cost(L) = 100 * ceil(L/10) ?? No.
        // Cost to go from L-1 to L = 100 * (floor((L-1)/10) + 1)

        for (let i = 1; i <= level; i++) {
            const costForThisLevel = 100 * (Math.floor((i - 1) / 10) + 1);
            total += costForThisLevel;
        }
        return total;
    };

    // XP required for NEXT level (for valid input check)
    const xpToNextLevel = (level: number) => {
        return 100 * (Math.floor(level / 10) + 1);
    };

    // --- Calculations ---
    const stats = useMemo(() => {
        // 1. Validation
        const safeCurrent = Math.max(0, currentLevel);
        const safeTarget = Math.max(safeCurrent, targetLevel);

        // 2. XP Math
        const totalXPCurrentBase = calculateTotalXPForLevel(safeCurrent);
        const trueCurrentXP = totalXPCurrentBase + currentXP;
        const totalXPTarget = calculateTotalXPForLevel(safeTarget);

        let xpNeeded = totalXPTarget - trueCurrentXP;
        if (xpNeeded < 0) xpNeeded = 0;

        // 3. Asset Math
        // Standard Badge = 100 XP
        const setsNeeded = Math.ceil(xpNeeded / 100);
        const estimatedCost = setsNeeded * setPrice;

        // 4. Rewards
        // Showcases: +1 every 10 levels
        const currentShowcases = Math.floor(safeCurrent / 10);
        const targetShowcases = Math.floor(safeTarget / 10);
        const newShowcases = Math.max(0, targetShowcases - currentShowcases);

        // Friends: +5 per level (Base cap is 250, but let's just show delta)
        const newFriendSlots = (safeTarget - safeCurrent) * 5;

        // Booster Chance: +20% every 10 levels
        const currentBoosterMod = Math.floor(safeCurrent / 10) * 20;
        const targetBoosterMod = Math.floor(safeTarget / 10) * 20;
        const boosterIncrease = Math.max(0, targetBoosterMod - currentBoosterMod);

        return {
            xpNeeded,
            setsNeeded,
            estimatedCost,
            newShowcases,
            newFriendSlots,
            boosterIncrease,
            progressPercent: (trueCurrentXP / totalXPTarget) * 100
        };
    }, [currentLevel, targetLevel, currentXP, setPrice]);


    return (
        <div className="w-full max-w-6xl mx-auto p-4 lg:p-8 space-y-12">

            {/* Header */}
            <div className="text-center space-y-4">
                <h2 className="text-5xl font-black italic text-white tracking-tighter uppercase relative inline-block">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 pr-2">
                        Steam Level Calculator
                    </span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Plan your ascension. Calculate the exact XP, badges, and cost required to reach your dream Steam level.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: Inputs Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#151921] rounded-2xl border border-white/10 p-6 space-y-8">

                        {/* Current Status */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-white font-bold border-b border-white/10 pb-2">
                                <TrendingUp className="text-cyan-400" size={20} />
                                <h3>Current Status</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Level</label>
                                    <input
                                        type="number"
                                        value={currentLevel}
                                        onChange={(e) => setCurrentLevel(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Current XP</label>
                                    <input
                                        type="number"
                                        value={currentXP}
                                        onChange={(e) => setCurrentXP(Math.max(0, parseInt(e.target.value) || 0))}
                                        placeholder={`Max ${xpToNextLevel(currentLevel)}`}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Target */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-white font-bold border-b border-white/10 pb-2">
                                <Trophy className="text-yellow-400" size={20} />
                                <h3>Target Goal</h3>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Target Level</label>
                                <div className="flex gap-2 w-full overflow-hidden">
                                    <input
                                        type="number"
                                        value={targetLevel}
                                        onChange={(e) => setTargetLevel(Math.max(currentLevel, parseInt(e.target.value) || 0))}
                                        className="flex-1 w-0 min-w-0 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-yellow-500 outline-none text-xl font-bold"
                                    />
                                    {[10, 50, 100].map(step => (
                                        <button
                                            key={step}
                                            type="button"
                                            onClick={() => setTargetLevel(curr => curr + step)}
                                            className="bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 font-bold transition-colors flex items-center justify-center min-w-[36px] px-2"
                                        >
                                            +{step}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Economics */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-white font-bold border-b border-white/10 pb-2">
                                <Wallet className="text-green-400" size={20} />
                                <h3>Economy</h3>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Avg. Set Price ($)</label>
                                    <span className="text-xs text-gray-400">Default: ${DEFAULT_SET_PRICE}</span>
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={setPrice}
                                    onChange={(e) => setSetPrice(Math.max(0.01, parseFloat(e.target.value) || 0))}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-green-500 outline-none"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Pro Tip */}
                    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-4 border border-purple-500/20">
                        <div className="flex items-start gap-3">
                            <ShoppingBag className="text-purple-400 flex-shrink-0 mt-1" size={18} />
                            <div>
                                <h4 className="text-sm font-bold text-purple-200 mb-1">Cheapest Method?</h4>
                                <p className="text-xs text-purple-300/80 leading-relaxed">
                                    Don't forget the <b>Seasonal Badge</b> in the Points Shop! It grants up to 4,000 XP/year (40 levels worth for beginners) just for using points.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: High-End Dashboard */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Main Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            label="XP Required"
                            value={stats.xpNeeded.toLocaleString()}
                            icon={<TrendingUp size={24} className="text-cyan-400" />}
                            subtext="Total Experience"
                        />
                        <StatCard
                            label="Sets Needed"
                            value={stats.setsNeeded.toLocaleString()}
                            icon={<ShoppingBag size={24} className="text-purple-400" />}
                            subtext="Standard Badges"
                        />
                        <StatCard
                            label="Est. Cost"
                            value={`$${stats.estimatedCost.toFixed(2)}`}
                            icon={<Wallet size={24} className="text-green-400" />}
                            subtext="Investment"
                            highlight
                        />
                    </div>

                    {/* Progress Visualizer */}
                    <div className="bg-[#151921] rounded-2xl border border-white/10 p-8 space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-xl font-bold text-white">Level Progression</h3>
                                <p className="text-sm text-gray-500">Visualizing the gap between {currentLevel} and {targetLevel}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black text-white">{stats.progressPercent < 100 ? stats.progressPercent.toFixed(1) : 100}%</span>
                            </div>
                        </div>

                        {/* The Bar */}
                        <div className="h-6 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                            {/* Background Stripes */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 20px)' }}></div>

                            {/* Fill */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (currentLevel / targetLevel) * 100)}%` }} // Visual approximation based on levels, not XP, for better UX feel? Or stick to XP?
                                // Let's use XP for accuracy as requested:
                                // animate={{ width: `${Math.min(100, (trueCurrentXP / totalXPTarget) * 100)}%` }} -> Wait, that's complex since state is derived. 
                                // Let's use the calculated percentage.
                                style={{ width: `${Math.min(100, stats.progressPercent)}%` }}
                                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 relative"
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[2px]"></div>
                            </motion.div>
                        </div>

                        <div className="flex justify-between text-xs font-mono text-gray-500">
                            <span>Lvl {currentLevel}</span>
                            <span>Lvl {Math.floor((currentLevel + targetLevel) / 2)}</span>
                            <span>Lvl {targetLevel}</span>
                        </div>
                    </div>

                    {/* Rewards Grid */}
                    <div className="bg-[#151921] rounded-2xl border border-white/10 p-8">
                        <h3 className="text-lg font-bold text-white mb-6">Rewards Unlocked</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <RewardItem
                                icon={<CheckCircle2 className="text-blue-400" />}
                                value={`+${stats.newShowcases}`}
                                label="Showcase Slots"
                                desc="Every 10 Levels"
                            />
                            <RewardItem
                                icon={<Users className="text-pink-400" />}
                                value={`+${stats.newFriendSlots}`}
                                label="Friend Slots"
                                desc="+5 Per Level"
                            />
                            <RewardItem
                                icon={<AlertCircle className="text-yellow-400" />}
                                value={`+${stats.boosterIncrease}%`}
                                label="Booster Odds"
                                desc="+20% Every 10 Levels"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- Sub-components ---

const StatCard = ({ label, value, icon, subtext, highlight = false }: { label: string, value: string, icon: React.ReactNode, subtext: string, highlight?: boolean }) => (
    <div className={`p-6 rounded-2xl border ${highlight ? 'bg-gradient-to-br from-[#1a2c38] to-[#151921] border-green-500/30' : 'bg-[#151921] border-white/10'} relative overflow-hidden group`}>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">{label}</span>
                <div className="p-2 bg-white/5 rounded-lg text-white group-hover:scale-110 transition-transform">{icon}</div>
            </div>
            <div className={`text-3xl font-black ${highlight ? 'text-green-400' : 'text-white'}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-1">{subtext}</div>
        </div>
        {highlight && <div className="absolute inset-0 bg-green-500/5 blur-xl"></div>}
    </div>
);

const RewardItem = ({ icon, value, label, desc }: { icon: React.ReactNode, value: string, label: string, desc: string }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
        <div className="p-3 bg-white/5 rounded-full">
            {icon}
        </div>
        <div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm font-bold text-gray-300">{label}</div>
            <div className="text-xs text-gray-500">{desc}</div>
        </div>
    </div>
)

export default LevelCalculator;
