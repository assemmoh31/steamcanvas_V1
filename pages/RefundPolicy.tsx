
import React from 'react';
import { 
  Undo2, 
  Clock, 
  Coins, 
  ImageIcon, 
  ShieldCheck, 
  AlertCircle, 
  MousePointer2, 
  CreditCard, 
  Mail, 
  ChevronLeft,
  CheckCircle2,
  Gavel,
  History,
  Scale
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RefundSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const RefundSection: React.FC<RefundSectionProps> = ({ icon, title, children }) => (
  <section className="p-8 bg-[#12141a] border border-white/5 rounded-[32px] space-y-4 hover:border-white/10 transition-all group">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2.5 rounded-xl bg-steam-blue/10 text-steam-blue border border-steam-blue/20 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h2 className="text-xl font-black text-white uppercase tracking-tight">{title}</h2>
    </div>
    <div className="text-gray-400 text-sm leading-relaxed space-y-4 font-medium">
      {children}
    </div>
  </section>
);

const RefundPolicy: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => {
  return (
    <div className="min-h-screen bg-[#060709] pt-28 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
          <button 
            onClick={() => setPage('home')}
            className="group flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-all mb-4"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <div className="p-4 rounded-3xl bg-steam-blue/10 text-steam-blue border border-steam-blue/20 mb-2">
            <Undo2 size={40} />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight italic">
            Refund & <span className="text-steam-blue">Withdrawal</span>
          </h1>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <Clock size={14} className="text-gray-500" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Last Updated: <span className="text-white">February 1, 2026</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm max-w-2xl font-medium leading-relaxed italic">
            "At SteamCanvas, we want you to be happy with your profile's new look. Because we deal with digital 'instant-access' goods, our refund policy follows specific European consumer protection rules."
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          <RefundSection icon={<Scale size={20} />} title="1. Right of Withdrawal">
            <p>Under EU law, you have the right to withdraw from a purchase within 14 days without giving any reason. However, the application of this right depends on whether you have used the product:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-yellow-400 font-black text-[10px] uppercase tracking-widest">
                  <Coins size={12} /> A. Virtual Currency
                </div>
                <p className="text-xs"><strong>Refundable:</strong> Full refund for any unused Coin bundle within 14 days.</p>
                <p className="text-xs text-gray-500 italic"><strong>Waiver:</strong> If you spend any portion of a bundle, the right to a refund is waived.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-steam-blue font-black text-[10px] uppercase tracking-widest">
                  <ImageIcon size={12} /> B. Digital Artwork
                </div>
                <p className="text-xs"><strong>Instant Performance:</strong> Clicking 'Download' or 'Apply to Profile' requests immediate performance.</p>
                <p className="text-xs text-gray-500 italic"><strong>Waiver:</strong> Accessing the file waives your 14-day right. No 'Buyer's Remorse' refunds.</p>
              </div>
            </div>
          </RefundSection>

          <RefundSection icon={<ShieldCheck size={20} />} title="2. Defective Goods & Legal Guarantee">
            <p>While "Buyer's Remorse" is not covered for digital art, your consumer rights are protected if the product is faulty:</p>
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>Lack of Conformity:</strong> If the artwork file is corrupted, does not match the preview, or the 'One-Click Uploader' fails, you are entitled to a repair (file fix) or a full refund of Coins.</li>
              <li><strong>2-Year Guarantee:</strong> Under Spanish law (2026), digital content is covered by a legal guarantee of conformity for a period of 2 years from the date of purchase.</li>
            </ul>
          </RefundSection>

          <RefundSection icon={<MousePointer2 size={20} />} title="3. How to Request a Refund">
            <p>We’ve made the process simple and transparent to meet the June 2026 EU "Easy Withdrawal" standards:</p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-steam-blue h-fit"><History size={16} /></div>
                <div>
                  <p className="text-white font-bold mb-1">The Withdrawal Button</p>
                  <p>Go to your Transaction History. Eligible, unused Coin purchases feature a "Withdraw Purchase" button for automated Stripe/PayPal refunds.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-purple-400 h-fit"><Mail size={16} /></div>
                <div>
                  <p className="text-white font-bold mb-1">Manual Support</p>
                  <p>If an artwork is defective, use the Contact Support page and select "Topic: Refund Request."</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-green-400 h-fit"><Clock size={16} /></div>
                <div>
                  <p className="text-white font-bold mb-1">Processing Time</p>
                  <p>Approved refunds process immediately. Banks may take 5–10 business days to reflect the funds in your account.</p>
                </div>
              </li>
            </ul>
          </RefundSection>

          <RefundSection icon={<AlertCircle size={20} />} title="4. Abuse of Policy">
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex gap-4">
              <Gavel size={24} className="text-red-500 shrink-0" />
              <p className="text-xs leading-relaxed">
                To protect our Creators, users who frequently purchase and then "Chargeback" transactions through their bank without contacting support will be <strong>permanently banned</strong>. Their SteamCanvas library will be locked, and their "Verified" status will be revoked.
              </p>
            </div>
          </RefundSection>

          <RefundSection icon={<Mail size={20} />} title="5. Contact Us">
            <p>For questions regarding your rights or a specific transaction, please reach out to our legal compliance team:</p>
            <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-steam-blue/10 flex items-center justify-center text-steam-blue">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-bold text-white">support@steamcanvas.com</span>
              </div>
              <button onClick={() => setPage('contact-support')} className="text-[10px] font-black text-steam-blue uppercase tracking-widest hover:underline">Open Ticket</button>
            </div>
          </RefundSection>

        </div>

        {/* Footer of the page */}
        <div className="mt-20 pt-12 border-t border-white/5 text-center space-y-6">
          <p className="text-gray-500 text-xs font-medium">
            By purchasing digital assets on this platform, you acknowledge these refund conditions.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setPage('home')}
              className="px-8 py-3 bg-steam-blue text-black font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-steam-blue/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> I Understand
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RefundPolicy;
