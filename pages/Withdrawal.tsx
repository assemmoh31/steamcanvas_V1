import React, { useState } from 'react';
import { User } from '../types';
import { ArrowLeft, DollarSign, Building, Bitcoin, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface WithdrawalProps {
  user: User;
  setPage: (page: string) => void;
}

const Withdrawal: React.FC<WithdrawalProps> = ({ user, setPage }) => {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'paypal' | 'bank' | 'crypto'>('paypal');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mock conversion: 100 CC = 0.70 EUR (70% revenue share to creator)
  const RATE = 0.007; 
  const maxAmount = user.creatorCoins;
  const numericAmount = parseInt(amount) || 0;
  const estimatedPayout = (numericAmount * RATE).toFixed(2);

  const handleWithdraw = () => {
    if (numericAmount > maxAmount || numericAmount <= 0) return;
    setProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
    }, 2000);
  };

  if (success) {
      return (
          <div className="min-h-screen pt-24 px-4 max-w-2xl mx-auto text-center">
              <div className="bg-[#1c1e26] border border-green-500/20 rounded-2xl p-12">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Withdrawal Requested</h2>
                  <p className="text-gray-400 mb-8">Your request for <span className="text-white font-bold">{numericAmount.toLocaleString()} CC (€{estimatedPayout})</span> has been submitted. Funds typically arrive within 24-48 hours.</p>
                  <button 
                    onClick={() => setPage('wallet')}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors border border-white/10"
                  >
                      Return to Wallet
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto pb-20">
      <button 
        onClick={() => setPage('wallet')} 
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Wallet
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Form */}
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Withdraw Earnings</h1>
            <p className="text-gray-400 mb-8">Convert your Creator Coins into real cash.</p>

            <div className="space-y-8">
                {/* Method Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Payout Method</label>
                    <div className="grid grid-cols-3 gap-3">
                        <button 
                            onClick={() => setMethod('paypal')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${method === 'paypal' ? 'bg-blue-600/10 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-[#1c1e26] border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                            <DollarSign size={24} className="mb-2" />
                            <span className="text-xs font-bold">PayPal</span>
                        </button>
                        <button 
                            onClick={() => setMethod('bank')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${method === 'bank' ? 'bg-blue-600/10 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-[#1c1e26] border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                            <Building size={24} className="mb-2" />
                            <span className="text-xs font-bold">Bank</span>
                        </button>
                        <button 
                            onClick={() => setMethod('crypto')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${method === 'crypto' ? 'bg-blue-600/10 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-[#1c1e26] border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                            <Bitcoin size={24} className="mb-2" />
                            <span className="text-xs font-bold">Crypto</span>
                        </button>
                    </div>
                </div>

                {/* Amount Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Amount to Withdraw (CC)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-[#1c1e26] border border-white/10 rounded-lg py-4 pl-4 pr-20 text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                            placeholder="0"
                        />
                        <button 
                            onClick={() => setAmount(maxAmount.toString())}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-400 hover:text-blue-300 uppercase px-2 py-1 rounded hover:bg-blue-500/10 transition-colors"
                        >
                            Max
                        </button>
                    </div>
                    <div className="flex justify-between text-sm mt-3 px-1">
                        <span className="text-gray-500">Available Balance: <span className="text-gray-300">{maxAmount.toLocaleString()} CC</span></span>
                        {numericAmount > 0 && <span className="text-blue-400 font-medium animate-pulse">Est. Payout: €{estimatedPayout}</span>}
                    </div>
                </div>

                {/* Account Details (Mock) */}
                <div className="bg-[#1c1e26] p-5 rounded-lg border border-white/5">
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">
                        {method === 'paypal' ? 'PayPal Email Address' : method === 'bank' ? 'IBAN Number' : 'Wallet Address (ETH/BTC)'}
                    </label>
                    <input 
                        type="text" 
                        className="w-full bg-transparent border-none text-white focus:ring-0 p-0 placeholder:text-gray-600 font-mono"
                        placeholder={method === 'paypal' ? 'user@example.com' : 'Enter details...'}
                        defaultValue={method === 'paypal' ? user.username.toLowerCase() + '@gmail.com' : ''}
                    />
                </div>

                {/* Submit */}
                <button 
                    onClick={handleWithdraw}
                    disabled={processing || numericAmount <= 0 || numericAmount > maxAmount}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
                >
                    {processing ? <Loader2 className="animate-spin" /> : 'Confirm Withdrawal'}
                </button>
            </div>
        </div>

        {/* Right: Summary / Info */}
        <div className="h-fit">
            <div className="bg-[#16181d] p-8 rounded-2xl border border-white/5 mb-6">
                <h3 className="text-lg font-bold text-white mb-6">Transaction Summary</h3>
                
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Withdrawal Amount</span>
                        <span className="text-white font-mono">{numericAmount.toLocaleString()} CC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Conversion Rate</span>
                        <span className="text-gray-400">100 CC = €0.70</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Platform Fee</span>
                        <span className="text-green-400">0% (Silver Tier)</span>
                    </div>
                    <div className="h-px bg-white/10 my-4"></div>
                    <div className="flex justify-between items-end">
                        <span className="text-gray-300 font-medium">Total Payout</span>
                        <span className="text-3xl font-bold text-blue-400">€{estimatedPayout}</span>
                    </div>
                </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-5 flex gap-4">
                <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={20} />
                <div className="space-y-2">
                    <h4 className="text-blue-300 font-bold text-sm">Important Information</h4>
                    <p className="text-xs text-blue-200/70 leading-relaxed">
                        • Withdrawals are manually reviewed for security.<br/>
                        • Funds typically arrive within 24-48 hours.<br/>
                        • Ensure your payment details are correct to avoid delays.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;