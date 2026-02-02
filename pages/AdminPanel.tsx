
import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Check, 
  X, 
  Eye, 
  Search, 
  User, 
  Ban, 
  Key, 
  LogIn, 
  TrendingUp, 
  Banknote, 
  Activity, 
  FileText, 
  Layout, 
  Tags, 
  Image as ImageIcon, 
  Power, 
  History, 
  Zap, 
  Users, 
  AlertTriangle,
  ExternalLink,
  DollarSign,
  ChevronRight,
  Loader2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminPanelProps {
  setPage: (page: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'financials' | 'content' | 'health'>('moderation');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [hoveredArt, setHoveredArt] = useState<string | null>(null);

  // Mock Data
  const pendingArtworks = [
    { id: 'p1', title: 'Cyber Oni Mask', creator: 'NeonVibe', img: 'https://picsum.photos/id/10/400/300', date: '10m ago' },
    { id: 'p2', title: 'Retrowave Grid', creator: 'SynthLord', img: 'https://picsum.photos/id/11/400/300', date: '1h ago' },
    { id: 'p3', title: 'Anime Girl #402', creator: 'OtakuArt', img: 'https://picsum.photos/id/12/400/300', date: '3h ago' },
  ];

  const reports = [
    { id: 'r1', item: 'Stolen Asset V1', reporter: 'ArtistX', reason: 'Copyright Theft', status: 'pending' },
    { id: 'r2', item: 'Explicit Image', reporter: 'User99', reason: 'Inappropriate Content', status: 'reviewed' },
  ];

  const auditLogs = [
    { action: 'Approved Art #501', admin: 'Admin_Moha', time: '2m ago' },
    { action: 'Banned User "BadActor"', admin: 'Admin_Moha', time: '15m ago' },
    { action: 'Updated Site Settings', admin: 'Admin_Moha', time: '1h ago' },
  ];

  const renderModeration = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="text-steam-blue" /> Pending Approval Queue
          </h2>
          <span className="text-xs font-black text-steam-blue bg-steam-blue/10 px-3 py-1 rounded-full uppercase tracking-widest border border-steam-blue/20">
            {pendingArtworks.length} Items Waiting
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pendingArtworks.map(art => (
            <div 
              key={art.id} 
              className="bg-[#12141a] border border-white/5 rounded-2xl overflow-hidden group relative"
              onMouseEnter={() => setHoveredArt(art.id)}
              onMouseLeave={() => setHoveredArt(null)}
            >
              <div className="aspect-video relative overflow-hidden bg-black">
                <img src={art.img} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                <AnimatePresence>
                  {hoveredArt === art.id && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-none"
                    >
                      <img src={art.img} className="w-[120%] h-auto shadow-2xl border-4 border-steam-blue/50" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold text-sm">{art.title}</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">By {art.creator} • {art.date}</p>
                  </div>
                  <button className="text-gray-500 hover:text-white transition-colors"><Eye size={16} /></button>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 bg-green-500/10 hover:bg-green-500 border border-green-500/20 hover:text-black text-green-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                    Approve ✅
                  </button>
                  <div className="flex-1 flex gap-1">
                    <button className="flex-[2] py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:text-black text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                      Reject ❌
                    </button>
                    <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-gray-400">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#12141a] rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <AlertTriangle className="text-yellow-500" size={20} />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Recent Reports</h2>
        </div>
        <div className="divide-y divide-white/5">
          {reports.map(report => (
            <div key={report.id} className="p-5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs">{report.item}</h4>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Reported by {report.reporter} • {report.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${report.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                  {report.status}
                </span>
                <button className="p-2 text-gray-500 hover:text-white transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-steam-blue transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search Steam Name or SteamID64..." 
            className="w-full bg-[#12141a] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-steam-blue/50 transition-all"
          />
        </div>
        <button className="px-8 py-4 bg-steam-blue/10 border border-steam-blue/20 text-steam-blue text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-steam-blue/20 transition-all">
          Lookup
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#12141a] border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Creator Verifications</h3>
            <span className="text-[10px] text-steam-blue font-bold uppercase tracking-widest">4 Pending Applications</span>
          </div>
          <div className="divide-y divide-white/5">
            {[1, 2].map(i => (
              <div key={i} className="p-6 flex items-center justify-between group hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                    <img src={`https://picsum.photos/id/${i+50}/100/100`} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Artist_Dev_{i}</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Portfolio: artist_{i}.com • 24 Works</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-steam-blue text-black text-[9px] font-black uppercase tracking-widest rounded-lg">Verify</button>
                  <button className="px-4 py-2 bg-white/5 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/5 hover:text-white">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#12141a] border border-white/5 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Lock size={16} className="text-red-500" /> Account Controls
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl group transition-all">
                <div className="flex items-center gap-3">
                  <Ban size={18} className="text-red-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-red-500">Ban Selected User</span>
                </div>
                <ChevronRight size={14} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl group transition-all">
                <div className="flex items-center gap-3 text-gray-400 group-hover:text-white">
                  <Key size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Reset Password</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl group transition-all">
                <div className="flex items-center gap-3 text-gray-400 group-hover:text-white">
                  <LogIn size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Shadow Login</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-steam-blue/20 to-transparent border border-steam-blue/20 rounded-3xl p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Rank Manager</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Manually upgrade user tiers</p>
            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-steam-blue/20 border border-steam-blue/30 text-steam-blue text-[9px] font-black uppercase tracking-widest rounded-xl">Elite</button>
              <button className="flex-1 py-3 bg-purple-600/20 border border-purple-600/30 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-xl">Pro</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancials = () => (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#12141a] p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 text-green-400 rounded-xl"><DollarSign size={20} /></div>
            <span className="text-[9px] font-black text-green-400 uppercase tracking-widest px-2 py-1 bg-green-500/10 rounded-full">Live</span>
          </div>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Revenue (Last 24h)</p>
          <p className="text-3xl font-black text-white">€1,452.20</p>
        </div>
        <div className="bg-[#12141a] p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl"><Banknote size={20} /></div>
          </div>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Coin Circulation</p>
          <p className="text-3xl font-black text-white">4.2M <span className="text-xs text-gray-500 font-bold">AC</span></p>
        </div>
        <div className="bg-[#12141a] p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-steam-blue/10 text-steam-blue rounded-xl"><TrendingUp size={20} /></div>
          </div>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Avg. Transaction</p>
          <p className="text-3xl font-black text-white">450 <span className="text-xs text-gray-500 font-bold">AC</span></p>
        </div>
        <div className="bg-[#12141a] p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl"><Activity size={20} /></div>
            <a href="https://dashboard.stripe.com" target="_blank" className="text-blue-400 hover:text-white"><ExternalLink size={16} /></a>
          </div>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Stripe Status</p>
          <p className="text-3xl font-black text-white">Operational</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-[#12141a] border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><History size={16} className="text-steam-blue" /> Transaction Logs</h3>
            <button className="text-[10px] text-gray-500 hover:text-white uppercase font-black tracking-widest">Export CSV</button>
          </div>
          <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <div>
                    <p className="text-white font-bold">{i % 2 === 0 ? 'Artwork Purchase' : 'Coin Package'}</p>
                    <p className="text-[10px] text-gray-500">User_{i*32} &rarr; Artist_{i*12}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono font-bold">{i % 2 === 0 ? '500 AC' : '€10.00'}</p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">2m ago</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#12141a] border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><DollarSign size={16} className="text-green-500" /> Payout Queue</h3>
            <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">24 Pending</span>
          </div>
          <div className="divide-y divide-white/5">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-5 flex items-center justify-between group hover:bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <Banknote size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs">Payout: EliteCreator_{i}</h4>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Method: PayPal • Requested 4h ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-white font-mono font-bold">€142.50</p>
                  <button className="px-4 py-2 bg-green-500 text-black text-[9px] font-black uppercase tracking-widest rounded-lg">Process</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-10 animate-in slide-in-from-right-5 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-[#12141a] border border-white/5 rounded-3xl p-8 space-y-6">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><Layout size={18} className="text-steam-blue" /> Featured Slider</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Select top 5 artworks for home page</p>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-gray-600">#{i}</span>
                  <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden"><img src={`https://picsum.photos/id/${i+20}/100/100`} /></div>
                  <span className="text-xs font-bold text-white">Epic Design Name_{i}</span>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors"><Search size={16} /></button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="bg-[#12141a] border border-white/5 rounded-3xl p-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2"><Tags size={18} className="text-purple-400" /> Tag Manager</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Anime', 'Cyberpunk', 'Horror', 'Dark', 'Vibrant'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-300 flex items-center gap-2">
                  {tag} <X size={12} className="cursor-pointer hover:text-red-500" />
                </span>
              ))}
              <button className="px-4 py-2 bg-steam-blue/10 border border-steam-blue/20 text-steam-blue rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-steam-blue/20 transition-all">+</button>
            </div>
            
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2"><ImageIcon size={18} className="text-yellow-400" /> Partner Banners</h3>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
              <div className="flex gap-4">
                <div className="w-16 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600"><FileText size={18} /></div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest">Level-Up Global</h4>
                  <p className="text-[10px] text-gray-500 font-black mt-1">1,245 Clicks • 12.4% CTR</p>
                </div>
              </div>
              <button className="p-2 text-gray-500 hover:text-white transition-colors"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className={`p-8 rounded-3xl border transition-all duration-700 ${maintenanceMode ? 'bg-red-500/20 border-red-500' : 'bg-black/40 border-white/5'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${maintenanceMode ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-500'}`}><Power size={24} /></div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Maintenance Mode</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Immediately lock the entire platform</p>
                </div>
              </div>
              <button 
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-16 h-8 rounded-full transition-all relative ${maintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${maintenanceMode ? 'left-9 shadow-lg' : 'left-1'}`} />
              </button>
            </div>
            {maintenanceMode && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                <ShieldAlert size={14} /> Critical: All user access is restricted
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );

  const renderHealth = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#12141a] p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <Zap size={48} className="text-green-500" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
          </div>
          <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Server Pulse</h3>
          <p className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em]">Operational (12ms)</p>
        </div>
        <div className="bg-[#12141a] p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center">
          <div className="mb-6"><Users size={48} className="text-steam-blue" /></div>
          <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Visitors Today</h3>
          <p className="text-steam-blue text-4xl font-black">12,842</p>
          <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-2 flex items-center gap-1">
            <TrendingUp size={10} className="text-green-500" /> +15% from Yesterday
          </p>
        </div>
        <div className="bg-[#12141a] p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center">
          <div className="mb-6"><FileText size={48} className="text-gray-600" /></div>
          <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Worker Logs</h3>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">0 Fatal Errors (24h)</p>
        </div>
      </div>

      <section className="bg-[#12141a] border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-2"><History size={18} className="text-steam-blue" /> <h3 className="text-sm font-black text-white uppercase tracking-widest">Admin Audit Trail</h3></div>
        <div className="divide-y divide-white/5">
          {auditLogs.map((log, i) => (
            <div key={i} className="p-5 flex items-center justify-between hover:bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-black text-[10px] uppercase">{log.admin[0]}</div>
                <p className="text-xs font-medium text-gray-200">
                  <span className="text-steam-blue font-black">{log.admin}</span> {log.action}
                </p>
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{log.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060709] pt-16 flex flex-col">
      {/* Admin Top Header */}
      <div className="h-20 border-b border-white/5 bg-black/60 backdrop-blur-2xl px-8 flex items-center justify-between z-50 sticky top-16">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-steam-blue" />
              <h1 className="text-white font-black text-sm uppercase tracking-[0.25em]">Moha Admin Console</h1>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Live Session: Root_Access</p>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          <nav className="hidden lg:flex items-center gap-2">
            {[
              { id: 'moderation', label: 'Queue', icon: <ShieldAlert size={14} /> },
              { id: 'users', label: 'Users', icon: <Users size={14} /> },
              { id: 'financials', label: 'Engine', icon: <DollarSign size={14} /> },
              { id: 'content', label: 'Market', icon: <Layout size={14} /> },
              { id: 'health', label: 'Health', icon: <Zap size={14} /> },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-steam-blue text-black shadow-lg shadow-steam-blue/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Active Admins</span>
             <span className="text-xs font-black text-steam-blue tracking-widest">1 ONLINE</span>
          </div>
          <button 
            onClick={() => setPage('home')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-2xl transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'moderation' && renderModeration()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'financials' && renderFinancials()}
          {activeTab === 'content' && renderContent()}
          {activeTab === 'health' && renderHealth()}
        </AnimatePresence>
      </div>

      {/* Admin Floating Footer */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full shadow-2xl z-50 flex items-center gap-8">
        <div className="flex items-center gap-2">
           <Activity size={16} className="text-steam-blue" />
           <span className="text-[10px] font-black text-white uppercase tracking-widest">System Load: 12%</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
          <History size={14} /> View Global Logs
        </button>
        <button className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-2">
          <Power size={14} /> Close Console
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
