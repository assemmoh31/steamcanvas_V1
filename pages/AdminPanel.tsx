
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
  Lock,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminPanelProps {
  setPage: (page: string) => void;
  onInspect?: (id: string) => void;
}

import AdsManagement from './Admin/AdsManagement';

const AdminPanel: React.FC<AdminPanelProps> = ({ setPage, onInspect }) => {
  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'financials' | 'content' | 'health' | 'reports' | 'ads'>('moderation');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [hoveredArt, setHoveredArt] = useState<string | null>(null);

  // Real Data State
  const [pendingArtworks, setPendingArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Pending Artworks
  const fetchPending = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'; // In real app, use env var
      const res = await fetch(`${API_URL}/api/v1/admin/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingArtworks(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch pending queue", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'moderation') {
      fetchPending();
    }
  }, [activeTab]);

  const handleApprove = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Not authenticated!");
      return;
    }

    // Optimistic Update: Immediately remove from UI
    setPendingArtworks(prev => prev.filter(a => a.id !== id));

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      console.log(`Approving artwork ${id}...`);

      const res = await fetch(`${API_URL}/api/v1/admin/approve/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        // Revert if failed
        console.error("Approval failed on server");
        alert("Server failed to approve. Refreshing list...");
        fetchPending();
      } else {
        console.log("Approval success!");
      }
    } catch (err) {
      console.error("Failed to approve", err);
      alert("Network error during approval.");
      fetchPending(); // Revert/Refresh
    }
  };

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRejectId, setSelectedRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [customRejectReason, setCustomRejectReason] = useState<string>('');

  const handleReject = async (id: string) => {
    setSelectedRejectId(id);
    setRejectReason('');
    setCustomRejectReason('');
    setRejectModalOpen(true);
  };

  const [processing, setProcessing] = useState(false);

  const confirmReject = async () => {
    console.log("Confirming rejection for:", selectedRejectId);
    if (!selectedRejectId) {
      alert("No artwork selected!");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Not authenticated!");
      return;
    }

    const finalReason = customRejectReason || rejectReason;
    console.log("Reason:", finalReason);

    setProcessing(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      console.log("Sending PATCH to:", `${API_URL}/api/v1/admin/reject/${selectedRejectId}`);

      const res = await fetch(`${API_URL}/api/v1/admin/reject/${selectedRejectId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: finalReason })
      });

      console.log("Response status:", res.status);

      if (res.ok) {
        setPendingArtworks(prev => prev.filter(a => a.id !== selectedRejectId));
        setRejectModalOpen(false);
        setSelectedRejectId(null);
      } else {
        const errorText = await res.text();
        console.error("Rejection failed:", errorText);
        alert(`Failed to reject. Server responded with: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Failed to reject", err);
      alert("Failed to reject: " + err);
    } finally {
      setProcessing(false);
    }
  };

  // Reports State
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = async () => {
    if (!selectedReport || !replyMessage) return;

    setIsReplying(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      const res = await fetch(`${API_URL}/api/v1/admin/reports/${selectedReport.id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: replyMessage })
      });

      if (res.ok) {
        alert('Reply sent successfully!');
        setReplyMessage('');
        setSelectedReport(null);
        fetchReports(); // Refresh list
      } else {
        alert('Failed to send reply');
      }
    } catch (e) {
      console.error(e);
      alert('Error sending reply');
    } finally {
      setIsReplying(false);
    }
  };

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      const res = await fetch(`${API_URL}/api/v1/admin/reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  const [financialStats, setFinancialStats] = React.useState<any>(null);

  const fetchFinancialStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      const res = await fetch(`${API_URL}/api/v1/admin/stats/financial`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setFinancialStats(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch financial stats", err);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports();
    } else if (activeTab === 'financials') {
      fetchFinancialStats();
    }
  }, [activeTab]);

  const auditLogs = [
    { action: 'Approved Art #501', admin: 'Admin_Moha', time: '2m ago' },
    { action: 'Banned User "BadActor"', admin: 'Admin_Moha', time: '15m ago' },
    { action: 'Updated Site Settings', admin: 'Admin_Moha', time: '1h ago' },
  ];

  // Helper Component for Video Previews
  const AdminVideoPreview = ({ src, isHovered }: { src: string, isHovered: boolean }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
      if (videoRef.current) {
        if (isHovered) {
          videoRef.current.play().catch(() => { });
        } else {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }
    }, [isHovered]);

    return <video ref={videoRef} src={src} loop muted className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />;
  };

  const renderReports = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <section className="bg-[#12141a] rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <AlertTriangle className="text-yellow-500" size={20} />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Active Reports</h2>
          <span className="ml-auto text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-yellow-500/20">
            {reports.length} Open Cases
          </span>
        </div>
        <div className="divide-y divide-white/5">
          {reports.map(report => (
            <div
              key={report.id}
              className="p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">{report.artwork_title || 'Unknown Asset'}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">Reporter: {report.reporter_name || 'Anonymous'}</span>
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">{report.reason}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${report.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                  {report.status}
                </span>
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-colors border border-white/5">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Check size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest">No Active Reports</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );

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

        {loading ? (
          <div className="text-white text-center py-10">Loading Queue...</div>
        ) : pendingArtworks.length === 0 ? (
          <div className="text-gray-500 text-center py-10 border border-white/5 rounded-2xl bg-[#12141a]">
            Queue is empty. Good job, Admin!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingArtworks.map(art => (
              <div
                key={art.id}
                className="bg-[#12141a] border border-white/5 rounded-2xl overflow-hidden group relative"
                onMouseEnter={() => setHoveredArt(art.id)}
                onMouseLeave={() => setHoveredArt(null)}
              >
                <div className="aspect-video relative overflow-hidden bg-black flex items-center justify-center">
                  {art.preview_url?.endsWith('.webm') ? (
                    <AdminVideoPreview src={art.preview_url} isHovered={hoveredArt === art.id} />
                  ) : (
                    <img src={art.preview_url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                  )}

                  <AnimatePresence>
                    {hoveredArt === art.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-none"
                      >
                        {art.preview_url?.endsWith('.webm') ? (
                          <div className="max-w-[120%] h-auto shadow-2xl border-4 border-steam-blue/50 overflow-hidden">
                            <video src={art.preview_url} autoPlay loop muted className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <img src={art.preview_url} className="w-[120%] h-auto shadow-2xl border-4 border-steam-blue/50" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-bold text-sm">{art.title}</h3>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                        By {art.creator_name || 'Unknown'} • {new Date(art.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button className="text-gray-500 hover:text-white transition-colors"><Eye size={16} /></button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(art.id).catch(err => alert("Error approving: " + err));
                      }}
                      className="flex-1 py-2.5 bg-green-500/10 hover:bg-green-500 border border-green-500/20 hover:text-black text-green-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer z-50 relative"
                    >
                      Approve ✅
                    </button>
                    <div className="flex-1 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(art.id).catch(err => alert("Error rejecting: " + err));
                        }}
                        className="flex-[2] py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:text-black text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer z-50 relative"
                      >
                        Reject ❌
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onInspect) onInspect(art.id);
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-steam-blue transition-colors"
                        title="Inspect"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
                    <img src={`https://picsum.photos/id/${i + 50}/100/100`} />
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
          <p className="text-3xl font-black text-white">€{financialStats?.revenue_24h?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-[#12141a] p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl"><Banknote size={20} /></div>
          </div>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Coin Circulation</p>
          <p className="text-3xl font-black text-white">
            {financialStats?.coin_circulation
              ? financialStats.coin_circulation >= 1000000
                ? (financialStats.coin_circulation / 1000000).toFixed(1) + 'M'
                : financialStats.coin_circulation >= 1000
                  ? (financialStats.coin_circulation / 1000).toFixed(1) + 'k'
                  : financialStats.coin_circulation.toLocaleString()
              : '0'}
            <span className="text-xs text-gray-500 font-bold ml-1">AC</span>
          </p>
        </div>
        <div className="bg-[#12141a] p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-steam-blue/10 text-steam-blue rounded-xl"><TrendingUp size={20} /></div>
          </div>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Avg. Transaction</p>
          <p className="text-3xl font-black text-white">{financialStats?.avg_transaction || '0'} <span className="text-xs text-gray-500 font-bold">AC</span></p>
        </div>
        <div className="bg-[#12141a] p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl"><Activity size={20} /></div>
            <a href="https://dashboard.stripe.com" target="_blank" className="text-blue-400 hover:text-white"><ExternalLink size={16} /></a>
          </div>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Stripe Status</p>
          <p className="text-3xl font-black text-white">{financialStats?.stripe_status || 'Checking...'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-[#12141a] border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><History size={16} className="text-steam-blue" /> Transaction Logs</h3>
            <button className="text-[10px] text-gray-500 hover:text-white uppercase font-black tracking-widest">Export CSV</button>
          </div>
          <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
            {financialStats?.logs?.map((log: any, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${log.type === 'DEPOSIT' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <div>
                    <p className="text-white font-bold">{log.type}</p>
                    <p className="text-[10px] text-gray-500">{log.user_name} ({log.user_steam_id})</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono font-bold">{log.amount} AC</p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">{new Date(log.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {(!financialStats?.logs || financialStats.logs.length === 0) && (
              <div className="p-8 text-center text-gray-500 text-xs">No recent transactions</div>
            )}
          </div>
        </section>

        <section className="bg-[#12141a] border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><DollarSign size={16} className="text-green-500" /> Payout Queue</h3>
            <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">{financialStats?.payouts?.length || 0} Pending</span>
          </div>
          <div className="divide-y divide-white/5">
            {financialStats?.payouts?.map((payout: any, i: number) => (
              <div key={i} className="p-5 flex items-center justify-between group hover:bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <Banknote size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs">Payout: {payout.user_name}</h4>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Requested {new Date(payout.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-white font-mono font-bold">AC {payout.amount}</p>
                  <button className="px-4 py-2 bg-green-500 text-black text-[9px] font-black uppercase tracking-widest rounded-lg">Process</button>
                </div>
              </div>
            ))}
            {(!financialStats?.payouts || financialStats.payouts.length === 0) && (
              <div className="p-8 text-center text-gray-500 text-xs">No pending payouts</div>
            )}
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
                  <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden"><img src={`https://picsum.photos/id/${i + 20}/100/100`} /></div>
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
              { id: 'reports', label: 'Reports', icon: <MessageSquare size={14} /> },
              { id: 'users', label: 'Users', icon: <Users size={14} /> },
              { id: 'financials', label: 'Engine', icon: <DollarSign size={14} /> },
              { id: 'content', label: 'Market', icon: <Layout size={14} /> },
              { id: 'ads', label: 'Ads', icon: <Layout size={14} /> },
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
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'financials' && renderFinancials()}
          {activeTab === 'content' && renderContent()}
          {activeTab === 'ads' && <div className="animate-in fade-in duration-500"><AdsManagement /></div>}
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

      <AnimatePresence>
        {rejectModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#12141a] border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-widest">Reject Artwork</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select a reason for rejection</p>
                  </div>
                </div>
                <button onClick={() => setRejectModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'stolen', label: 'Stolen Content', desc: 'Owned by another creator' },
                  { id: 'quality', label: 'Low Quality', desc: 'Does not meet standards' },
                  { id: 'ai', label: 'AI Disclosure', desc: 'Missing AI tag' },
                  { id: 'inappropriate', label: 'Inappropriate', desc: 'Violates safety guidelines' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRejectReason(r.label);
                      if (r.id !== 'custom') setCustomRejectReason('');
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${rejectReason === r.label
                      ? 'bg-red-500/10 border-red-500 text-white'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                  >
                    <div className="text-xs font-black uppercase tracking-widest mb-1">{r.label}</div>
                    <div className="text-[10px] opacity-60 font-medium">{r.desc}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Custom Reason (Optional)</label>
                <textarea
                  value={customRejectReason}
                  onChange={(e) => {
                    setCustomRejectReason(e.target.value);
                    setRejectReason('Custom');
                  }}
                  placeholder="Type specific details here..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-red-500/50 min-h-[100px] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 text-xs font-black uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={!rejectReason && !customRejectReason}
                  className="flex-[2] py-4 rounded-xl bg-red-500 hover:bg-red-600 text-black text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedReport(null)}
          >
            <div className="bg-[#1c1e26] border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedReport(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={20} /></button>

              <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <ShieldAlert className="text-red-500" /> Report Details
              </h2>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Reporter</h3>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <img src={selectedReport.reporter_avatar || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-bold text-white">{selectedReport.reporter_name}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Reported Creator</h3>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <span className="text-sm font-bold text-white">{selectedReport.creator_name || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Reason & Description</h3>
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl space-y-2">
                  <span className="inline-block px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded">{selectedReport.reason}</span>
                  <p className="text-sm text-gray-300">{selectedReport.description || "No description provided."}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Target Asset</h3>
                <div className="flex gap-4 p-4 bg-black/40 border border-white/5 rounded-xl">
                  <img src={selectedReport.artwork_preview} className="w-24 h-16 object-cover rounded-lg bg-gray-800" />
                  <div>
                    <h4 className="text-white font-bold">{selectedReport.artwork_title}</h4>
                    <button
                      onClick={() => onInspect && onInspect(selectedReport.artwork_id)}
                      className="text-steam-blue text-xs font-bold hover:underline mt-1 flex items-center gap-1"
                    >
                      View Full Artwork <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Reply to Reporter</h3>
                <textarea
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-steam-blue/50 resize-none"
                  placeholder="Type your message here..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelectedReport(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 font-black text-xs uppercase tracking-widest">Close</button>
                <button
                  onClick={handleReply}
                  disabled={!replyMessage || isReplying}
                  className="flex-1 py-3 bg-steam-blue hover:bg-steam-blue/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-steam-blue/20"
                >
                  {isReplying ? 'Sending...' : 'Send Reply & Resolve'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
