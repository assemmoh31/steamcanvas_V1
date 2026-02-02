import React, { useState } from 'react';
import { Check, Shield, CreditCard, Loader2, ArrowLeft } from 'lucide-react';
import { addFunds } from '../services/mockApi';

interface CoinPurchaseProps {
  setPage: (page: string) => void;
  refreshUser: () => void;
}

const packs = [
  { price: 5, coins: 500, label: 'Starter' },
  { price: 10, coins: 1000, label: 'Standard' },
  { price: 20, coins: 2000, label: 'Popular', popular: true },
  { price: 35, coins: 3500, label: 'Pro' },
  { price: 50, coins: 5000, label: 'Ultimate' },
];

const CoinPurchase: React.FC<CoinPurchaseProps> = ({ setPage, refreshUser }) => {
  const [processing, setProcessing] = useState<number | null>(null);

  const handlePurchase = async (price: number, coins: number) => {
    setProcessing(price);
    // Simulate API call
    await addFunds(coins);
    setProcessing(null);
    refreshUser();
    alert(`Successfully purchased ${coins} AC!`);
    setPage('wallet');
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-20 max-w-7xl mx-auto">
      <button 
        onClick={() => setPage('wallet')} 
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Wallet
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Top Up Your Wallet</h1>
        <p className="text-gray-400 text-lg">Secure instant delivery. <span className="text-steam-blue font-semibold">100 AC = €1.00</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {packs.map((pack) => (
          <div 
            key={pack.price}
            className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${
              pack.popular 
                ? 'bg-[#161b22] border-steam-blue shadow-[0_0_30px_rgba(102,252,241,0.15)] z-10 scale-105' 
                : 'bg-[#0f1115] border-white/5 hover:border-white/10'
            }`}
          >
            {pack.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-steam-blue text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Best Value
              </div>
            )}

            <div className="mb-6 text-center">
              <h3 className={`text-sm font-bold uppercase tracking-widest mb-2 ${pack.popular ? 'text-steam-blue' : 'text-gray-500'}`}>
                {pack.label}
              </h3>
              <div className="flex items-center justify-center gap-1 text-white">
                <span className="text-3xl font-bold">{pack.coins.toLocaleString()}</span>
                <span className="text-sm font-medium text-gray-400">AC</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <div className="p-1 rounded-full bg-green-500/10 text-green-400"><Check size={12} /></div>
                <span>Instant Delivery</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <div className="p-1 rounded-full bg-green-500/10 text-green-400"><Check size={12} /></div>
                <span>Secure Payment</span>
              </li>
              {pack.popular && (
                <li className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="p-1 rounded-full bg-steam-blue/10 text-steam-blue"><Check size={12} /></div>
                    <span>Bonus Badge</span>
                </li>
              )}
            </ul>

            <button
              onClick={() => handlePurchase(pack.price, pack.coins)}
              disabled={processing !== null}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                pack.popular
                  ? 'bg-steam-blue hover:bg-steam-deepBlue text-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {processing === pack.price ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>€{pack.price.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center text-center text-gray-500 text-sm max-w-2xl mx-auto">
        <div className="flex gap-6 mb-4">
            <div className="flex items-center gap-2">
                <Shield size={16} /> SSL Encrypted
            </div>
            <div className="flex items-center gap-2">
                <CreditCard size={16} /> Stripe / PayPal
            </div>
        </div>
        <p>
            By purchasing coins, you agree to our Terms of Service. Coins are non-refundable and can only be used within the SteamCanvas ecosystem to support creators.
        </p>
      </div>
    </div>
  );
};

export default CoinPurchase;