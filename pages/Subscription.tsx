import React from 'react';
import { Check, Zap, Star, Shield, Crown, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionProps {
  setPage: (page: string) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ setPage }) => {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (planKey?: string) => {
    if (!planKey) return;

    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

      const res = await fetch(`${API_URL}/api/v1/payments/create-subscription-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan_name: planKey,
          billing_cycle: billingCycle
        })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start subscription: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      console.error(e);
      alert('Error starting subscription');
    }
  };

  const plans = [
    {
      name: 'Free Plan',
      price: '0',
      period: '/ month',
      description: 'For beginners & casual creators',
      color: 'gray',
      icon: <Shield size={24} />,
      features: [
        '3 GB Cloud Storage',
        'Marketplace Fee: 15%',
        'Upload Artworks & basic GIFs',
        'Short descriptions',
        'Standard moderation queue',
        'Limited weekly tool usage',
        'Basic stats (views, likes)',
        'No withdrawals until verified'
      ],
      buttonText: 'Current Plan',
      buttonClass: 'bg-white/5 border-white/10 text-gray-400 cursor-default'
    },
    {
      name: 'Creator Plan',
      planKey: 'CREATOR',
      price: billingCycle === 'monthly' ? '6.99' : '69.90',
      period: billingCycle === 'monthly' ? '/ month' : '/ year',
      saveText: billingCycle === 'yearly' ? 'Save €14 - Get 2 Months Free!' : null,
      description: 'For active sellers looking to grow',
      color: 'blue',
      icon: <Star size={24} />,
      features: [
        '50 GB Cloud Storage',
        'Marketplace Fee: 12%',
        'Long descriptions',
        'Upload High-Quality Videos',
        'Extra tools access',
        'Advanced Artwork Pages',
        'Profile customization',
        'Higher price limit',
        'Faster moderation'
      ],
      buttonText: 'Upgrade',
      buttonClass: 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
    },
    {
      name: 'Elite Plan',
      planKey: 'ELITE',
      price: billingCycle === 'monthly' ? '9.99' : '99.90',
      period: billingCycle === 'monthly' ? '/ month' : '/ year',
      saveText: billingCycle === 'yearly' ? 'Save €20 - Get 2 Months Free!' : null,
      description: 'The sweet spot for rising stars',
      color: 'cyan',
      popular: true,
      icon: <Award size={24} />,
      features: [
        '75 GB Cloud Storage',
        'Marketplace Fee: 11%',
        'All Creator features',
        'Verified Artist Badge',
        '1 Featured Listing / Month',
        'Custom Shop Categories',
        'Detailed Sales Analytics',
        'Priority Review Queue',
        'Early access to new tools'
      ],
      buttonText: 'Get Elite',
      buttonClass: 'bg-gradient-to-r from-steam-blue to-cyan-400 text-black shadow-[0_0_30px_rgba(102,252,241,0.3)] hover:shadow-[0_0_40px_rgba(102,252,241,0.5)]'
    },
    {
      name: 'Pro Plan',
      planKey: 'PRO',
      price: billingCycle === 'monthly' ? '19.99' : '199.90',
      period: billingCycle === 'monthly' ? '/ month' : '/ year',
      saveText: billingCycle === 'yearly' ? 'Save €40 - Get 2 Months Free!' : null,
      description: 'For serious professional creators',
      color: 'purple',
      icon: <Crown size={24} />,
      features: [
        '100 GB Cloud Storage',
        'Marketplace Fee: 10%',
        'Priority Moderation',
        'Dashboard priority rotation',
        'Advanced Market Data',
        'Priority 24/7 Support',
        'Maximum price limits',
        'Instant Withdrawals',
        'Dedicated Account Manager'
      ],
      buttonText: 'Go Pro',
      buttonClass: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.5)]'
    }
  ];



  return (
    <div className="min-h-screen pt-24 px-4 pb-20 max-w-[1400px] mx-auto">
      <div className="relative text-center mb-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-steam-blue/20 blur-[120px] rounded-full pointer-events-none opacity-20" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-steam-blue animate-pulse" />
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Pricing & Plans</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter"
        >
          Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-steam-blue to-cyan-400">Creative Empire</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-12"
        >
          Unlock the full potential of your studio with 0% fees, instant payouts, and powerful analytics tools designed for pros.
        </motion.p>

        {/* Toggle */}
        <div className="flex justify-center items-center gap-6">
          <span className={`text-sm font-bold uppercase tracking-widest transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
          <button
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            className="w-16 h-8 bg-white/10 rounded-full relative transition-colors hover:bg-white/20"
          >
            <motion.div
              animate={{ x: billingCycle === 'monthly' ? 4 : 36 }}
              className="absolute top-1 left-0 w-6 h-6 bg-steam-blue rounded-full shadow-lg"
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold uppercase tracking-widest transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>Yearly</span>
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20">-20%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className={`relative group rounded-[32px] transition-all duration-500 ${plan.popular ? 'xl:-mt-4 xl:mb-4 z-10' : ''
              }`}
          >
            <div className={`
              absolute inset-0 rounded-[32px] transition-opacity duration-500 blur-xl opacity-0 group-hover:opacity-100
              ${plan.color === 'cyan' ? 'bg-steam-blue/20' :
                plan.color === 'purple' ? 'bg-purple-600/20' :
                  plan.color === 'blue' ? 'bg-blue-600/20' : 'bg-white/5'}
            `} />

            <div className={`
              relative h-full flex flex-col p-8 rounded-[32px] border backdrop-blur-xl transition-all duration-300
              ${plan.popular
                ? 'bg-[#12141a]/90 border-steam-blue/50 shadow-[0_0_50px_-12px_rgba(102,252,241,0.2)]'
                : 'bg-[#12141a]/60 border-white/5 hover:border-white/10 hover:bg-[#12141a]/80'}
            `}>

              {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <div className="bg-gradient-to-r from-steam-blue to-cyan-400 text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg shadow-steam-blue/20">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
                  ${plan.color === 'cyan' ? 'bg-gradient-to-br from-steam-blue to-cyan-600 shadow-lg shadow-steam-blue/20' :
                    plan.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/20' :
                      plan.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20' :
                        'bg-white/10'}
                `}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{plan.name}</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-400 text-xl font-bold">€</span>
                  <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">{plan.price}</span>
                </div>
                <div className="flex flex-col mt-1">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{plan.period}</p>
                  {plan.saveText && (
                    <p className="text-[10px] font-bold text-green-400 mt-1">{plan.saveText}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1 rounded-full shrink-0 ${plan.popular ? 'bg-steam-blue/20 text-steam-blue' : 'bg-white/10 text-gray-400'
                      }`}>
                      <Check size={10} strokeWidth={4} />
                    </div>
                    <span className={`text-sm font-medium leading-tight ${plan.popular ? 'text-gray-200' : 'text-gray-400'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan.planKey)}
                disabled={!plan.planKey}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all duration-300 transform group-hover:translate-y-[-2px] ${plan.buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {plan.buttonText}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-16">
        <div className="flex gap-5">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center text-steam-blue">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Revenue Growth</h4>
            <p className="text-sm text-gray-200 leading-relaxed">Lower fees on Elite and Pro plans ensure you keep more of every Art Coin earned through sales.</p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center text-steam-blue">
            <Star size={20} />
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Priority Status</h4>
            <p className="text-sm text-gray-200 leading-relaxed">Higher tier members get faster moderation review, moving their creations to the market in hours, not days.</p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center text-steam-blue">
            <Shield size={20} />
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Secure Payouts</h4>
            <p className="text-sm text-gray-200 leading-relaxed">Pro members enjoy instant withdrawal capabilities to PayPal and bank accounts for immediate cash flow.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;