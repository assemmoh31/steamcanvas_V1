
import React from 'react';
import { 
  Scale, 
  Clock, 
  Coins, 
  ShieldCheck, 
  FileText, 
  Users, 
  Bot, 
  AlertTriangle, 
  Globe, 
  ChevronLeft,
  Stamp,
  CheckCircle2,
  Lock,
  Gavel,
  BrainCircuit,
  Euro,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TOSSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const TOSSection: React.FC<TOSSectionProps> = ({ icon, title, children }) => (
  <section className="p-8 bg-[#12141a] border border-white/5 rounded-[32px] space-y-4 hover:border-white/10 transition-all">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2.5 rounded-xl bg-steam-blue/10 text-steam-blue border border-steam-blue/20">
        {icon}
      </div>
      <h2 className="text-xl font-black text-white uppercase tracking-tight">{title}</h2>
    </div>
    <div className="text-gray-400 text-sm leading-relaxed space-y-4 font-medium">
      {children}
    </div>
  </section>
);

const TermsOfService: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => {
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
            <Scale size={40} />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight italic">
            Terms of <span className="text-steam-blue">Service</span>
          </h1>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <Clock size={14} className="text-gray-500" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Last Updated: <span className="text-white">February 1, 2026</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          <TOSSection icon={<FileText size={20} />} title="1. Agreement Overview">
            <p>
              Welcome to <strong>SteamCanvas</strong>. By accessing our platform, you agree to be bound by these Terms of Service. This document governs your relationship with the marketplace, creators, and our virtual economy. If you do not agree, please discontinue use immediately.
            </p>
          </TOSSection>

          <TOSSection icon={<Coins size={20} />} title="2. Virtual Currency & Platform Fees">
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>SteamCanvas Coins:</strong> All transactions use "Coins" (AC for Art Coins, CC for Creator Coins). These are virtual units with no cash value outside this platform.</li>
              <li><strong>The 15% Engine:</strong> To maintain high-performance servers (Cloudflare), secure payments (Stripe), and our 24/7 manual moderation team, SteamCanvas retains a <strong>15% commission</strong> on all marketplace sales.</li>
              <li><strong>Withdrawals:</strong> Only "Verified Creators" may withdraw their 85% share in real-world currency (EUR/USD) once they reach the minimum payout threshold defined in their dashboard.</li>
            </ul>
          </TOSSection>

          <TOSSection icon={<ShieldCheck size={20} />} title="3. Content Moderation (DSA 2026)">
            <p>Under the <strong>EU Digital Services Act</strong>, we follow strict moderation protocols:</p>
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>Manual Review:</strong> Every upload undergoes a manual check (up to 24h) to ensure high quality and prevent theft.</li>
              <li><strong>Prohibited Content:</strong> We strictly forbid Nudity (+18), hate speech, illegal assets, or content infringing on intellectual property.</li>
              <li><strong>Statement of Reasons:</strong> If your art is rejected or your account is restricted, we will provide a clear explanation. You have the right to appeal any decision through our Support Center.</li>
            </ul>
          </TOSSection>

          <TOSSection icon={<Stamp size={20} />} title="4. Intellectual Property">
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>Creator Warranty:</strong> By uploading, you swear you are the original author. If you use AI tools, you must use the "AI-Generated" tag.</li>
              <li><strong>License to Users:</strong> Buyers receive a personal, non-commercial license to display the art on their Steam Profile. They may not resell or redistribute the files.</li>
              <li><strong>Valve Disclaimer:</strong> SteamCanvas is <strong>not affiliated with Valve Corporation</strong>. Steam logos and game assets are the property of their respective owners.</li>
            </ul>
          </TOSSection>

          <TOSSection icon={<Lock size={20} />} title="5. Payments & Refunds">
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>Final Sale:</strong> Due to the digital nature of our products, all "Coin" purchases and marketplace transactions are non-refundable once the asset is unlocked or downloaded.</li>
              <li><strong>The Waiver:</strong> By purchasing and downloading a digital asset, the user expressly <strong>waives their right of withdrawal</strong> once the download or 'Use on Profile' process has begun.</li>
              <li><strong>Chargebacks:</strong> Any fraudulent chargebacks will result in an immediate permanent ban and the forfeiture of all items in your SteamCanvas library.</li>
            </ul>
          </TOSSection>

          <TOSSection icon={<Gavel size={20} />} title="6. Dispute Resolution">
            <p>SteamCanvas acts as a "Middleman" between buyers and sellers:</p>
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>Initial Resolution:</strong> If a buyer is unhappy with an artwork, they must first attempt to resolve the issue with the creator directly via our messaging system.</li>
              <li><strong>Mediation:</strong> SteamCanvas acts as a final judge only if the two parties cannot agree.</li>
              <li><strong>Escalation:</strong> If we find a creator was "scamming" (e.g., selling low-res files as high-res), we reserve the right to force a refund from their CC balance.</li>
            </ul>
          </TOSSection>

          <TOSSection icon={<BrainCircuit size={20} />} title="7. AI-Generated Content Policy">
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>Mandatory Tagging:</strong> Any artwork created using AI (Midjourney, Stable Diffusion, etc.) <strong>must</strong> be tagged as "AI-Generated" during upload.</li>
              <li><strong>Ban for Deception:</strong> If a creator sells AI art as "hand-drawn" to charge a premium, they will be permanently banned for consumer deception and potential fraud.</li>
            </ul>
          </TOSSection>

          <TOSSection icon={<UserCheck size={20} />} title="8. Spanish Customer Service Law (10/2025)">
            <p>In compliance with 2025/2026 Spanish regulations:</p>
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>Response Time:</strong> We commit to responding to all formal complaints within <strong>24–48 hours</strong>.</li>
              <li><strong>Personalized Support:</strong> Users have the right to speak to a real person (Admin) if they are dissatisfied with an automated system decision. We do not use "purely automated" chatbots for complex disputes.</li>
            </ul>
          </TOSSection>

          <TOSSection icon={<Bot size={20} />} title="9. Anti-Scraping & Bot Protection">
            <p>To protect our creators' digital craftsmanship:</p>
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>Data Theft:</strong> We strictly prohibit the use of bots or AI-crawlers to "scrape" images from our site for any purpose, including training AI models or reposting.</li>
              <li><strong>Enforcement:</strong> We use advanced rate-limiting and fingerprinting. Violators will face legal action under IP protection laws.</li>
            </ul>
          </TOSSection>

          <TOSSection icon={<Globe size={20} />} title="10. Privacy & Data">
            <p>
              Your privacy is governed by our <strong>Privacy Policy (GDPR)</strong>. We only collect data necessary for Steam OpenID authentication, transaction security, and local legal compliance.
            </p>
          </TOSSection>

        </div>

        {/* Footer of the page */}
        <div className="mt-20 pt-12 border-t border-white/5 text-center space-y-6">
          <p className="text-gray-500 text-xs font-medium">
            By continuing to use SteamCanvas, you acknowledge that you have read and understood these terms.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setPage('home')}
              className="px-8 py-3 bg-steam-blue text-black font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-steam-blue/10 transition-all hover:scale-105 active:scale-95"
            >
              I Accept & Continue
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TermsOfService;
