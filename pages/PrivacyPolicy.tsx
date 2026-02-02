
import React from 'react';
import { 
  Shield, 
  Clock, 
  Database, 
  Fingerprint, 
  CreditCard, 
  Sparkles, 
  Activity, 
  Cookie, 
  Globe, 
  Mail, 
  ChevronLeft,
  Lock,
  Eye,
  Scale,
  Cloud,
  FileSearch,
  CheckCircle2,
  // Added missing Info import
  Info
} from 'lucide-react';

interface PrivacySectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({ icon, title, children }) => (
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

const PrivacyPolicy: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => {
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
            <Shield size={40} />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight italic">
            Privacy <span className="text-steam-blue">Policy</span>
          </h1>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <Clock size={14} className="text-gray-500" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Effective Date: <span className="text-white">February 1, 2026</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          <PrivacySection icon={<Scale size={20} />} title="1. Introduction">
            <p>
              Welcome to <strong>SteamCanvas</strong>. We respect your privacy and are committed to protecting your personal data in accordance with the <strong>EU General Data Protection Regulation (GDPR)</strong> and Spanish organic law <strong>LOPDGDD</strong>. This policy explains how we handle your information when you interact with our digital marketplace.
            </p>
          </PrivacySection>

          <PrivacySection icon={<Database size={20} />} title="2. Data We Collect">
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-steam-blue h-fit"><Fingerprint size={16} /></div>
                <div>
                  <p className="text-white font-bold mb-1">Via Steam OpenID</p>
                  <p>When you log in, we receive your SteamID64, public persona name, and avatar URL. We <strong>do not</strong> access your email, password, or private Steam data.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-yellow-400 h-fit"><Activity size={16} /></div>
                <div>
                  <p className="text-white font-bold mb-1">Transaction Data</p>
                  <p>When you buy or sell art, we collect records of "Coin" balances (AC/CC) and transaction history to ensure economy integrity.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-green-400 h-fit"><CreditCard size={16} /></div>
                <div>
                  <p className="text-white font-bold mb-1">Payment Data</p>
                  <p>All credit card payments are handled by <strong>Stripe</strong>. We do not store your full card numbers or sensitive financial details on our servers.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-purple-400 h-fit"><Sparkles size={16} /></div>
                <div>
                  <p className="text-white font-bold mb-1">AI Indicators</p>
                  <p>If you are a creator, we store your self-reported data regarding the use of AI tools in your artwork to maintain transparency.</p>
                </div>
              </li>
            </ul>
          </PrivacySection>

          <PrivacySection icon={<FileSearch size={20} />} title="3. How We Use Your Data">
            <p>We use your information strictly to:</p>
            <ul className="space-y-3 list-disc pl-5">
              <li>Manage your profile and digital marketplace library.</li>
              <li>Calculate and process the 15% platform commission on sales.</li>
              <li>Verify your identity to prevent the sale of stolen artwork and protect intellectual property.</li>
              <li>Comply with Spanish tax, accounting, and financial reporting laws.</li>
            </ul>
          </PrivacySection>

          <PrivacySection icon={<Cookie size={20} />} title="4. Cookies & Tracking">
            <p>
              We use "Essential Cookies" to keep you logged in and preserve your session security. In 2026, we follow the <strong>ePrivacy Directive</strong> strictly:
            </p>
            <ul className="space-y-3 list-disc pl-5">
              <li>We do not use "Tracking Pixels" for advertising without your explicit consent.</li>
              <li>Our cookie banner allows you to manage non-essential preferences at any time.</li>
              <li>Session tokens are encrypted and cleared upon logout.</li>
            </ul>
          </PrivacySection>

          <PrivacySection icon={<Cloud size={20} />} title="5. Data Security & Transfers">
            <p>
              Your data is stored on secure, encrypted servers managed by <strong>Cloudflare</strong>. As we are based in Spain, your data is primarily processed within the EU.
            </p>
            <p>
              If data is transferred outside the European Economic Area (EEA), we ensure it is protected by <strong>Standard Contractual Clauses (SCCs)</strong> or equivalent adequacy decisions to maintain the same level of protection guaranteed by the GDPR.
            </p>
          </PrivacySection>

          <PrivacySection icon={<Mail size={20} />} title="6. Contact & Authority">
            <p>
              For any data requests, including the right to access, rectify, or erase your data, please contact our Data Protection Officer at: <strong>support@steamcanvas.art</strong>.
            </p>
            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
              <Info size={18} className="text-steam-blue shrink-0 mt-0.5" />
              <p className="text-xs">
                You also have the right to lodge a complaint with the <strong>Agencia Española de Protección de Datos (AEPD)</strong> if you feel your rights have been violated.
              </p>
            </div>
          </PrivacySection>

        </div>

        {/* Footer of the page */}
        <div className="mt-20 pt-12 border-t border-white/5 text-center space-y-6">
          <p className="text-gray-500 text-xs font-medium">
            Your trust is our priority. Thank you for choosing SteamCanvas.
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

export default PrivacyPolicy;
