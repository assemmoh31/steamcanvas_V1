import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Download, RefreshCw, AlertTriangle, Zap, Check, ImageIcon } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

const GifOptimizer: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [originalPreview, setOriginalPreview] = useState<string | null>(null);
    const [accessUrl, setAccessUrl] = useState<string | null>(null);

    // Optimization Settings
    const [quality, setQuality] = useState(75);
    const [format, setFormat] = useState<'original' | 'webp' | 'avif'>('original');
    const [width, setWidth] = useState<number | ''>('');
    const [height, setHeight] = useState<number | ''>('');
    const [fit, setFit] = useState<'scale-down' | 'contain'>('scale-down');

    const [isUploading, setIsUploading] = useState(false);
    const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null);
    const [optimizedSize, setOptimizedSize] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // File Selection
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setOriginalPreview(URL.createObjectURL(selectedFile));
            setAccessUrl(null);
            setOptimizedUrl(null);

            // Auto Upload to Temp
            await uploadFile(selectedFile);
        }
    };

    const uploadFile = async (fileToUpload: File) => {
        setIsUploading(true);
        try {
            // 1. Upload via Proxy (FormData)
            const formData = new FormData();
            formData.append('file', fileToUpload);

            const response = await fetch(`${API_BASE_URL}/api/v1/tools/gif-optimizer/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to upload');
            }

            const { accessUrl } = await response.json();
            setAccessUrl(accessUrl);

        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image for processing.');
        } finally {
            setIsUploading(false);
        }
    };

    // Update Optimized URL when settings change
    useEffect(() => {
        if (!accessUrl) return;

        const fetchOptimized = async () => {
            setIsProcessing(true);
            try {
                const params = new URLSearchParams();
                params.append('url', accessUrl);
                params.append('quality', quality.toString());
                if (format !== 'original') params.append('format', format);
                if (width) params.append('width', width.toString());
                if (height) params.append('height', height.toString());
                params.append('fit', fit);

                const url = `${API_BASE_URL}/api/v1/tools/gif-optimizer?${params.toString()}`;

                // Fetch the blob to get size and ensure content is ready
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to optimize');

                const blob = await res.blob();
                const objUrl = URL.createObjectURL(blob);

                setOptimizedUrl(objUrl);
                setOptimizedSize(blob.size);
            } catch (e) {
                console.error("Optimization fetch error", e);
            } finally {
                setIsProcessing(false);
            }
        };

        const timeout = setTimeout(fetchOptimized, 500); // 500ms debounce
        return () => clearTimeout(timeout);

    }, [accessUrl, quality, format, width, height, fit]);

    const handleDownload = async () => {
        if (!optimizedUrl || !file) return;

        try {
            // optimizedUrl is now a Blob URL (blob:http://...)
            const link = document.createElement('a');
            link.href = optimizedUrl;

            // Determine extension
            let ext = file.name.split('.').pop();
            if (format === 'webp') ext = 'webp';
            if (format === 'avif') ext = 'avif';

            link.download = `optimized_${file.name.split('.')[0]}.${ext}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Don't revoke URL here as it's used for preview
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download optimized image.');
        }
    };

    // Presets
    const applyPreset = (type: 'steam-5mb' | 'steam-10mb') => {
        // Heuristic presets
        if (type === 'steam-5mb') {
            setFormat('webp'); // WebP is vastly superior for size
            setQuality(75);
            setFit('scale-down');
            // We can't know the exact size result without trying, but this is a good start
        } else {
            setFormat('webp');
            setQuality(85);
        }
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8 min-h-[600px] animate-in fade-in duration-500 p-6">

            {/* Controls */}
            <div className="w-full xl:w-1/3 space-y-6">
                <div className="bg-[#12141a] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Zap size={18} className="text-yellow-400" /> Optimizer Settings
                    </h3>

                    {/* File Upload */}
                    <div className="mb-8">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-white transition-colors" />
                                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">GIF, WEBP, PNG (MAX. 50MB)</p>
                            </div>
                            <input type="file" className="hidden" onChange={handleFileSelect} accept="image/gif,image/webp,image/png,image/jpeg" />
                        </label>
                    </div>

                    {/* Controls Form */}
                    <div className="space-y-6">
                        {/* Quality */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Quality</label>
                                <span className="text-xs font-bold text-steam-blue">{quality}%</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={quality}
                                onChange={(e) => setQuality(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-steam-blue"
                            />
                        </div>

                        {/* Format */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Format</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['original', 'webp', 'avif'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFormat(f as any)}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${format === f ? 'bg-steam-blue text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        {f === 'original' ? 'GIF (Orig)' : f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Width</label>
                                <input
                                    type="number"
                                    placeholder="Original"
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-steam-blue focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Height</label>
                                <input
                                    type="number"
                                    placeholder="Original"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-steam-blue focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Steam Presets */}
                        <div className="pt-4 border-t border-white/5">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">One-Click Optimization</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => applyPreset('steam-5mb')}
                                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-xs font-bold transition-all border border-white/5 hover:border-steam-blue/50"
                                >
                                    <Check size={14} className="text-green-400" /> Target &lt; 5MB
                                </button>
                                <button
                                    onClick={() => applyPreset('steam-10mb')}
                                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-xs font-bold transition-all border border-white/5 hover:border-steam-blue/50"
                                >
                                    <Check size={14} className="text-blue-400" /> Target &lt; 10MB
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Area */}
            <div className="w-full xl:w-2/3">
                <div className="bg-[#12141a] border border-white/5 rounded-3xl p-6 h-full min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <ImageIcon size={18} className="text-purple-400" /> Before & After
                        </h3>
                        {optimizedUrl && (
                            <button
                                onClick={handleDownload}
                                className="bg-steam-blue hover:bg-[#33c9dc] text-black px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all flex items-center gap-2"
                            >
                                <Download size={16} /> Download Result
                            </button>
                        )}
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                        {/* Before */}
                        <div className="relative bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center group">
                            {originalPreview ? (
                                <>
                                    <img src={originalPreview} alt="Original" className="max-w-full max-h-[400px] object-contain" />
                                    <div className="absolute top-4 left-4 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                                        Original
                                    </div>
                                    {file && (
                                        <div className="absolute bottom-4 left-4 bg-black/70 text-gray-300 text-[10px] font-mono px-2 py-1 rounded backdrop-blur-sm">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-gray-600 flex flex-col items-center">
                                    <ImageIcon size={48} className="opacity-20 mb-2" />
                                    <span className="text-xs font-bold uppercase">No Source</span>
                                </div>
                            )}
                        </div>

                        {/* After */}
                        <div className="relative bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center group">
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-3 animate-pulse">
                                    <RefreshCw className="animate-spin text-steam-blue" size={32} />
                                    <span className="text-sm font-bold text-steam-blue">Uploading to Processor...</span>
                                </div>
                            ) : optimizedUrl ? (
                                <>
                                    <img src={optimizedUrl} alt="Optimized" className="max-w-full max-h-[400px] object-contain" />
                                    <div className="absolute top-4 left-4 bg-black/70 text-steam-blue text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-steam-blue/20">
                                        Optimized
                                    </div>
                                    {/* Size Display */}
                                    {optimizedSize && (
                                        <div className={`absolute bottom-4 left-4 text-[10px] font-mono px-2 py-1 rounded backdrop-blur-sm ${file && optimizedSize < file.size ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-black/70 text-gray-300'}`}>
                                            {(optimizedSize / 1024 / 1024).toFixed(2)} MB
                                            {file && optimizedSize < file.size && (
                                                <span className="ml-1 font-bold">
                                                    ({Math.round((1 - optimizedSize / file.size) * 100)}% smaller)
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Optimization Warning */}
                                    {file && optimizedSize === file.size && !isProcessing && (
                                        <div className="absolute bottom-12 left-4 right-4 bg-yellow-500/10 border border-yellow-500/50 p-2 rounded text-[10px] text-yellow-200 flex gap-2 items-center">
                                            <AlertTriangle size={12} className="shrink-0" />
                                            <span>
                                                Size unchanged? Cloudflare Image Resizing requires a Paid Subscription or Custom Domain Zone. It may not work on free `workers.dev` subdomains.
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-gray-600 flex flex-col items-center">
                                    <RefreshCw size={48} className="opacity-20 mb-2" />
                                    <span className="text-xs font-bold uppercase">Preview Pending</span>
                                </div>
                            )}

                            {(!optimizedUrl && accessUrl && !isUploading) || isProcessing ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                                    <span className="text-xs text-gray-400 flex flex-col items-center gap-2">
                                        <RefreshCw className="animate-spin text-steam-blue" size={24} />
                                        Processing...
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GifOptimizer;
