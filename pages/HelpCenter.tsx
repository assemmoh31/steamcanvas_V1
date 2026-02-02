
import React, { useState } from 'react';
import { 
  Coins, 
  Palette, 
  Wrench, 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  HelpCircle, 
  AlertCircle, 
  ChevronDown,
  Info,
  Zap,
  Ban,
  Gamepad2,
  FileWarning,
  MessageSquare,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

interface HelpCenterProps {
  setPage: (page: string) => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ setPage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories: FAQCategory[] = [
    {
      id: 'coins',
      title: 'Coins & Payments',
      icon: <Coins size={20} className="text-yellow-400" />,
      items: [
        {
          id: 'c1',
          question: 'How do I get SteamCanvas Coins?',
          answer: 'Coins are the lifeblood of our marketplace. You can buy them via Stripe using any major Credit or Debit card. The current exchange rate is fixed at 100 Coins = €1.00.'
        },
        {
          id: 'c2',
          question: 'Can I get a refund for my Coins?',
          answer: 'Generally, no. Coin purchases are final once used or after 14 days. We cannot offer refunds on coins that have already been spent to support a creator or purchase a design.'
        },
        {
          id: 'c3',
          question: 'Why is there a 15% fee?',
          answer: 'This fee is essential for our survival. It covers Stripe’s transaction costs, high-performance hosting via Cloudflare, and our 24/7 manual moderation team that reviews every single upload to keep the site safe from scammers.'
        },
        {
          id: 'c4',
          question: 'Can I sell my Coins back for real money?',
          answer: 'Only Verified Creators can withdraw earnings (CC). Regular users can only use Art Coins (AC) to purchase designs, upgrade their account, or tip creators. Regular accounts cannot cash out AC.'
        }
      ]
    },
    {
      id: 'creators',
      title: 'For Creators',
      icon: <Palette size={20} className="text-steam-blue" />,
      items: [
        {
          id: 'cr1',
          question: 'How long does it take for my art to be approved?',
          answer: 'To protect original artists, every design is manually reviewed. This process typically takes up to 24 hours. You will get a notification as soon as your artwork is Live.'
        },
        {
          id: 'cr2',
          question: 'Why was my artwork rejected?',
          answer: 'Rejections usually happen for three reasons: 1. Nudity or +18 content (we are SFW), 2. Stolen art from other creators, or 3. Low quality (blurry files or bad crops).'
        },
        {
          id: 'cr3',
          question: 'How do I withdraw my earnings?',
          answer: 'Once your "Creator Coins" (CC) balance reaches 5,000, you can request a payout. We currently process withdrawals via PayPal and Bank Transfer on a weekly basis.'
        },
        {
          id: 'cr4',
          question: 'Can I sell AI-generated art?',
          answer: 'SteamCanvas is a marketplace for digital craftsmanship. In 2026, AI-generated art must be explicitly tagged as such. Any creator caught hiding AI use as "Handmade" will be permanently banned.'
        }
      ]
    },
    {
      id: 'tech',
      title: 'Technical Help',
      icon: <Wrench size={20} className="text-purple-400" />,
      items: [
        {
          id: 't1',
          question: 'How do I upload "Long" artwork to Steam?',
          answer: (
            <div className="space-y-3">
              <p>Steam has a hidden height limit. To bypass it, you must use a console command during upload. We highly recommend using our One-Click Uploader tool which does this for you automatically.</p>
              <button onClick={() => setPage('tools')} className="text-steam-blue font-black uppercase text-[10px] tracking-widest flex items-center gap-1 hover:underline">
                Open Uploader Tool <ArrowRight size={12} />
              </button>
            </div>
          )
        },
        {
          id: 't2',
          question: "Why can't I see my Artwork Showcase?",
          answer: "Answer: You must be at least Steam Level 10 to unlock your first showcase. For every 10 levels you gain, you get 1 extra showcase slot. If you are Level 0-9, the showcase option will not appear in your Steam settings."
        },
        {
          id: 't3',
          question: 'How do I get a second Artwork Showcase?',
          answer: "Answer: You can either reach Steam Level 20 or buy an 'Additional Showcase' from the Steam Points Shop for 3,000-6,000 points."
        },
        {
          id: 't4',
          question: 'Why is there a gap between my artwork and the side panel?',
          answer: "Answer: This usually happens if you haven't used the 'Long Image' console code during upload. Make sure to use our One-Click Uploader to fix the alignment automatically."
        },
        {
          id: 't5',
          question: 'Why does my animated GIF look blurry or pixelated?',
          answer: "Answer: Steam compresses every file you upload. To minimize this, keep your file size under 5MB. Avoid 'Red' gradients, as Steam's compression algorithm is extremely aggressive on red colors."
        },
        {
          id: 't6',
          question: 'How do I make my profile transparent?',
          answer: "Answer: You need to purchase a 'Special Profile' from the Points Shop (like the Dying Light 2 or Hades themes). These are the only official ways to see your background through the profile boxes."
        },
        {
          id: 't7',
          question: 'Why are my animations not moving in the Steam Client?',
          answer: "Answer: Check your Steam settings: Settings > Accessibility > Enable Animated Avatars & Frames. Also, ensure Windows 'Animation Effects' are turned ON in your PC's Accessibility settings."
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Safety',
      icon: <ShieldCheck size={20} className="text-red-400" />,
      items: [
        {
          id: 'sc1',
          question: 'Is my Steam account safe?',
          answer: "Absolutely. We use Steam OpenID for login. This means we never see your password—Steam just tells us your account ID. Your credentials never leave Valve's servers."
        },
        {
          id: 'sc2',
          question: 'Can I get banned for using your One-Click Uploader?',
          answer: "Answer: No. Our tool uses a standard browser extension method to help you upload images you already own. It does not modify Steam's core files or violate the Subscriber Agreement."
        },
        {
          id: 'sc3',
          question: 'What if someone stole my art and is selling it here?',
          answer: "Answer: Use the 'Report Artwork' button immediately. We take art theft very seriously and will ban the offender and refund any buyers using our manual review logs."
        },
        {
          id: 'sc4',
          question: 'What happens if I buy art and the creator deletes their account?',
          answer: "Answer: Don't worry! Once you purchase an artwork, a copy is stored in your SteamCanvas Library. Even if the creator leaves, your purchase is safe."
        }
      ]
    }
  ];

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for sticky headers
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(cat => cat.items.length > 0);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#060709] pt-28 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-20 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-steam-blue/10 border border-steam-blue/20 rounded-full text-[10px] font-black uppercase tracking-widest text-steam-blue"
          >
            <HelpCircle size={14} /> Knowledge Base
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tight">How can we <span className="text-steam-blue">help?</span></h1>
          
          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-steam-blue transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search for answers (e.g. 'Long artwork', 'Refunds')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#12141a] border border-white/5 rounded-3xl py-6 pl-16 pr-6 text-white text-lg focus:outline-none focus:border-steam-blue/50 transition-all shadow-2xl"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 space-y-2">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4">Categories</h3>
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => scrollToCategory(cat.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-gray-400 hover:text-white group text-left"
                >
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">{cat.title}</span>
                </button>
              ))}
              <div className="pt-8 border-t border-white/5 mt-8 ml-4 space-y-4">
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Still stuck?</p>
                 <button className="flex items-center gap-2 text-steam-blue text-[10px] font-black uppercase tracking-widest hover:underline">
                    <MessageSquare size={14} /> Live Support
                 </button>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-9 space-y-24">
            {filteredCategories.length > 0 ? filteredCategories.map(cat => (
              <section key={cat.id} id={cat.id} className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">{cat.title}</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Official Guidelines</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {cat.items.map(item => (
                    <div 
                      key={item.id} 
                      className={`group border transition-all duration-300 rounded-[24px] ${expandedId === item.id ? 'bg-[#12141a] border-white/10 shadow-2xl' : 'bg-[#0b0c0f] border-white/5 hover:border-white/10'}`}
                    >
                      <button 
                        onClick={() => toggleExpand(item.id)}
                        className="w-full text-left px-8 py-6 flex items-center justify-between gap-6"
                      >
                        <h4 className={`text-sm font-bold transition-colors ${expandedId === item.id ? 'text-steam-blue' : 'text-white'}`}>
                          {item.question}
                        </h4>
                        <div className={`p-2 rounded-lg transition-all ${expandedId === item.id ? 'bg-steam-blue text-black rotate-180' : 'bg-white/5 text-gray-500'}`}>
                          <ChevronDown size={16} />
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedId === item.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-8 pb-8 pt-2 text-gray-300 text-sm leading-relaxed border-t border-white/5 mt-2">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </section>
            )) : (
              <div className="py-20 text-center">
                 <AlertCircle size={48} className="text-white/10 mx-auto mb-6" />
                 <h3 className="text-xl font-black text-white mb-2">No answers found</h3>
                 <p className="text-gray-500">Try searching for broader terms like 'coins' or 'steam'.</p>
              </div>
            )}

            {/* Bottom Contact Card */}
            <div className="bg-gradient-to-br from-steam-blue/10 to-transparent border border-steam-blue/20 rounded-[40px] p-12 text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <HelpCircle size={160} className="text-steam-blue" />
               </div>
               <h3 className="text-3xl font-black text-white mb-4">Didn't find your answer?</h3>
               <p className="text-gray-400 mb-8 max-w-md mx-auto">Our human support team is available 24/7 for urgent technical or payment issues.</p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="px-10 py-4 bg-steam-blue text-black font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl shadow-steam-blue/20 transition-all hover:scale-105 active:scale-95">
                    Open Support Ticket
                  </button>
                  <button className="px-10 py-4 bg-white/5 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    Email Support
                  </button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
