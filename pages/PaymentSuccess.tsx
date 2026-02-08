import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Wallet } from 'lucide-react';

const PaymentSuccess: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => {
    const [dots, setDots] = useState('');
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Animation for dots
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        // Verify Payment
        const verifyPayment = async () => {
            const params = new URLSearchParams(window.location.search);
            const sessionId = params.get('session_id');

            if (!sessionId) {
                setStatus('error');
                setErrorMessage('No session ID found.');
                return;
            }

            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/v1/payments/verify-session?session_id=${sessionId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (data.success) {
                    setStatus('success');
                } else {
                    // If still pending, retry after delay?
                    if (data.status === 'open' || data.status === 'pending') {
                        setTimeout(verifyPayment, 2000); // Retry in 2s
                    } else {
                        setStatus('error');
                        setErrorMessage(`Payment failed or invalid status: ${data.status}`);
                    }
                }
            } catch (err: any) {
                console.error('Verification error:', err);
                // Retry on network error?
                setTimeout(verifyPayment, 3000);
            }
        };

        verifyPayment();

        return () => clearInterval(interval);
    }, []);

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-[#060709] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#1a1d26] border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl">
                    <h1 className="text-2xl font-black text-red-500 mb-2">Something went wrong</h1>
                    <p className="text-gray-400 text-sm mb-6">{errorMessage}</p>
                    <button onClick={() => setPage('wallet')} className="px-6 py-2 bg-white/10 rounded-lg text-white font-bold">Back to Wallet</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060709] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-[#1a1d26] border border-green-500/20 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400" />

                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} className={`text-green-500 ${status === 'verifying' ? 'animate-pulse' : ''}`} />
                </div>

                <h1 className="text-3xl font-black text-white mb-2">
                    {status === 'verifying' ? 'Verifying Payment...' : 'Payment Successful!'}
                </h1>
                <p className="text-gray-400 text-sm font-medium mb-8">
                    {status === 'verifying'
                        ? `Please wait while we confirm your transaction${dots}`
                        : 'Your coins have been added to your wallet!'}
                </p>

                {status === 'success' && (
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                window.history.replaceState({}, '', '/');
                                setPage('wallet');
                            }}
                            className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <Wallet size={18} /> Go to Wallet
                        </button>

                        <button
                            onClick={() => {
                                window.history.replaceState({}, '', '/');
                                setPage('marketplace');
                            }}
                            className="w-full py-4 bg-white/5 text-gray-300 hover:text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
