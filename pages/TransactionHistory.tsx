
import React, { useState, useEffect } from 'react';
import {
  History,
  ArrowLeft,
  Undo2,
  Info,
  CheckCircle2,
  Clock,
  Wallet,
  Download,
  X,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  // Fix: Added missing Loader2 import
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction, TransactionType } from '../types';
import { getTransactions } from '../services/mockApi';

interface TransactionHistoryProps {
  setPage: (page: string) => void;
  onTransactionUpdate?: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ setPage, onTransactionUpdate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'deposits' | 'withdrawals'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // For logic, assume "today" is Feb 1, 2026 for consistency with legal pages
  const CURRENT_DATE = new Date('2026-02-01T12:00:00Z');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      const response = await fetch(`${API_URL}/api/v1/user/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Parse dates correctly
        setTransactions(data.map((tx: any) => ({
          ...tx,
          date: new Date(tx.created_at), // Ensure Date object
          itemName: tx.type === 'DEPOSIT' ? 'Coin Deposit' : 'Item Purchase'
        })));
      }
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const isEligibleForRefund = (tx: Transaction) => {
    if (tx.type !== TransactionType.DEPOSIT) return false;
    if (tx.status !== 'COMPLETED') return false; // Ensure status matches backend 'COMPLETED'

    // Backend also handles balance check, but we can verify date here
    const txDate = new Date(tx.date);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));

    return diffDays <= 14;
  };

  const handleRefundClick = (tx: Transaction) => {
    setSelectedTx(tx);
    setShowConfirmModal(true);
  };

  const confirmRefund = async () => {
    if (!selectedTx) return;

    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

      const response = await fetch(`${API_URL}/api/v1/payments/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transactionId: selectedTx.id })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Refund request submitted successfully! Your funds will be returned.");
        setShowConfirmModal(false);
        setSelectedTx(null);
        fetchTransactions(); // Refresh list to show REFUNDED status
        if (onTransactionUpdate) onTransactionUpdate(); // Refresh global user state (balance)
      } else {
        alert(`Refund Failed: ${result.details || result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Refund Error:', error);
      alert('Failed to process refund. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#060709] pt-28 pb-32">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setPage('wallet')}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <History className="text-steam-blue" size={28} />
                Transaction <span className="text-steam-blue">History</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">EU 2026 Compliance • Easy Withdrawal</p>
            </div>
          </div>
          <div className="px-6 py-3 bg-steam-blue/5 border border-steam-blue/10 rounded-2xl flex items-center gap-3">
            <ShieldCheck size={18} className="text-steam-blue" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Safe • Verified • Secure</span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-10 p-6 bg-[#12141a] border border-white/5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-steam-blue/10 flex items-center justify-center text-steam-blue shrink-0">
              <Info size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Consumer Rights Acknowledgement</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xl">In compliance with the 2026 DSA, unused digital credits can be refunded within 14 days. Once credits are spent on marketplace assets, the right of withdrawal is waived.</p>
            </div>
          </div>
          <button
            onClick={() => setPage('refund-policy')}
            className="text-[10px] font-black text-steam-blue uppercase tracking-widest hover:underline"
          >
            Read Refund Policy
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-[#12141a] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-steam-blue" size={32} />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Accessing Ledger...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/40 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/5">
                  <tr>
                    <th className="px-8 py-6">Type & Item</th>
                    <th className="px-8 py-6">Transaction ID</th>
                    <th className="px-8 py-6">Amount</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl border ${tx.type === TransactionType.DEPOSIT ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 'bg-steam-blue/10 border-steam-blue/20 text-steam-blue'}`}>
                            {tx.type === TransactionType.DEPOSIT ? <Wallet size={18} /> : <Download size={18} />}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{tx.itemName}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-gray-500 font-mono text-xs">{tx.id}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-sm font-black font-mono ${tx.type === TransactionType.DEPOSIT ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.type === TransactionType.DEPOSIT ? '+' : '-'}{tx.amount.toLocaleString()} AC
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'success' ? 'bg-green-500' :
                            tx.status === 'pending' ? 'bg-yellow-500' :
                              tx.status === 'refunded' ? 'bg-blue-500' : 'bg-red-500'
                            }`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'success' ? 'text-green-400' :
                            tx.status === 'pending' ? 'text-yellow-400' :
                              tx.status === 'refunded' ? 'text-blue-400' : 'text-red-400'
                            }`}>
                            {tx.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {isEligibleForRefund(tx) ? (
                          <button
                            onClick={() => handleRefundClick(tx)}
                            className="px-4 py-2 bg-steam-blue text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-steam-blue/10"
                          >
                            Withdraw Purchase
                          </button>
                        ) : tx.type === TransactionType.DEPOSIT && tx.status === 'success' ? (
                          <div className="group/i relative inline-block">
                            <div className="p-2 text-gray-600 hover:text-white transition-colors cursor-help">
                              <Info size={16} />
                            </div>
                            <div className="absolute right-0 bottom-full mb-3 w-48 p-3 bg-black border border-white/10 rounded-xl text-[10px] font-medium text-gray-300 leading-relaxed opacity-0 invisible group-hover/i:opacity-100 group-hover/i:visible transition-all shadow-2xl z-50">
                              {tx.isUsed ? "Right of withdrawal waived because coins were used." : "Withdrawal period (14 days) has expired."}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Final Sale</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-green-500" /> SECURE LEDGER PROTECTED BY SHA-256 ENCRYPTION
          </p>
        </div>
      </div>

      {/* Refund Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedTx && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0b0c0f] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden p-10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-[24px] bg-steam-blue/10 border border-steam-blue/20 flex items-center justify-center text-steam-blue mb-8">
                <Undo2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-4">Request Withdrawal?</h2>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl mb-8 w-full">
                <p className="text-gray-300 text-sm leading-relaxed">
                  You are requesting a full refund of <span className="text-steam-blue font-black">{selectedTx.amount} AC</span>. By clicking confirm, your Coins will be removed, and the funds will be returned to your original payment method.
                </p>
                <div className="mt-4 flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl text-left">
                  <Clock size={18} className="text-yellow-500 shrink-0" />
                  <p className="text-[10px] text-yellow-500/80 font-bold uppercase tracking-widest leading-normal">
                    Please note: This process can take up to 15 business days depending on your bank.
                  </p>
                </div>
              </div>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={confirmRefund}
                  className="w-full py-4 bg-steam-blue hover:bg-steam-deepBlue text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-steam-blue/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirm Withdrawal
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TransactionHistory;
