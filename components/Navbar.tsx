import React from 'react';
import { User } from '../types';
import { Wallet, Menu, X, ShoppingBag, Bell, Plus, Star, Wrench, Compass, ShieldAlert, User as UserIcon, Layout, Settings, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  user: User | null;
  currentPage: string;
  setPage: (page: string) => void;
  onLogin: () => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, currentPage, setPage, onLogin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/5 transition-all duration-300">
      <div className="px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left Side: Logo + Nav Links anchored to the left */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setPage('home')}>
              <ShoppingBag className="w-8 h-8 text-steam-blue" />
              <span className="font-bold text-xl tracking-tight text-white">Steam<span className="text-steam-blue">Canvas</span></span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setPage('marketplace')}
                className={`${currentPage === 'marketplace' ? 'text-white border-b-2 border-steam-blue' : 'text-gray-400'} hover:text-steam-blue transition-all pb-1 text-xs font-bold uppercase tracking-widest`}
              >
                Marketplace
              </button>
              <button
                onClick={() => setPage('theme-finder')}
                className={`${currentPage === 'theme-finder' ? 'text-white border-b-2 border-steam-blue' : 'text-gray-400'} hover:text-steam-blue transition-all pb-1 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5`}
              >
                Themes
              </button>
              <button
                onClick={() => setPage('tools')}
                className={`${currentPage === 'tools' ? 'text-white border-b-2 border-steam-blue' : 'text-gray-400'} hover:text-steam-blue transition-all pb-1 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5`}
              >
                Tools
              </button>

              <button
                onClick={() => setPage('dashboard')}
                className={`${currentPage === 'dashboard' ? 'text-white border-b-2 border-steam-blue' : 'text-gray-400'} hover:text-steam-blue transition-all pb-1 text-xs font-bold uppercase tracking-widest`}
              >
                Creator Studio
              </button>

              <button
                onClick={() => setPage('subscription')}
                className={`${currentPage === 'subscription' ? 'text-steam-blue border-b-2 border-steam-blue' : 'text-gray-400'} hover:text-steam-blue transition-all pb-1 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5`}
              >
                <Star size={12} fill={currentPage === 'subscription' ? "currentColor" : "none"} />
                Pricing
              </button>
            </div>
          </div>

          {/* Right Side Cluster */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {/* User Status Group (Shifted Left) */}
                <div className="flex items-center gap-6 pr-4 border-r border-white/10">
                  {/* Notifications Icon */}
                  <button
                    onClick={() => setPage('notifications')}
                    className={`relative p-2 rounded-full transition-all group ${currentPage === 'notifications' ? 'text-steam-blue bg-steam-blue/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black group-hover:scale-125 transition-transform"></span>
                  </button>

                  {/* Wallet Pill */}
                  <div
                    onClick={() => setPage('wallet')}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col items-end leading-none">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Balance</span>
                      <span className="text-sm font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">{user.purchaseCoins.toLocaleString()} <span className="text-xs">AC</span></span>
                    </div>
                    <div className="w-px h-6 bg-white/10 mx-1"></div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Earnings</span>
                      <span className="text-sm font-bold text-creator-base group-hover:text-blue-400 transition-colors">{user.creatorCoins.toLocaleString()} <span className="text-xs">CC</span></span>
                    </div>
                    <Wallet className="w-5 h-5 text-gray-400 ml-1 group-hover:text-white" />
                  </div>

                  {/* User Dropdown Trigger */}
                  <div className="relative" ref={dropdownRef}>
                    <div
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="text-right hidden xl:block">
                        <div className="text-sm font-bold text-white group-hover:text-steam-blue transition-colors truncate max-w-[120px]">
                          {user.username}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest group-hover:text-gray-400 transition-colors">
                          {user.status || 'Member'}
                        </div>
                      </div>

                      <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 group-hover:border-steam-blue transition-all shadow-lg shadow-black/50 shrink-0">
                        <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                      </div>

                      <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-4 w-56 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl shadow-steam-blue/5 overflow-hidden ring-1 ring-white/5"
                        >
                          <div className="py-2">
                            <button
                              onClick={() => { setPage('profile'); setIsUserMenuOpen(false); }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                            >
                              <UserIcon size={16} />
                              My Profile
                            </button>
                            <button
                              onClick={() => { setPage('dashboard'); setIsUserMenuOpen(false); }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                            >
                              <Layout size={16} />
                              Creator Studio
                            </button>
                            <button
                              onClick={() => { setPage('settings'); setIsUserMenuOpen(false); }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                            >
                              <Settings size={16} />
                              Settings
                            </button>

                            <div className="h-px bg-white/10 my-2 mx-4"></div>

                            <button
                              onClick={() => {
                                if (onLogout) onLogout();
                                setIsUserMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-all"
                            >
                              <LogOut size={16} />
                              Log Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Upload Button */}
                <button
                  onClick={() => setPage('upload')}
                  className="flex items-center gap-2 bg-steam-blue/10 hover:bg-steam-blue/20 text-steam-blue px-4 py-1.5 rounded-full border border-steam-blue/30 text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(102,252,241,0.2)] group"
                >
                  <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                  Upload
                </button>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 bg-[#171a21] hover:bg-[#2a475e] text-[#c5c3c0] px-4 py-2 rounded font-bold transition-colors duration-200 border border-transparent hover:border-[#66c0f4]"
              >
                <span>Login with Steam</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-steam-dark border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              <button onClick={() => { setPage('marketplace'); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 w-full text-left">Marketplace</button>
              <button onClick={() => { setPage('theme-finder'); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/10 w-full text-left">Theme Finder</button>
              <button onClick={() => { setPage('tools'); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/10 w-full text-left">Tools</button>
              <button onClick={() => { setPage('dashboard'); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/10 w-full text-left">Creator Studio</button>
              <button onClick={() => { setPage('subscription'); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-steam-blue hover:bg-white/10 w-full text-left">Upgrade Plan</button>
              <button onClick={() => { setPage('upload'); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/10 w-full text-left">Upload Design</button>
              <button onClick={() => { setPage('profile'); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/10 w-full text-left">My Profile</button>

              {/* Settings and Logout for Mobile */}
              <button onClick={() => { setPage('settings'); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/10 w-full text-left">Settings</button>

              {/* ADMIN SHORTCUT */}
              <button onClick={() => { setPage('moha31h'); setIsMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-black text-red-500 hover:bg-red-500/10 w-full text-left">
                <ShieldAlert size={18} /> Admin Console
              </button>

              {user ? (
                <button onClick={() => { if (onLogout) onLogout(); setIsMenuOpen(false); }} className="block w-full mt-4 bg-red-500/10 text-red-400 font-bold py-2 rounded text-center border border-red-500/20">Log Out</button>
              ) : (
                <button onClick={onLogin} className="block w-full mt-4 bg-steam-blue text-steam-dark font-bold py-2 rounded text-center">Login With Steam</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;