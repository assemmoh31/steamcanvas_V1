
import React, { useEffect, useState } from 'react';
import { Eye, MousePointer, Settings, Plus, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Banner {
    id: number;
    media_url: string;
    redirect_url: string | null;
    priority: number;
    is_active: number; // 0 or 1
    impressions?: number;
    clicks?: number;
    ctr?: string;
    created_at: string;
}

interface PlatformConfig {
    global_ads_enabled: boolean;
    banner_injection_interval: number;
}

const AdsManagement = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [config, setConfig] = useState<PlatformConfig>({
        global_ads_enabled: true,
        banner_injection_interval: 15
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Edit/Create State
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState({
        media_url: '',
        redirect_url: '',
        priority: 0,
        is_active: true
    });

    const token = localStorage.getItem('token');
    const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8787';

    // Fetch Data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch Banners
            const bannersRes = await fetch(`${API_URL}/api/v1/admin/banners`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const bannersData = await bannersRes.json();

            if (Array.isArray(bannersData)) {
                setBanners(bannersData);
            }

            // Fetch Config (We need a GET route for config, but currently relying on defaults or patch return? 
            // Wait, previous backend code didn't add GET /config. Checking public route for config values or separate call?
            // Actually the public /banners route returns config values to client. 
            // But for admin, we should probably add a GET /admin/config or just assume defaults/fetch from somewhere.
            // Let's rely on what we have or add a quick GET if needed. 
            // For now, let's mock initial config or fetch from public endpoint to sync.)

            const publicRes = await fetch(`${API_URL}/api/v1/banners`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const publicData = await publicRes.json();
            if (publicData) {
                setConfig({
                    global_ads_enabled: publicData.ads_enabled !== false, // Infer
                    banner_injection_interval: publicData.interval || 15
                });
            }

        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handlers
    const handleConfigUpdate = async (newConfig: Partial<PlatformConfig>) => {
        try {
            await fetch(`${API_URL}/api/v1/admin/config`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newConfig)
            });
            setConfig(prev => ({ ...prev, ...newConfig }));
        } catch (e) {
            console.error('Config update failed', e);
        }
    };

    const handleToggleBannerStatus = async (id: number, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus;
            // Optimistic update
            setBanners(prev => prev.map(b =>
                b.id === id ? { ...b, is_active: newStatus ? 1 : 0 } : b
            ));

            const res = await fetch(`${API_URL}/api/v1/admin/banners/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ is_active: newStatus })
            });

            if (!res.ok) {
                // Revert if failed
                setBanners(prev => prev.map(b =>
                    b.id === id ? { ...b, is_active: currentStatus ? 1 : 0 } : b
                ));
                console.error('Failed to toggle active status');
            }
        } catch (e) {
            console.error('Toggle status failed', e);
            // Revert
            setBanners(prev => prev.map(b =>
                b.id === id ? { ...b, is_active: currentStatus ? 1 : 0 } : b
            ));
        }
    };

    const handleSaveBanner = async () => {
        const url = editingBanner
            ? `${API_URL}/api/v1/admin/banners/${editingBanner.id}`
            : `${API_URL}/api/v1/admin/banners`;

        const method = editingBanner ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            }
        } catch (e) {
            console.error('Save failed', e);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`${API_URL}/api/v1/admin/banners/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        } catch (e) {
            console.error('Delete failed', e);
        }
    };

    const openModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                media_url: banner.media_url,
                redirect_url: banner.redirect_url || '',
                priority: banner.priority,
                is_active: banner.is_active === 1
            });
        } else {
            setEditingBanner(null);
            setFormData({
                media_url: '',
                redirect_url: '',
                priority: 0,
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const getCTRColor = (ctr: string) => {
        const val = parseFloat(ctr);
        if (val >= 2) return 'text-green-400 bg-green-400/10';
        if (val >= 1) return 'text-yellow-400 bg-yellow-400/10';
        return 'text-red-400 bg-red-400/10';
    };

    return (
        <div className="min-h-screen bg-[#1b2838] text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Ads Management</h1>
                        <p className="text-gray-400 mt-1">Manage partner banners and platform tracking</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors"
                    >
                        <Plus size={20} />
                        Add New Banner
                    </button>
                </div>

                {/* Global Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#171a21] p-6 rounded-xl border border-white/5 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Eye className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Global Ads Status</h3>
                                    <p className="text-sm text-gray-400">Master switch for all users</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={config.global_ads_enabled}
                                    onChange={(e) => handleConfigUpdate({ global_ads_enabled: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="bg-[#171a21] p-6 rounded-xl border border-white/5 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Settings className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Injection Interval</h3>
                                    <p className="text-sm text-gray-400">Rows between ads</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={Math.round(config.banner_injection_interval / 3) || 1}
                                    onChange={(e) => {
                                        const rows = parseInt(e.target.value) || 1;
                                        handleConfigUpdate({ banner_injection_interval: rows * 3 });
                                    }}
                                    className="w-20 bg-[#2a475e] border border-[#1b2838] rounded px-3 py-1 text-center font-mono"
                                />
                                <span className="text-gray-400 text-sm">rows</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Analytics Table */}
                <div className="bg-[#171a21] rounded-xl border border-white/5 shadow-lg overflow-hidden">

                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-xl font-semibold">Active Campaigns</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#2a475e]/30 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4 text-left">Banner</th>
                                    <th className="px-6 py-4 text-center">Priority</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Impressions</th>
                                    <th className="px-6 py-4 text-center">Clicks</th>
                                    <th className="px-6 py-4 text-center">CTR</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr><td colSpan={7} className="p-8 text-center text-gray-400">Loading...</td></tr>
                                ) : banners.map((banner) => (
                                    <tr key={banner.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-14 bg-gray-800 rounded overflow-hidden shadow-sm">
                                                    <img src={banner.media_url} alt="Banner" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="text-sm">
                                                    <p className="text-white truncate max-w-[200px]">{banner.media_url}</p>
                                                    <p className="text-gray-500 truncate max-w-[200px]">{banner.redirect_url || 'No Link'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono">{banner.priority}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleBannerStatus(banner.id, !!banner.is_active)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 ${banner.is_active ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                                            >
                                                {banner.is_active ? 'ACTIVE' : 'INACTIVE'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-gray-300">
                                            {banner.impressions?.toLocaleString() || 0}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-gray-300">
                                            {banner.clicks?.toLocaleString() || 0}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${getCTRColor(banner.ctr || '0')}`}>
                                                {banner.ctr}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => openModal(banner)}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(banner.id)}
                                                className="text-red-400 hover:text-red-300 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#1b2838] w-full max-w-lg rounded-xl border border-white/10 shadow-2xl"
                            >
                                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                    <h3 className="text-xl font-bold">{editingBanner ? 'Edit Banner' : 'New Banner'}</h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Media URL (Image/Video)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="w-full bg-[#0d121a] border border-white/10 rounded p-2 text-white focus:border-blue-500 outline-none"
                                                value={formData.media_url}
                                                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Redirect URL</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#0d121a] border border-white/10 rounded p-2 text-white focus:border-blue-500 outline-none"
                                            value={formData.redirect_url}
                                            onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Priority</label>
                                            <input
                                                type="number"
                                                className="w-full bg-[#0d121a] border border-white/10 rounded p-2 text-white focus:border-blue-500 outline-none"
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="flex items-end mb-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_active}
                                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span>Active Status</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-400 hover:text-white font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveBanner}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-lg shadow-lg"
                                    >
                                        {editingBanner ? 'Save Changes' : 'Create Banner'}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdsManagement;
