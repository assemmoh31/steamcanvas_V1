import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Wallet, Save, CreditCard, ChevronRight, AlertTriangle, Eye, EyeOff, Lock, Monitor, Smartphone, Globe } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsProps {
  user: UserType;
  setPage: (page: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, setPage }) => {
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'billing'>('account');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [email, setEmail] = useState('user@example.com'); // Ideally from user object
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [isPublicProfile, setIsPublicProfile] = useState(true);
  const [showInventory, setShowInventory] = useState(true);

  const [savedCards, setSavedCards] = useState([
    { id: 1, type: 'Visa', last4: '4242', exp: '12/28' }
  ]);

  // Warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
    alert("Settings saved successfully!");
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
    { id: 'billing', label: 'Billing', icon: <Wallet size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <User className="text-steam-blue" size={20} /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    value={user.username}
                    disabled
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-gray-500">Managed via Steam Login</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setHasChanges(true); }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-steam-blue/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Lock className="text-red-400" size={20} /> Security
              </h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-steam-blue/50 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setHasChanges(true); }}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-steam-blue/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-400 mt-1">Protect your account with an extra layer of security.</p>
                  </div>
                  <button
                    onClick={() => { setTwoFactorEnabled(!twoFactorEnabled); setHasChanges(true); }}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${twoFactorEnabled ? 'bg-steam-blue' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Globe className="text-blue-400" size={20} /> Connected Accounts
              </h3>
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#171a21] rounded flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" className="w-6 h-6" alt="Steam" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Steam</p>
                    <p className="text-xs text-gray-500">Connected as {user.username}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-green-500/20">Connected</span>
              </div>
            </section>
          </motion.div>
        );

      case 'privacy':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Eye className="text-purple-400" size={20} /> Visibility Settings
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-white font-bold">Public Profile</h4>
                    <p className="text-sm text-gray-400 mt-1">Allow other users to see your profile and collections.</p>
                  </div>
                  <button
                    onClick={() => { setIsPublicProfile(!isPublicProfile); setHasChanges(true); }}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isPublicProfile ? 'bg-steam-blue' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-md ${isPublicProfile ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-white font-bold">Show Inventory</h4>
                    <p className="text-sm text-gray-400 mt-1">Display your SteamCanvas item inventory on your profile.</p>
                  </div>
                  <button
                    onClick={() => { setShowInventory(!showInventory); setHasChanges(true); }}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${showInventory ? 'bg-steam-blue' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-md ${showInventory ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Monitor className="text-gray-400" size={20} /> Active Sessions
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-steam-blue">
                      <Monitor size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold">Windows PC - Chrome</p>
                      <p className="text-xs text-green-500 font-bold">Active Now • Istanbul, TR</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors">Current</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold">iPhone 13 - Safari</p>
                      <p className="text-xs text-gray-500">Last active 2 days ago • Istanbul, TR</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-red-400 uppercase tracking-wider hover:text-red-300 transition-colors">Revoke</button>
                </div>
              </div>
            </section>
          </motion.div>
        );

      case 'billing':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-steam-blue/20 to-blue-600/10 border border-steam-blue/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-steam-blue uppercase tracking-widest mb-1">Total Balance</p>
                  <h2 className="text-4xl font-black text-white">{user.purchaseCoins.toLocaleString()} <span className="text-lg text-gray-400 font-bold">AC</span></h2>
                </div>
                <button onClick={() => setPage('purchase-coins')} className="bg-steam-blue/10 hover:bg-steam-blue/20 text-steam-blue border border-steam-blue/50 px-6 py-2 rounded-full font-bold transition-all hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                  Add Funds
                </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-steam-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard className="text-yellow-400" size={20} /> Payment Methods
              </h3>

              <div className="space-y-3">
                {savedCards.map(card => (
                  <div key={card.id} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 group hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-white font-bold text-xs border border-white/10">
                        {card.type}
                      </div>
                      <div>
                        <p className="text-white font-bold">•••• •••• •••• {card.last4}</p>
                        <p className="text-xs text-gray-500">Expires {card.exp}</p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-red-400 transition-colors p-2">
                      <AlertTriangle size={16} />
                    </button>
                  </div>
                ))}

                <button className="w-full py-4 border border-dashed border-white/10 rounded-xl text-gray-400 font-bold hover:text-steam-blue hover:border-steam-blue/30 hover:bg-steam-blue/5 transition-all flex items-center justify-center gap-2">
                  <CreditCard size={18} /> Add New Payment Method
                </button>
              </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Billing History</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="text-white font-bold">1000 AC Pack</span>
                      <span className="text-gray-500 text-xs">Jan {20 - i}, 2026</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white font-mono">$9.99</span>
                      <button className="text-steam-blue hover:underline text-xs font-bold uppercase">Invoice</button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setPage('transaction-history')} className="w-full text-center text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest mt-4">View All Transactions</button>
              </div>
            </section>

          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#060709] pt-24 pb-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-[#12141a] border border-white/5 rounded-2xl p-2 sticky top-24">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    // Check for user before confirming, to be safe (though component expects user)
                    if (hasChanges && !confirm("You have unsaved changes. Discard them?")) return;
                    setActiveTab(tab.id as any);
                    setHasChanges(false);
                  }}
                  // Fix: Added key directly to button, though map already provides it. 
                  // To be cleaner, we can remove the key here if it's already in the map call (it is).
                  // Correcting logic: The 'key' IS required here.
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 ${activeTab === tab.id ? 'bg-steam-blue/10 text-steam-blue shadow-[0_0_15px_rgba(0,229,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-wide">Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your account preferences</p>
              </div>

              <AnimatePresence>
                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-yellow-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                      <AlertTriangle size={14} /> Unsaved Changes
                    </span>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-steam-blue hover:bg-[#33c9dc] text-black px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-steam-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-[#12141a] border border-white/5 rounded-3xl p-8 min-h-[600px] relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-steam-blue/5 rounded-full blur-[120px] pointer-events-none" />

              <AnimatePresence mode="wait">
                {renderContent()}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
