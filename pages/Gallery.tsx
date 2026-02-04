import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import { User, Artwork } from '../types';

interface GalleryProps {
    user: User;
    setPage: (page: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ user, setPage }) => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        const fetchSubmissions = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
                const res = await fetch(`${API_URL}/api/v1/creator/submissions`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setSubmissions(data);
                }
            } catch (e) {
                console.error("Failed to fetch submissions", e);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
            case 'live':
                return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-black uppercase tracking-wider"><CheckCircle2 size={12} /> Approved</span>;
            case 'pending':
                return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-black uppercase tracking-wider"><Clock size={12} /> Pending</span>;
            case 'rejected':
                return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-wider"><AlertCircle size={12} /> Rejected</span>;
            default:
                return <span className="text-gray-500 text-[10px]">{status}</span>;
        }
    };

    const filteredSubmissions = submissions.filter(art => {
        const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || art.status.toLowerCase() === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-8 max-w-7xl mx-auto pb-20">

            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setPage('dashboard')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Full Gallery</h1>
                        <p className="text-gray-400 text-sm">Manage all your {submissions.length} submissions.</p>
                    </div>
                </div>
            </header>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search your designs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#12141a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-steam-blue/50"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'approved', 'pending', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${filterStatus === status
                                    ? 'bg-steam-blue text-black border-steam-blue'
                                    : 'bg-[#12141a] text-gray-500 border-white/10 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <section className="bg-[#12141a] rounded-3xl border border-white/5 overflow-hidden">
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
                            {loading ? (
                                <tr><td colSpan={6} className="px-8 py-6 text-center text-gray-500">Loading gallery...</td></tr>
                            ) : filteredSubmissions.length === 0 ? (
                                <tr><td colSpan={6} className="px-8 py-6 text-center text-gray-500">No submissions found.</td></tr>
                            ) : filteredSubmissions.map((art) => (
                                <tr key={art.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 rounded-lg bg-gray-800 overflow-hidden border border-white/10 shrink-0">
                                                {art.preview_url?.endsWith('.webm') ? (
                                                    <video src={art.preview_url} className="w-full h-full object-cover" muted loop autoPlay />
                                                ) : (
                                                    <img src={art.preview_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Art" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-bold truncate mb-0.5">{art.title}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{art.category || 'Artwork Showcase'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-yellow-400 font-black font-mono">{art.price} AC</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            {getStatusBadge(art.status)}
                                            {art.status === 'REJECTED' && art.rejection_reason && (
                                                <span className="text-[10px] text-red-500/80 max-w-[150px] leading-tight mt-1 ml-1">{art.rejection_reason}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-gray-400 font-bold">
                                        {art.sales_count || 0}
                                    </td>
                                    <td className="px-8 py-6 text-gray-500 text-xs">
                                        {new Date(art.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
            </section>
        </div>
    );
};

export default Gallery;
