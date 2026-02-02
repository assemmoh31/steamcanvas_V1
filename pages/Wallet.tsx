
import React from 'react';
import { User } from '../types';
import { motion } from 'framer-motion';
import { ArrowRightLeft, CreditCard, Landmark, DollarSign, Download, Undo2 } from 'lucide-react';

interface WalletProps {
  user: User;
  setPage: (page: string) => void;
}

const Wallet: React.FC<WalletProps> = ({ user, setPage }) => {
  const [activeTab, setActiveTab] = React.useState<'purchase' | 'creator'>('purchase');

  return (
    <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">My Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Balances & Toggle */}
        <div className="md:col-span-2 space-y-6">
            
            {/* Toggle Tabs */}
            <div className="flex bg-[#1c1e26] p-1 rounded-lg w-fit">
                <button 
                    onClick={() => setActiveTab('purchase')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'purchase' ? 'bg-yellow-500/10 text-yellow-400 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                    Purchase Coins (AC)
                </button>
                <button 
                    onClick={() => setActiveTab('creator')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'creator' ? 'bg-blue-500/10 text-blue-400 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                    Creator Coins (CC)
                </button>
            </div>

            {/* Main Balance Card */}
            <motion.div 
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`relative overflow-hidden rounded-2xl p-8 border ${activeTab === 'purchase' ? 'border-yellow-500/20 bg-gradient-to-br from-[#2a2510] to-[#1c1e26]' : 'border-blue-500/20 bg-gradient-to-br from-[#101b2a] to-[#1c1e26]'}`}
            >
                {/* Glow Effect */}
                <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-20 ${activeTab === 'purchase' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>

                <div className="relative z-10">
                    <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Current Balance</p>
                    <div className="flex items-baseline gap-2 mb-6">
                        <span className={`text-5xl font-bold ${activeTab === 'purchase' ? 'text-yellow-400' : 'text-blue-400'}`}>
                            {activeTab === 'purchase' ? user.purchaseCoins.toLocaleString() : user.creatorCoins.toLocaleString()}
                        </span>
                        <span className="text-xl text-gray-500">{activeTab === 'purchase' ? 'AC' : 'CC'}</span>
                    </div>

                    <div className="flex gap-4">
                        {activeTab === 'purchase' ? (
                            <button 
                                onClick={() => setPage('purchase-coins')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors"
                            >
                                <CreditCard size={18} />
                                Buy Coins
                            </button>
                        ) : (
                            <button 
                                onClick={() => setPage('withdrawal')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                            >
                                <Landmark size={18} />
                                Withdraw Funds
                            </button>
                        )}
                        
                        {activeTab === 'creator' && (
                             <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 font-semibold rounded-lg border border-white/10 transition-colors">
                                <ArrowRightLeft size={18} />
                                Convert to AC
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* History Section (Mock) */}
            <div className="bg-[#12141a] rounded-xl border border-white/5 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Transaction History</h3>
                    <button 
                        onClick={() => setPage('transaction-history')}
                        className="flex items-center gap-2 px-4 py-1.5 bg-steam-blue/10 border border-steam-blue/20 text-steam-blue rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-steam-blue hover:text-black transition-all"
                    >
                        <Undo2 size={12} />
                        Refund / View All
                    </button>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${activeTab === 'purchase' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    {activeTab === 'purchase' ? <DollarSign size={16} /> : <Download size={16} />}
                                </div>
                                <div>
                                    <p className="text-gray-200 text-sm font-medium">{activeTab === 'purchase' ? 'Coin Package Purchase' : 'Artwork Sale: Neon City'}</p>
                                    <p className="text-gray-500 text-xs">Oct {10 + i}, 2023</p>
                                </div>
                            </div>
                            <span className={`text-sm font-mono ${activeTab === 'purchase' ? 'text-green-400' : 'text-blue-400'}`}>
                                +{activeTab === 'purchase' ? '500' : '150'} {activeTab === 'purchase' ? 'AC' : 'CC'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right: Info Panel */}
        <div className="space-y-6">
            <div className="bg-[#1c1e26] p-6 rounded-xl border border-white/5">
                <h3 className="text-white font-bold mb-2">About Economy</h3>
                <div className="space-y-4 text-sm text-gray-400">
                    <p>
                        <strong className="text-yellow-400">Art Coins (AC)</strong> are used to purchase profile designs. 100 AC = €1.00.
                    </p>
                    <p>
                        <strong className="text-blue-400">Creator Coins (CC)</strong> are earned from sales. They can be withdrawn to PayPal or converted to AC to buy other art.
                    </p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 rounded-xl border border-blue-500/20">
                <h3 className="text-blue-200 font-bold mb-2">Creator Tier</h3>
                <p className="text-gray-400 text-sm mb-4">You are currently a <span className="text-white">Silver</span> creator. Reach 10,000 CC to unlock Gold tier and lower fees.</p>
                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[45%]"></div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Wallet;
