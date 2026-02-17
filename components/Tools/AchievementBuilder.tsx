import React, { useState, useRef, useEffect } from 'react';
import { Type, Image as ImageIcon, Download, Trash, GripHorizontal, Palette, Settings, Sliders, Type as TypeIcon, Sparkles, Info, AlertTriangle, ExternalLink, HelpCircle } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion, Reorder } from 'framer-motion';

// --- Types ---
interface AchievementSlot {
    id: string;
    type: 'text' | 'image';
    content: string;
    name: string;
    description: string;
    // Overrides for specific slots
    font?: string;
    bgConfig?: BackgroundConfig;
    textConfig?: TextConfig;
}

interface BackgroundConfig {
    style: 'glass' | 'gradient-linear' | 'gradient-radial' | 'transparent';
    color1: string;
    color2: string;
    opacity: number;
    filters: {
        glossy: boolean;
        innerGlow: boolean;
        halftone: boolean;
    };
}

interface TextConfig {
    fontFamily: string;
    alignment: 'top' | 'center' | 'bottom';
    letterSpacing: number; // For single chars, maybe less relevant but good for multi-char if we support it
    fontSize: number;
    shadow: boolean;
    outline: boolean;
}

// --- Constants ---
const FONT_CATEGORIES = {
    'Classic': [
        { name: 'Inter', value: 'Inter, sans-serif' },
        { name: 'Bebas Neue', value: '"Bebas Neue", sans-serif' },
    ],
    'Serif': [
        { name: 'Cinzel', value: '"Cinzel", serif' },
    ],
    'Tech': [
        { name: 'Orbitron', value: '"Orbitron", sans-serif' },
        { name: 'Cyberpunk', value: '"Share Tech Mono", monospace' }, // Fallback example
    ],
    'Retro': [
        { name: 'Pixel', value: '"Press Start 2P", monospace' },
        { name: 'Gothic', value: '"UnifrakturMaguntia", cursive' }, // Fallback example
    ]
};

const DEFAULT_BG_CONFIG: BackgroundConfig = {
    style: 'gradient-linear',
    color1: '#3b82f6',
    color2: '#1e3a8a',
    opacity: 1,
    filters: { glossy: false, innerGlow: false, halftone: false }
};

const DEFAULT_TEXT_CONFIG: TextConfig = {
    fontFamily: 'Inter, sans-serif',
    alignment: 'center',
    letterSpacing: 0,
    fontSize: 140,
    shadow: true,
    outline: false
};

