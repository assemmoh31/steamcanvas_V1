
import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Send, 
  Twitter, 
  Video, 
  ChevronRight,
  LifeBuoy,
  Info,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactSupport: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1500);
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
            <LifeBuoy size={14} /> Support Center
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tight">Get in <span className="text-steam-blue">Touch</span></h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
            Have a question or running into an issue? Our human support team is here to help you get back to creating.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Form */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0b0c0f] border border-white/5 rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Mail size={200} />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-steam-blue/50 transition-all"
                          value={formState.name}
                          onChange={(e) => setFormState({...formState, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-steam-blue/50 transition-all"
                          value={formState.email}
                          onChange={(e) => setFormState({...formState, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Inquiry Category</label>
                      <select 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-steam-blue/50 transition-all appearance-none cursor-pointer"
                        value={formState.category}
                        onChange={(e) => setFormState({...formState, category: e.target.value})}
                      >
                        <option className="bg-[#0b0c0f]">General Inquiry</option>
                        <option className="bg-[#0b0c0f]">Technical Issue</option>
                        <option className="bg-[#0b0c0f]">Payment & Coins</option>
                        <option className="bg-[#0b0c0f]">Creator Verification</option>
                        <option className="bg-[#0b0c0f]">Reporting Theft</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                      <input 
                        required
                        type="text" 
                        placeholder="How can we help?"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-steam-blue/50 transition-all"
                        value={formState.subject}
                        onChange={(e) => setFormState({...formState, subject: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Message Detail</label>
                      <textarea 
                        required
                        placeholder="Please describe your issue in detail..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-steam-blue/50 transition-all min-h-[160px] resize-none"
                        value={formState.message}
                        onChange={(e) => setFormState({...formState, message: e.target.value})}
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-steam-blue hover:bg-steam-deepBlue text-black font-black text-[11px] uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-steam-blue/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <><Send size={16} /> Send Message</>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/5 border border-green-500/20 rounded-[40px] p-20 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Message Received!</h2>
                  <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. A copy of your inquiry has been sent to your email. We'll be in touch shortly.
                  </p>
                  <button 
                    onClick={() => setIsSent(false)}
                    className="text-steam-blue font-black uppercase text-[10px] tracking-widest hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Info Panels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Status Widget */}
            <div className="bg-[#12141a] border border-white/5 rounded-3xl p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                    <Globe size={24} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-widest">Service Status</h3>
                  <p className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Systems: Online</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest leading-none">Global Latency</p>
                <p className="text-white font-mono text-sm font-bold mt-1">12ms</p>
              </div>
            </div>

            {/* Response Time & Hours */}
            <div className="bg-[#12141a] border border-white/5 rounded-[32px] p-8 space-y-10">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-steam-blue/10 rounded-xl text-steam-blue">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xs uppercase tracking-widest">Response Time</h3>
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      We usually reply within <span className="text-white font-bold">24–48 hours</span>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xs uppercase tracking-widest">Office Hours</h3>
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      Our moderation team is active from <span className="text-white font-bold">09:00 to 18:00 (CET)</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-6">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Alternative Methods</h3>
                
                <div className="space-y-4">
                  <a href="mailto:support@steamcanvas.art" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl group transition-all">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-steam-blue" />
                      <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Direct Email</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-600 group-hover:translate-x-1 transition-all" />
                  </a>
                  
                  <div className="flex gap-4">
                    <a href="#" className="flex-1 flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-[#1DA1F2] border border-white/5 rounded-2xl group transition-all">
                      <Twitter size={18} className="text-gray-400 group-hover:text-white" />
                      <span className="text-[10px] font-black text-gray-400 group-hover:text-white uppercase tracking-widest">X / Twitter</span>
                    </a>
                    <a href="#" className="flex-1 flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-black border border-white/5 rounded-2xl group transition-all">
                      <Video size={18} className="text-gray-400 group-hover:text-white" />
                      <span className="text-[10px] font-black text-gray-400 group-hover:text-white uppercase tracking-widest">TikTok</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-steam-blue/5 border border-steam-blue/20 rounded-3xl p-6 flex gap-4">
              <Info className="text-steam-blue shrink-0" size={20} />
              <div className="space-y-2">
                <h4 className="text-steam-blue font-black text-[10px] uppercase tracking-widest">Pro Tip</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  Check our <span className="text-steam-blue cursor-pointer hover:underline" onClick={() => setPage('help-center')}>Help Center</span> first! Most common questions are already answered there instantly.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
