
import React, { useMemo } from 'react';
import { User, ArtworkStatus } from '../types';
import { 
  UploadCloud, 
  Image, 
  DollarSign, 
  BarChart2, 
  ArrowUpRight, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import CreatorTag from '../components/CreatorTag';
import CreatorAvatar from '../components/CreatorAvatar';

interface CreatorDashboardProps {
  user: User;
  setPage: (page: string) => void;
}

const EarningsChart: React.FC = () => {
  // Mock weekly earnings data
  const data = [120, 450, 300, 800, 500, 950, 600];
  const max = Math.max(...data);
  const width = 400;
  const height = 120;
  
  const points = useMemo(() => {
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (val / max) * height;
      return `${x},${y}`;
    }).join(' ');
  }, [data, max]);

  return (
    <div className="w-full h-32 relative group">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#66FCF1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#66FCF1" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area Fill */}
        <motion.path
          initial={{ opacity: 0, d: `M 0,${height} L 0,${height} L ${width},${height} L ${width},${height} Z` }}
          animate={{ opacity: 1, d: `M 0,${height} L ${points} L ${width},${height} Z` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          fill="url(#chartGradient)"
        />

        {/* Line Path */}
        <motion.polyline
          fill="none"
          stroke="#66FCF1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Data Points */}
        {data.map((val, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - (val / max) * height;
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#0B0C10"
              stroke="#66FCF1"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5 + (i * 0.1) }}
              className="cursor-help"
            >
              <title>{val} CC</title>
            </motion.circle>
          );
        })}
      </svg>
      
      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="w-full border-t border-white/5"></div>
          <div className="w-full border-t border-white/5"></div>
          <div className="w-full border-t border-white/5"></div>
      </div>
    </div>
  );
};

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ user, setPage }) => {
  const submissions = [
    { id: '1', title: 'Neon Genesis X', price: 500, status: 'live' as ArtworkStatus, sales: 42, date: 'Oct 12, 2023', img: 'https://picsum.photos/id/101/100/100' },
    { id: '2', title: 'Vaporwave Sunset', price: 350, status: 'pending' as ArtworkStatus, sales: 0, date: 'Oct 14, 2023', img: 'https://picsum.photos/id/102/100/100' },
    { id: '3', title: 'Cyberpunk Frame', price: 1200, status: 'rejected' as ArtworkStatus, sales: 0, date: 'Oct 10, 2023', img: 'https://picsum.photos/id/103/100/100' },
    { id: '4', title: 'Glitch Profile Pack', price: 800, status: 'live' as ArtworkStatus, sales: 156, date: 'Sep 28, 2023', img: 'https://picsum.photos/id/104/100/100' },
  ];

  const getStatusBadge = (status: ArtworkStatus) => {
    switch (status) {
      case 'live':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-black uppercase tracking-wider"><CheckCircle2 size={12} /> Approved</span>;
      case 'pending':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-black uppercase tracking-wider"><Clock size={12} /> Pending</span>;
      case 'rejected':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-wider"><AlertCircle size={12} /> Rejected</span>;
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 max-w-7xl mx-auto pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div className="flex items-center gap-6">
                <CreatorAvatar 
                  src={user.avatarUrl} 
                  totalSales={user.totalSales} 
                  size="lg" 
                />
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <h1 className="text-4xl font-black text-white tracking-tight">Creator <span className="text-creator-base">Studio</span></h1>
                          <CreatorTag status={user.status} className="h-4 scale-150 origin-left" />
                        </div>
                    </div>
                    <p className="text-gray-400 font-medium">Manage your digital empire and monitor your performance.</p>
                </div>
            </div>
            <button 
              onClick={() => setPage('upload')}
              className="flex items-center gap-3 bg-steam-blue hover:bg-steam-deepBlue text-black font-black px-8 py-4 rounded-2xl shadow-[0_0_20px_rgba(102,252,241,0.2)] transition-all transform hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-widest"
            >
                <UploadCloud size={20} />
                <span>Upload New Design</span>
            </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-[#12141a] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><BarChart2 size={20} /></div>
                    <span className="text-green-400 text-xs font-bold flex items-center gap-1">+12% <ArrowUpRight size={14} /></span>
                </div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Sales</p>
                <p className="text-3xl font-black text-white">1,245</p>
            </div>

            <div className="bg-[#12141a] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors relative group overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-creator-base/10 text-creator-base rounded-xl"><DollarSign size={20} /></div>
                    <button 
                        onClick={() => setPage('withdrawal')}
                        className="p-2 bg-creator-base hover:bg-blue-500 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                        title="Withdraw Funds"
                    >
                        <Wallet size={16} />
                    </button>
                </div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Revenue (30d)</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-white">{user.creatorCoins.toLocaleString()}</p>
                    <span className="text-sm text-creator-base font-bold">CC</span>
                </div>
                
                {/* Payout Quick Action */}
                <button 
                    onClick={() => setPage('withdrawal')}
                    className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-300 transition-all flex items-center justify-center gap-2"
                >
                    Request Payout
                </button>
            </div>

            <div className="bg-[#12141a] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><Image size={20} /></div>
                </div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Listings</p>
                <p className="text-3xl font-black text-white">12</p>
            </div>

            <div className="bg-[#12141a] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl"><ArrowUpRight size={20} /></div>
                </div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Store Rank</p>
                <p className="text-3xl font-black text-white">#24</p>
            </div>
        </div>

        {/* Earnings Overview Chart */}
        <section className="bg-[#12141a] rounded-3xl border border-white/5 p-8 mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                <div>
                    <h3 className="text-xl font-black text-white mb-1">Earnings Overview</h3>
                    <p className="text-gray-500 text-sm">Revenue performance over the last 7 days.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded-lg bg-creator-base/10 text-creator-base text-[10px] font-black uppercase tracking-widest border border-creator-base/20">7 Days</button>
                    <button className="px-4 py-1.5 rounded-lg text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">30 Days</button>
                </div>
            </div>
            
            <EarningsChart />
            
            <div className="flex justify-between mt-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] border-t border-white/5 pt-4">
                <span>Oct 10</span>
                <span>Oct 11</span>
                <span>Oct 12</span>
                <span>Oct 13</span>
                <span>Oct 14</span>
                <span>Oct 15</span>
                <span>Today</span>
            </div>
        </section>

        {/* Submissions & Status Tracker Table */}
        <section className="bg-[#12141a] rounded-3xl border border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-white mb-1">Your Submissions</h3>
                    <p className="text-gray-500 text-sm">Track the status of your uploaded designs.</p>
                </div>
                <button className="text-steam-blue text-xs font-black uppercase tracking-widest hover:underline">View All Gallery</button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-black/20 text-gray-500 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="px-8 py-5">Design</th>
                            <th className="px-8 py-5">Price</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5">Sales</th>
                            <th className="px-8 py-5">Submitted</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {submissions.map((art) => (
                            <tr key={art.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-12 rounded-lg bg-gray-800 overflow-hidden border border-white/10 shrink-0">
                                            <img src={art.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Art" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white font-bold truncate mb-0.5">{art.title}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Artwork Showcase</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-yellow-400 font-black font-mono">{art.price} AC</span>
                                </td>
                                <td className="px-8 py-6">
                                    {getStatusBadge(art.status)}
                                </td>
                                <td className="px-8 py-6 text-gray-400 font-bold">
                                    {art.sales.toLocaleString()}
                                </td>
                                <td className="px-8 py-6 text-gray-500 text-xs">
                                    {art.date}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-6 bg-black/10 text-center">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic">
                    Designs typically take 12-24 hours to be reviewed by the curation team.
                </p>
            </div>
        </section>
    </div>
  );
};

export default CreatorDashboard;