const AchievementBuilder: React.FC = () => {
    // State
    const [slots, setSlots] = useState<AchievementSlot[]>([]);
    const [inputText, setInputText] = useState('');
    const [generating, setGenerating] = useState(false);

    // Global Settings (applied to new ones, or can be bulk applied)
    const [globalBgConfig, setGlobalBgConfig] = useState<BackgroundConfig>(DEFAULT_BG_CONFIG);
    const [globalTextConfig, setGlobalTextConfig] = useState<TextConfig>(DEFAULT_TEXT_CONFIG);

    // Selected Slot ID for editing (null means using global settings)
    const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

    // --- Actions ---

    // 1. Generate Text Achievements
    const generateFromText = () => {
        if (!inputText) return;
        setGenerating(true);

        const newSlots: AchievementSlot[] = inputText.split('').map((char, i) => ({
            id: `text-${Date.now()}-${i}`,
            type: 'text',
            content: char,
            name: `Achievement ${slots.length + i + 1}`,
            description: `Unlocked by SteamCanvas`,
            // Inherit global configs at creation time
            bgConfig: { ...globalBgConfig },
            textConfig: { ...globalTextConfig }
        }));

        setSlots([...slots, ...newSlots]);
        setInputText('');
        setGenerating(false);
    };

    // 2. Upload Custom Image
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const newSlot: AchievementSlot = {
                        id: `img-${Date.now()}`,
                        type: 'image',
                        content: event.target.result as string,
                        name: `Custom Icon`,
                        description: `Uploaded via SteamCanvas`,
                    };
                    setSlots([...slots, newSlot]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // 3. Global Updates
    const applyGlobalToAll = () => {
        setSlots(slots.map(s => ({
            ...s,
            bgConfig: { ...globalBgConfig },
            textConfig: { ...globalTextConfig }
        })));
    };

    // Live Preview Effect: Automatically sync global config to all slots when changed
    // This allows the user to see changes instantly without clicking "Apply to All"
    useEffect(() => {
        if (slots.length > 0) {
            setSlots(prevSlots => prevSlots.map(s => {
                // Optimization: Skip update if configs are identical (deep check would be expensive, 
                // but react usually handles object identity checks. Here we always return new objects
                // to force Canvas re-render which is what we want for live preview).
                return {
                    ...s,
                    bgConfig: { ...globalBgConfig },
                    textConfig: { ...globalTextConfig }
                };
            }));
        }
    }, [globalBgConfig, globalTextConfig]);

    const updateSlotContent = (id: string, newContent: string) => {
        setSlots(slots.map(s => s.id === id ? { ...s, content: newContent } : s));
    }


    // --- Canvas Rendering Helper (Shared) ---
    const drawToContext = (ctx: CanvasRenderingContext2D, slot: AchievementSlot, width = 256, height = 256) => {
        const bg = slot.bgConfig || DEFAULT_BG_CONFIG;
        const txt = slot.textConfig || DEFAULT_TEXT_CONFIG;

        // 1. Clear
        ctx.clearRect(0, 0, width, height);

        // 2. Background
        if (bg.style === 'transparent') {
            // Do nothing
        } else {
            ctx.globalAlpha = bg.opacity;
            let fillStyle: string | CanvasGradient = bg.color1;

            if (bg.style === 'gradient-linear') {
                const grad = ctx.createLinearGradient(0, 0, width, height);
                grad.addColorStop(0, bg.color1);
                grad.addColorStop(1, bg.color2);
                fillStyle = grad;
            } else if (bg.style === 'gradient-radial') {
                const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
                grad.addColorStop(0, bg.color1);
                grad.addColorStop(1, bg.color2);
                fillStyle = grad;
            } else if (bg.style === 'glass') {
                const grad = ctx.createLinearGradient(0, 0, 256, 256);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
                grad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
                fillStyle = grad;
            }

            ctx.fillStyle = fillStyle;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
        }

        // 3. Background Filters
        if (bg.filters.halftone) {
            // Simple dot pattern
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            for (let i = 0; i < width; i += 8) {
                for (let j = 0; j < height; j += 8) {
                    if ((i + j) % 16 === 0) ctx.fillRect(i, j, 2, 2);
                }
            }
        }
        if (bg.filters.innerGlow) {
            ctx.shadowColor = 'rgba(255,255,255,0.5)';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 4;
            ctx.strokeRect(2, 2, width - 4, height - 4);
            ctx.shadowBlur = 0;
        }
        if (bg.filters.glossy) {
            const grad = ctx.createLinearGradient(0, 0, 0, height / 2);
            grad.addColorStop(0, 'rgba(255,255,255,0.2)');
            grad.addColorStop(1, 'rgba(255,255,255,0.0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height / 2);
        }

        // 4. Text
        if (slot.type === 'text') {
            ctx.fillStyle = 'white';
            ctx.font = `bold ${txt.fontSize}px ${txt.fontFamily}`;
            ctx.textAlign = 'center';

            let yPos = height / 2;
            if (txt.alignment === 'top') {
                ctx.textBaseline = 'top';
                yPos = 20;
            } else if (txt.alignment === 'bottom') {
                ctx.textBaseline = 'bottom';
                yPos = height - 20;
            } else {
                ctx.textBaseline = 'middle';
                yPos = height / 2 + (txt.fontSize * 0.05); // Optical adjustment
            }

            if (txt.shadow) {
                ctx.shadowColor = 'rgba(0,0,0,0.6)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 4;
                ctx.shadowOffsetY = 4;
            }

            if (txt.outline) {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 6;
                ctx.strokeText(slot.content.toUpperCase(), width / 2, yPos);
            }

            ctx.fillText(slot.content.toUpperCase(), width / 2, yPos);

            // Reset Shadow
            ctx.shadowColor = 'transparent';
        }
    };


    // --- Download Logic ---
    const handleDownloadAll = async () => {
        const zip = new JSZip();
        // Metadata array
        const metadataItems: { filename: string, name: string, description: string }[] = [];

        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const promises = slots.map(async (slot, index) => {
            return new Promise<void>((resolve) => {
                const filename = `ach_${index + 1}.png`;
                metadataItems.push({
                    filename,
                    name: slot.name,
                    description: slot.description
                });

                if (slot.type === 'image') {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = slot.content;
                    img.onload = () => {
                        ctx.clearRect(0, 0, 256, 256);
                        const scale = Math.max(256 / img.width, 256 / img.height);
                        const x = (256 - img.width * scale) / 2;
                        const y = (256 - img.height * scale) / 2;
                        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                        canvas.toBlob(blob => {
                            if (blob) zip.file(filename, blob);
                            resolve();
                        });
                    };
                } else {
                    drawToContext(ctx, slot);
                    canvas.toBlob(blob => {
                        if (blob) zip.file(filename, blob);
                        resolve();
                    });
                }
            });
        });

        await Promise.all(promises);

        // Add metadata.json
        zip.file("metadata.json", JSON.stringify(metadataItems, null, 2));

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'steam_achievements_bundle.zip');
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 lg:p-8 space-y-10">
            {/* Header */}
            <div className="text-center space-y-3">
                <h2 className="text-5xl font-black italic text-white tracking-tighter uppercase relative inline-block">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 pr-2">
                        Achievement Forge V2
                    </span>
                </h2>
                <p className="text-gray-400 text-lg">Advanced shader effects, layout controls, and batch processing.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: Controls Panel */}
                <div className="lg:col-span-4 space-y-6">

                    {/* 1. Generator Input */}
                    <div className="bg-[#151921] rounded-2xl border border-white/10 p-5 space-y-4">
                        <div className="flex items-center gap-2 text-white font-bold">
                            <TypeIcon className="text-cyan-400" size={20} />
                            <h3>Generator</h3>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="TYPE TEXT..."
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:ring-1 focus:ring-cyan-400 outline-none"
                            />
                            <button
                                onClick={generateFromText}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-sm uppercase"
                            >
                                Create
                            </button>
                        </div>
                        <div className="relative overflow-hidden group rounded-lg border border-white/10 bg-black/20 p-3 text-center cursor-pointer hover:bg-white/5 transition-all">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                            <div className="flex flex-col items-center gap-1">
                                <ImageIcon className="text-gray-400 group-hover:text-white" size={20} />
                                <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-white">Upload Icon</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Global Styling Controls */}
                    <div className="bg-[#151921] rounded-2xl border border-white/10 p-5 space-y-6">
                        <div className="flex items-center justify-between text-white font-bold">
                            <div className="flex items-center gap-2">
                                <Sliders className="text-purple-400" size={20} />
                                <h3>Global Styles</h3>
                            </div>
                            <button onClick={applyGlobalToAll} className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-cyan-300">
                                Apply to All
                            </button>
                        </div>

                        {/* Typography Settings */}
                        <div className="space-y-3 pt-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Typography</label>
                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    value={globalTextConfig.fontFamily}
                                    onChange={(e) => setGlobalTextConfig({ ...globalTextConfig, fontFamily: e.target.value })}
                                    className="col-span-2 bg-black/40 border border-white/10 rounded-md px-2 py-1.5 text-xs text-white outline-none"
                                >
                                    {Object.entries(FONT_CATEGORIES).map(([cat, fonts]) => (
                                        <optgroup key={cat} label={cat}>
                                            {fonts.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                                        </optgroup>
                                    ))}
                                </select>
                                <div className="flex bg-black/40 rounded-md border border-white/10 p-0.5">
                                    {['top', 'center', 'bottom'].map((align) => (
                                        <button
                                            key={align}
                                            onClick={() => setGlobalTextConfig({ ...globalTextConfig, alignment: align as any })}
                                            className={`flex-1 text-[10px] uppercase py-1 rounded transition-colors ${globalTextConfig.alignment === align ? 'bg-white/20 text-white' : 'text-gray-500'}`}
                                        >
                                            {align.charAt(0)}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setGlobalTextConfig({ ...globalTextConfig, shadow: !globalTextConfig.shadow })}
                                        className={`flex-1 text-[10px] py-1 border rounded-md transition-all ${globalTextConfig.shadow ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'border-white/10 text-gray-500'}`}
                                    >
                                        Shadow
                                    </button>
                                    <button
                                        onClick={() => setGlobalTextConfig({ ...globalTextConfig, outline: !globalTextConfig.outline })}
                                        className={`flex-1 text-[10px] py-1 border rounded-md transition-all ${globalTextConfig.outline ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'border-white/10 text-gray-500'}`}
                                    >
                                        Outline
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-gray-400">
                                    <span>Scale</span>
                                    <span>{globalTextConfig.fontSize}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="50" max="220"
                                    value={globalTextConfig.fontSize}
                                    onChange={(e) => setGlobalTextConfig({ ...globalTextConfig, fontSize: parseInt(e.target.value) })}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Background Settings */}
                        <div className="space-y-3 pt-2 border-t border-white/5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Background</label>

                            {/* Mode Select */}
                            <div className="flex bg-black/40 rounded-md border border-white/10 p-0.5">
                                {['glass', 'linear', 'radial', 'none'].map((s) => {
                                    const map: Record<string, string> = { 'glass': 'Glass', 'linear': 'Lin', 'radial': 'Rad', 'none': 'None' };
                                    const valMap: Record<string, any> = { 'glass': 'glass', 'linear': 'gradient-linear', 'radial': 'gradient-radial', 'none': 'transparent' };

                                    return (
                                        <button
                                            key={s}
                                            onClick={() => setGlobalBgConfig({ ...globalBgConfig, style: valMap[s] })}
                                            className={`flex-1 text-[10px] uppercase py-1 rounded transition-colors ${globalBgConfig.style === valMap[s] ? 'bg-white/20 text-white' : 'text-gray-500'}`}
                                        >
                                            {map[s]}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Color Pickers */}
                            {globalBgConfig.style.includes('gradient') && (
                                <div className="flex gap-2">
                                    <div className="w-full">
                                        <label className="text-[9px] text-gray-500">Color 1</label>
                                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded px-2 py-1">
                                            <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: globalBgConfig.color1 }} />
                                            <input type="text" value={globalBgConfig.color1} onChange={(e) => setGlobalBgConfig({ ...globalBgConfig, color1: e.target.value })} className="bg-transparent w-full text-[10px] text-white outline-none font-mono" />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <label className="text-[9px] text-gray-500">Color 2</label>
                                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded px-2 py-1">
                                            <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: globalBgConfig.color2 }} />
                                            <input type="text" value={globalBgConfig.color2} onChange={(e) => setGlobalBgConfig({ ...globalBgConfig, color2: e.target.value })} className="bg-transparent w-full text-[10px] text-white outline-none font-mono" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Filters */}
                            <div className="grid grid-cols-3 gap-2">
                                {Object.keys(globalBgConfig.filters).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setGlobalBgConfig({
                                            ...globalBgConfig,
                                            filters: { ...globalBgConfig.filters, [f]: !globalBgConfig.filters[f as keyof typeof globalBgConfig.filters] }
                                        })}
                                        className={`text-[9px] uppercase py-1.5 border rounded-md transition-all ${globalBgConfig.filters[f as keyof typeof globalBgConfig.filters] ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'border-white/10 text-gray-500'}`}
                                    >
                                        {f.replace(/([A-Z])/g, ' $1').trim()}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-gray-400">
                                    <span>Opacity</span>
                                    <span>{Math.round(globalBgConfig.opacity * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="1" step="0.1"
                                    value={globalBgConfig.opacity}
                                    onChange={(e) => setGlobalBgConfig({ ...globalBgConfig, opacity: parseFloat(e.target.value) })}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                        </div>
                    </div>
                </div>


                {/* RIGHT: Preview & Showcase Grid */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Toolbar */}
                    <div className="flex justify-between items-center bg-[#151921] p-4 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-2 text-white/80">
                            <GripHorizontal size={18} />
                            <span className="text-sm font-bold">Showcase Preview</span>
                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded ml-2">7 Slots</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="group relative">
                                <Info size={18} className="text-gray-500 hover:text-white cursor-help transition-colors" />
                                <div className="absolute right-0 top-8 w-64 p-3 bg-black/90 border border-white/10 rounded-lg text-xs text-gray-300 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                    <p className="mb-1 text-white font-bold">Steam Limitation</p>
                                    Steam doesn&apos;t allow direct custom achievement uploads to official games. You must upload these as Artwork.
                                </div>
                            </div>
                            <button
                                onClick={handleDownloadAll}
                                disabled={slots.length === 0}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg hover:shadow-green-500/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={16} />
                                <span>Download Bundle</span>
                            </button>
                        </div>
                    </div>

                    {/* The Grid */}
                    <div className="bg-[#12141a] rounded-xl p-8 border border-white/5 min-h-[300px] flex items-center justify-center overflow-x-auto">

                        {slots.length === 0 ? (
                            <div className="text-center text-gray-600 space-y-4">
                                <Sparkles size={48} className="mx-auto opacity-20" />
                                <p>Generate text or upload icons to start building.</p>
                            </div>
                        ) : (
                            <Reorder.Group axis="x" values={slots} onReorder={setSlots} className="flex gap-3">
                                {slots.map((slot) => (
                                    <Reorder.Item key={slot.id} value={slot}>
                                        <div className="group relative w-[120px] flex-shrink-0">

                                            {/* Canvas Preview */}
                                            <div className="w-[120px] h-[120px] bg-[#000] border-2 border-[#3d4450] group-hover:border-steam-blue transition-colors relative">
                                                <CanvasPreview slot={slot} />

                                                {/* Hover Edit/Delete */}
                                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                    <button
                                                        onClick={() => setSlots(slots.filter(s => s.id !== slot.id))}
                                                        className="p-1 bg-red-500/80 text-white rounded text-xs hover:bg-red-500"
                                                    >
                                                        <Trash size={12} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Quick Edit Inputs */}
                                            <div className="mt-2 space-y-1">
                                                <input
                                                    value={slot.content}
                                                    onChange={(e) => updateSlotContent(slot.id, e.target.value)}
                                                    maxLength={slot.type === 'text' ? 1 : undefined}
                                                    className="w-full bg-[#1e232e] text-center text-white font-bold text-sm border border-transparent focus:border-steam-blue rounded py-1 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        )}

                    </div>

                    {/* Steam Technical Limits Info Box */}
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <AlertTriangle size={120} className="text-amber-500" />
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3 text-amber-200">
                                <AlertTriangle size={24} />
                                <h3 className="text-lg font-bold">How to use these icons</h3>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-amber-500/10">
                                    <span className="text-amber-400 font-bold">⚠️ Note:</span> Steam does not allow you to upload custom achievement icons directly to official games. These are intended for:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-1">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                            <ImageIcon size={14} className="text-cyan-400" /> Upload as Artwork
                                        </h4>
                                        <p className="text-xs text-gray-400">Combine icons into a single row and upload as an <b>Artwork Showcase</b> to mimic the look.</p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-1">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                            <Settings size={14} className="text-purple-400" /> Game Development
                                        </h4>
                                        <p className="text-xs text-gray-400">Use these as inspiration or assets for the official achievements in your own Steam games.</p>
                                    </div>
                                </div>

                                <div className="pt-2 flex flex-wrap gap-4 items-center justify-between text-xs text-gray-500">
                                    <p>Images are exported at 256x256px (High DPI) with metadata.json.</p>
                                    <a href="#" className="flex items-center gap-1 text-steam-blue hover:text-cyan-400 transition-colors">
                                        <HelpCircle size={14} />
                                        <span>Read Steam Customization Guide</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- Sub-Component for Drawing ---
const CanvasPreview: React.FC<{ slot: AchievementSlot }> = ({ slot }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                // We recreate the drawing function logic here or pass it down
                // For simplicity, we'll inline a minimal version that uses the passed slot config
                // In a real app, 'drawToContext' would be a pure utility function imported
                const width = 256;
                const height = 256;
                const bg = slot.bgConfig!;
                const txt = slot.textConfig!;

                // 1. Clear
                ctx.clearRect(0, 0, width, height);

                // 2. Background (If Image, draw image, else draw generated BG)
                if (slot.type === 'image') {
                    const img = new Image();
                    img.src = slot.content;
                    img.onload = () => {
                        const scale = Math.max(width / img.width, height / img.height);
                        const x = (width - img.width * scale) / 2;
                        const y = (height - img.height * scale) / 2;
                        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                    }
                } else {
                    try {
                        // Background Logic
                        if (bg.style !== 'transparent') {
                            ctx.globalAlpha = bg.opacity;
                            let fillStyle: string | CanvasGradient = bg.color1;

                            if (bg.style === 'gradient-linear') {
                                const grad = ctx.createLinearGradient(0, 0, width, height);
                                // Safety check: addColorStop can throw if color is invalid string
                                try {
                                    grad.addColorStop(0, bg.color1);
                                    grad.addColorStop(1, bg.color2);
                                } catch (e) {
                                    // Fallback if user is currently typing an invalid hex
                                    grad.addColorStop(0, '#000000');
                                    grad.addColorStop(1, '#000000');
                                }
                                fillStyle = grad;
                            } else if (bg.style === 'gradient-radial') {
                                const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
                                try {
                                    grad.addColorStop(0, bg.color1);
                                    grad.addColorStop(1, bg.color2);
                                } catch (e) {
                                    grad.addColorStop(0, '#000000');
                                    grad.addColorStop(1, '#000000');
                                }
                                fillStyle = grad;
                            } else if (bg.style === 'glass') {
                                const grad = ctx.createLinearGradient(0, 0, 256, 256);
                                grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
                                grad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
                                fillStyle = grad;
                            }

                            ctx.fillStyle = fillStyle;
                            ctx.fillRect(0, 0, width, height);
                            ctx.globalAlpha = 1.0;
                        }
                    } catch (err) {
                        // Critical fallback
                        ctx.fillStyle = '#000';
                        ctx.fillRect(0, 0, width, height);
                    }

                    // BG Filters
                    if (bg.filters.halftone) {
                        ctx.fillStyle = 'rgba(0,0,0,0.1)';
                        for (let i = 0; i < width; i += 8) { // Coarser dot for visibility
                            for (let j = 0; j < height; j += 8) {
                                if ((i + j) % 16 === 0) ctx.fillRect(i, j, 3, 3);
                            }
                        }
                    }
                    if (bg.filters.innerGlow) {
                        ctx.shadowColor = 'rgba(255,255,255,0.6)';
                        ctx.shadowBlur = 30;
                        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                        ctx.lineWidth = 6;
                        ctx.strokeRect(3, 3, width - 6, height - 6);
                        ctx.shadowBlur = 0;
                    }
                    if (bg.filters.glossy) {
                        const grad = ctx.createLinearGradient(0, 0, 0, height / 2);
                        grad.addColorStop(0, 'rgba(255,255,255,0.25)');
                        grad.addColorStop(1, 'rgba(255,255,255,0.0)');
                        ctx.fillStyle = grad;
                        ctx.fillRect(0, 0, width, height / 2);
                    }

                    // Text
                    ctx.fillStyle = 'white';
                    ctx.font = `bold ${txt.fontSize}px ${txt.fontFamily}`;
                    ctx.textAlign = 'center';

                    let yPos = height / 2;
                    if (txt.alignment === 'top') {
                        ctx.textBaseline = 'top';
                        yPos = 20;
                    } else if (txt.alignment === 'bottom') {
                        ctx.textBaseline = 'bottom';
                        yPos = height - 20;
                    } else {
                        ctx.textBaseline = 'middle';
                        yPos = height / 2 + (txt.fontSize * 0.05);
                    }

                    if (txt.shadow) {
                        ctx.shadowColor = 'rgba(0,0,0,0.8)';
                        ctx.shadowBlur = 15;
                        ctx.shadowOffsetX = 5;
                        ctx.shadowOffsetY = 5;
                    }

                    if (txt.outline) {
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 8;
                        ctx.strokeText(slot.content.toUpperCase(), width / 2, yPos);
                    }

                    ctx.fillText(slot.content.toUpperCase(), width / 2, yPos);
                    ctx.shadowColor = 'transparent'; // Reset
                }
            }
        }
    }, [slot]); // Redraw when slot config changes

    return <canvas ref={canvasRef} width={256} height={256} className="w-full h-full object-cover" />;
};

export default AchievementBuilder;
