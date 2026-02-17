
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Palette, Droplet, Sun, Moon, Zap, Copy, Check, Info, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorSwatch, rgbToHex } from '../../utils/colorLogic';

// Default worker import for Vite
import ColorWorker from '../../workers/colorAnalysis.worker.ts?worker';

const ColorExtractor: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [palette, setPalette] = useState<ColorSwatch[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [copiedColor, setCopiedColor] = useState<string | null>(null);
    const [activeThemeColor, setActiveThemeColor] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const workerRef = useRef<Worker | null>(null);

    // Initialize Worker
    useEffect(() => {
        workerRef.current = new ColorWorker();

        workerRef.current.onmessage = (e: MessageEvent) => {
            const { palette, error } = e.data;
            if (palette) {
                setPalette(palette);
                // Auto-select first vibrant or dominant color if needed
            }
            setIsProcessing(false);
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    // Apply/Revert Dynamic Theme
    const applyTheme = (colorHex: string | null) => {
        if (colorHex === activeThemeColor) {
            // Revert
            document.documentElement.style.removeProperty('--steam-blue');
            document.documentElement.style.removeProperty('--steam-blue-rgb');
            setActiveThemeColor(null);
        } else if (colorHex) {
            // Apply
            document.documentElement.style.setProperty('--steam-blue', colorHex);
            // Rough RGB conversion
            const r = parseInt(colorHex.slice(1, 3), 16);
            const g = parseInt(colorHex.slice(3, 5), 16);
            const b = parseInt(colorHex.slice(5, 7), 16);
            document.documentElement.style.setProperty('--steam-blue-rgb', `${r}, ${g}, ${b}`);
            setActiveThemeColor(colorHex);
        }
    };

    // Cleanup theme on unmount
    useEffect(() => {
        return () => {
            document.documentElement.style.removeProperty('--steam-blue');
            document.documentElement.style.removeProperty('--steam-blue-rgb');
        };
    }, []);

    const processImage = useCallback((file: File) => {
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        setIsProcessing(true);
        setPalette([]);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;

        img.onload = () => {
            if (!canvasRef.current || !workerRef.current) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Scale down for performance (max 200px)
            const MAX_SIZE = 200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height);

            // Send to worker
            workerRef.current.postMessage({
                pixels: imageData.data,
                maxColors: 6
            });
        };
    }, []);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const uploadedFile = e.dataTransfer.files[0];
            if (uploadedFile.type.startsWith('image/')) {
                setFile(uploadedFile);
                processImage(uploadedFile);
            }
        }
    };

    const copyToClipboard = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedColor(hex);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px] animate-in fade-in duration-500 p-6">

            {/* Hidden Canvas for Processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Left: Input & Preview */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">

                {/* Upload Zone */}
                <div
                    className={`relative border-2 border-dashed rounded-3xl transition-all h-[300px] flex flex-col items-center justify-center cursor-pointer group overflow-hidden
                        ${dragActive ? 'border-steam-blue bg-steam-blue/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                        ${imageUrl ? 'border-none p-0' : 'p-6'}
                    `}
                    onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                    onDragOver={(e) => { e.preventDefault(); }}
                    onDrop={handleDrop}
                >
                    {imageUrl ? (
                        <>
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-3xl opacity-50 group-hover:opacity-30 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <label className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 text-white font-bold cursor-pointer hover:bg-black/70 hover:scale-105 transition-all">
                                    Change Image
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setFile(e.target.files[0]);
                                            processImage(e.target.files[0]);
                                        }
                                    }} />
                                </label>
                            </div>
                        </>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload className="text-white/40 group-hover:text-steam-blue transition-colors" size={32} />
                            </div>
                            <p className="text-white font-bold mb-2">Drag & Drop Image</p>
                            <p className="text-white/40 text-xs uppercase tracking-widest">JPG, PNG, WEBP</p>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setFile(e.target.files[0]);
                                    processImage(e.target.files[0]);
                                }
                            }} />
                        </label>
                    )}
                </div>

                {/* Instructions */}
                <div className="bg-[#12141a] rounded-2xl p-6 border border-white/10">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Info size={16} className="text-steam-blue" />
                        How to Use
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-sm text-gray-400">
                            <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                            Upload any game background or artwork.
                        </li>
                        <li className="flex gap-3 text-sm text-gray-400">
                            <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                            Our algorithm extracts the dominant palette.
                        </li>
                        <li className="flex gap-3 text-sm text-gray-400">
                            <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                            Click "Apply Theme" to preview it live.
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right: Palette Result */}
            <div className="w-full lg:w-2/3 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <Palette className="text-steam-blue" />
                        Extracted Palette
                    </h2>
                    {palette.length > 0 && (
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-green-400 font-bold uppercase tracking-wide">Analysis Complete</span>
                        </div>
                    )}
                </div>

                {isProcessing ? (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border border-white/5 rounded-3xl bg-[#12141a]">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-steam-blue/20 border-t-steam-blue rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Zap size={16} className="text-steam-blue animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-6 text-white font-bold text-lg">Analyzing Colors...</p>
                        <p className="text-white/40 text-sm">Quantizing pixel data</p>
                    </div>
                ) : palette.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {palette.map((swatch, idx) => (
                            <motion.div
                                key={`${swatch.hex}-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-[#1c212b] rounded-2xl border border-white/10 overflow-hidden hover:border-steam-blue/50 transition-all shadow-lg"
                            >
                                <div className="p-4 flex gap-4 items-center">
                                    {/* Swatch Preview */}
                                    <div
                                        className="w-16 h-16 rounded-xl shadow-inner shrink-0 transition-transform group-hover:scale-105"
                                        style={{ backgroundColor: swatch.hex }}
                                    />

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-lg font-bold text-white font-mono tracking-wider">{swatch.hex}</span>
                                            {swatch.role && (
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border 
                                                    ${swatch.role === 'Vibrant' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                                                        swatch.role === 'Muted' ? 'text-gray-400 border-gray-500/30 bg-gray-500/10' :
                                                            swatch.role === 'Dark' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' :
                                                                'text-blue-400 border-blue-500/30 bg-blue-500/10'
                                                    }
                                                `}>
                                                    {swatch.role}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                                            <span>RGB: {swatch.r}, {swatch.g}, {swatch.b}</span>
                                            <span>•</span>
                                            <span>Freq: {((swatch.count / (canvasRef.current?.width || 1) / (canvasRef.current?.height || 1)) * 100).toFixed(1)}%</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => copyToClipboard(swatch.hex)}
                                                className="flex-1 py-1.5 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors border border-white/5"
                                            >
                                                {copiedColor === swatch.hex ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                                {copiedColor === swatch.hex ? 'Copied' : 'Copy'}
                                            </button>

                                            <button
                                                onClick={() => applyTheme(swatch.hex)}
                                                className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all border
                                                    ${activeThemeColor === swatch.hex
                                                        ? 'bg-steam-blue text-black border-steam-blue'
                                                        : 'bg-white/5 text-white hover:bg-white/10 border-white/5'
                                                    }
                                                `}
                                            >
                                                <Droplet size={12} />
                                                {activeThemeColor === swatch.hex ? 'Active' : 'Preview'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Accessibility Badge */}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    {swatch.contrastWhite >= 4.5 && (
                                        <div title="Passes WCAG AA on White" className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    )}
                                    {swatch.contrastDark >= 4.5 && (
                                        <div title="Passes WCAG AA on Dark" className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-white/5 rounded-3xl bg-[#12141a]">
                        <ImageIcon size={48} className="text-white/10 mb-4" />
                        <p className="text-white/40 text-sm font-medium">Upload an image to extract colors</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColorExtractor;
