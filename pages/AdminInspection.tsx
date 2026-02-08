import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Download,
    CheckCircle2,
    X,
    ShieldAlert,
    Monitor,
    FileJson,
    Palette,
    Eye,
    Clock,
    AlertTriangle,
    FileCheck,
    XCircle,
    HardDrive,
    Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InspectionData {
    id: string;
    title: string;
    description: string;
    price: number;
    preview_url: string;
    source_key: string;
    signedSourceUrl?: string;
    creator_id: string;
    creator_name?: string;
    category: string;
    is_ai_generated: number;
    dominant_colors: string | null;
    created_at: string;
    tags: string | null;
    author_type: string;
}

interface AdminInspectionProps {
    id: string | null;
    setPage: (page: string) => void;
}

const AdminInspection: React.FC<AdminInspectionProps> = ({ id, setPage }) => {
    // const { id } = useParams<{ id: string }>(); // Removed
    // const navigate = useNavigate(); // Removed

    const [data, setData] = useState<InspectionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Rejection Modal State
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState<string>('');
    const [customRejectReason, setCustomRejectReason] = useState<string>('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchInspectionData();
    }, [id]);

    const fetchInspectionData = async () => {
        const token = localStorage.getItem('token');
        if (!token || !id) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
            const res = await fetch(`${API_URL}/api/v1/admin/artwork/${id}/inspect`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch inspection data');

            const result = await res.json();
            setData(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!id || !data) return;
        const token = localStorage.getItem('token');

        if (!confirm("Confirm APPROVAL for this artwork? It will go live immediately.")) return;

        setProcessing(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
            const res = await fetch(`${API_URL}/api/v1/admin/approve/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                alert("Artwork Approved Successfully via Verdict Bar");
                setPage('moha31h'); // Return to queue
            } else {
                alert("Approval failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Network Error");
        } finally {
            setProcessing(false);
        }
    };

    const confirmReject = async () => {
        if (!id) return;
        const token = localStorage.getItem('token');
        const finalReason = customRejectReason || rejectReason;

        setProcessing(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
            const res = await fetch(`${API_URL}/api/v1/admin/reject/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason: finalReason })
            });

            if (res.ok) {
                setRejectModalOpen(false);
                alert("Artwork Rejected.");
                setPage('moha31h');
            } else {
                alert("Rejection failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Network Error");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#060709] flex items-center justify-center text-steam-blue animate-pulse">Initializing Inspection Lab...</div>;
    if (error || !data) return <div className="min-h-screen bg-[#060709] flex items-center justify-center text-red-500">Error: {error || 'Asset not found'}</div>;

    const colors = data.dominant_colors ? JSON.parse(data.dominant_colors) : [];
    const tags = data.tags ? JSON.parse(data.tags) : [];

    return (
        <div className="min-h-screen bg-[#060709] text-white font-sans selection:bg-steam-blue/30">

            {/* Top Nav */}
            <header className="fixed top-0 w-full h-16 bg-black/80 backdrop-blur-md border-b border-white/5 z-40 flex items-center justify-between px-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => setPage('moha31h')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                            <Monitor size={14} className="text-steam-blue" /> Inspection Lab
                        </h1>
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Case ID: {data.id}</span>
                    </div>
                </div>
                <div className="px-4 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                    <Clock size={12} /> Pending Review
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="pt-24 pb-32 px-8 max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-100px)]">

                {/* Left Pane: Visuals */}
                <div className="lg:col-span-8 bg-[#12141a] rounded-3xl border border-white/5 relative overflow-hidden group flex items-center justify-center">
                    {/* Checkerboard Pattern for Transparency */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                    {data.preview_url.endsWith('.webm') ? (
                        <video src={data.preview_url} autoPlay loop muted controls className="max-w-full max-h-full object-contain shadow-2xl relative z-10" />
                    ) : (
                        <img src={data.preview_url} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl relative z-10" />
                    )}

                    <div className="absolute top-6 right-6 z-20 flex gap-2">
                        <button className="px-4 py-2 bg-black/60 backdrop-blur border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2">
                            <Eye size={14} /> Fullscreen
                        </button>
                    </div>
                </div>

                {/* Right Pane: Metadata */}
                <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2 custom-scrollbar">

                    {/* Identity Card */}
                    <section className="bg-[#12141a] p-6 rounded-3xl border border-white/5 space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{data.title}</h2>
                            <p className="text-sm text-gray-400 leading-relaxed">{data.description || 'No description provided.'}</p>
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <div className="bg-steam-blue/10 px-4 py-2 rounded-xl border border-steam-blue/20">
                                <span className="text-[10px] text-steam-blue font-black uppercase tracking-widest block">Price</span>
                                <span className="text-lg font-black text-white">{data.price} <span className="text-xs">AC</span></span>
                            </div>
                            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block">Creator ID</span>
                                <span className="text-xs font-mono text-gray-300">{data.creator_id.substring(0, 12)}...</span>
                            </div>
                            <div className="bg-purple-500/10 px-4 py-2 rounded-xl border border-purple-500/20">
                                <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest block">Category</span>
                                <div className="flex items-center gap-2 mt-1">
                                    {data.category === 'workshop' ? <HardDrive size={14} className="text-purple-400" /> : <ImageIcon size={14} className="text-purple-400" />}
                                    <span className="text-xs font-black text-white uppercase">{data.category || 'Artwork'}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Technical Metadata */}
                    <section className="bg-[#12141a] p-6 rounded-3xl border border-white/5 space-y-6">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <FileJson size={14} /> Asset Metadata
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Format</span>
                                <span className="text-white font-mono text-xs bg-white/10 px-2 py-0.5 rounded">{data.preview_url.split('.').pop()?.toUpperCase()}</span>
                            </div>
                            <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">AI Generated</span>
                                {data.is_ai_generated ? (
                                    <span className="text-yellow-500 flex items-center gap-1 text-xs font-bold"><AlertTriangle size={12} /> Yes</span>
                                ) : (
                                    <span className="text-green-500 flex items-center gap-1 text-xs font-bold"><CheckCircle2 size={12} /> No</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-3 flex items-center gap-2">
                                <Palette size={14} /> Dominant Colors
                            </span>
                            <div className="flex gap-2">
                                {Array.isArray(colors) && colors.length > 0 ? colors.map((c: string, i: number) => (
                                    <div key={i} className="w-8 h-8 rounded-lg shadow-inner border border-white/10" style={{ backgroundColor: c }} title={c} />
                                )) : <span className="text-xs text-gray-600 italic">Analysis unavailable</span>}
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-3">Tags</span>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(tags) && tags.map((t: string) => (
                                    <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-300 font-bold uppercase tracking-wider">{t}</span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Source Validation */}
                    <section className="bg-gradient-to-br from-steam-blue/10 to-transparent p-6 rounded-3xl border border-steam-blue/20">
                        <h3 className="text-xs font-black text-steam-blue uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <FileCheck size={14} /> Source Validation
                        </h3>
                        <p className="text-xs text-gray-400 mb-6">
                            Download the original source file from the secure vault to verify contents, resolution, and layer structure.
                        </p>
                        {data.signedSourceUrl ? (
                            <a
                                href={data.signedSourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-4 bg-steam-blue hover:bg-steam-deepBlue text-black font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(102,252,241,0.2)] hover:shadow-[0_0_30px_rgba(102,252,241,0.4)]"
                            >
                                <Download size={16} /> Download Source
                            </a>
                        ) : (
                            <button disabled className="w-full py-4 bg-white/5 text-gray-500 font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                                <XCircle size={16} /> Source Unavailable
                            </button>
                        )}
                    </section>

                </div>
            </main>

            {/* Sticky Verdict Bar */}
            <footer className="fixed bottom-0 w-full h-24 bg-[#060709]/80 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-between px-8 lg:px-24">
                <div className="flex items-center gap-4 opacity-50">
                    <ShieldAlert size={18} className="text-gray-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 hidden sm:block">Admin Verdict Required</span>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => setRejectModalOpen(true)}
                        disabled={processing}
                        className="flex-1 sm:flex-none px-8 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                    >
                        <X size={16} className="group-hover:scale-125 transition-transform" /> Reject
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={processing}
                        className="flex-[2] sm:flex-none px-12 py-4 bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] group"
                    >
                        <CheckCircle2 size={16} className="group-hover:scale-125 transition-transform" /> Approve Publication
                    </button>
                </div>
            </footer>


            {/* Rejection Modal (Ported from AdminPanel) */}
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
                                    disabled={!rejectReason && !customRejectReason || processing}
                                    className="flex-[2] py-4 rounded-xl bg-red-500 hover:bg-red-600 text-black text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                                >
                                    {processing ? 'Processing...' : 'Confirm Rejection'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminInspection;
