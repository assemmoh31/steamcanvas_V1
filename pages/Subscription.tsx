import React from 'react';
import { Check, Zap, Star, Shield, Crown, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionProps {
  setPage: (page: string) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ setPage }) => {
  const plans = [
    {
      name: 'Free Plan',
      price: '0',
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
      buttonClass: 'bg-white/5 border-white/10 text-gray-200 cursor-default'
    },
    {
      name: 'Creator Plan',
      price: '6.99',
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
      price: '9.99',
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
        'Priority Review Queue'
      ],
      buttonText: 'Get Elite',
      buttonClass: 'bg-steam-blue hover:bg-steam-deepBlue text-black shadow-[0_0_20px_rgba(102,252,241,0.2)]'
    },
    {
      name: 'Pro Plan',
      price: '19.99',
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
        'Instant Withdrawals'
      ],
      buttonText: 'Go Pro',
      buttonClass: 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]'
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-20 max-w-[1400px] mx-auto">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 mb-6 rounded-full bg-steam-blue/10 border border-steam-blue/20 text-steam-blue text-xs font-black uppercase tracking-[0.2em]"
        >
          Creator Empowerment
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
        >
          Scale Your <span className="text-steam-blue">Studio</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-200 text-lg max-w-2xl mx-auto font-medium"
        >
          Choose the plan that fits your ambition. Lower fees and more storage mean more revenue for your craft.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className={`relative p-px rounded-[32px] transition-all duration-500 ${
              plan.popular ? 'bg-gradient-to-b from-steam-blue/50 via-steam-blue/20 to-transparent' : 'bg-white/5'
            }`}
          >
            <div className={`h-full rounded-[31px] p-6 md:p-8 flex flex-col ${
              plan.popular ? 'bg-[#0f1115]' : 'bg-[#0a0c10]'
            } border border-white/5`}>
              
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-steam-blue text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Best Value
                </div>
              )}

              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${
                  plan.color === 'blue' ? 'bg-blue-600/10 border-blue-600/20 text-blue-400' :
                  plan.color === 'cyan' ? 'bg-steam-blue/10 border-steam-blue/20 text-steam-blue' :
                  plan.color === 'purple' ? 'bg-purple-600/10 border-purple-600/20 text-purple-400' :
                  'bg-white/5 border-white/10 text-gray-200'
                }`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-1 tracking-tight">{plan.name}</h3>
                <p className="text-xs text-gray-300 leading-relaxed min-h-[32px] font-medium">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-300 text-lg font-bold">€</span>
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-300 font-bold uppercase tracking-widest text-[9px] ml-1">/ month</span>
                </div>
              </div>

              <div className="space-y-3 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 group">
                    <div className={`mt-1 p-0.5 rounded-full shrink-0 ${
                      plan.color === 'blue' ? 'text-blue-400' :
                      plan.color === 'cyan' ? 'text-steam-blue' :
                      plan.color === 'purple' ? 'text-purple-400' :
                      'text-gray-300'
                    }`}>
                      <Check size={12} />
                    </div>
                    <span className="text-[13px] text-gray-200 group-hover:text-white transition-colors line-clamp-2 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${plan.buttonClass}`}
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