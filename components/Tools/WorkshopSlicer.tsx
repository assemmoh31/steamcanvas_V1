
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Scissors, Layers, Download, Check, AlertTriangle, Play, RefreshCw, X, Copy, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { toBlobURL } from '@ffmpeg/util';

const WorkshopSlicer: React.FC = () => {
    // --- State ---
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLongWorkshop, setIsLongWorkshop] = useState(true);
    const [cropY, setCropY] = useState(0); // Vertical offset of the crop area
    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedZips, setGeneratedZips] = useState<{ blob: Blob, name: string } | null>(null);
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const ffmpegRef = useRef<FFmpeg | null>(null);

    // --- Constants ---
    const PANEL_WIDTH = 150;
    const PANEL_GAP = 4;
    const TOTAL_WIDTH = 5 * 150 + 4 * 4;

    // --- FFmpeg Loading ---
    // --- FFmpeg Loading ---
    const loadFFmpeg = async () => {
        if (ffmpegRef.current) return;
        const ffmpeg = new FFmpeg();
        ffmpeg.on('log', ({ message }) => console.log(message));
        ffmpeg.on('progress', ({ progress, time }) => {
            setProgress(Math.min(99, Math.round(progress * 100)));
        });

        try {
            setStatusText("Loading Engine...");
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            ffmpegRef.current = ffmpeg;
            setFfmpegLoaded(true);
            setStatusText("Engine Ready");
        } catch (e) {
            console.error("FFmpeg load failed:", e);
            setStatusText("Engine Fail");
            alert("Failed to load FFmpeg. Please ensure your browser supports SharedArrayBuffer.");
        }
    };

    // --- File Handling ---
    const handleFile = (file: File) => {
        if (!file) return;
        setFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setGeneratedZips(null);

        if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.onloadedmetadata = () => {
                setImageDimensions({ width: video.videoWidth, height: video.videoHeight });
                setCropY(0);
            };
            video.src = url;
        } else {
            const img = new Image();
            img.onload = () => {
                setImageDimensions({ width: img.width, height: img.height });
                setCropY(0);
            };
            img.src = url;
        }

        if (file.type.includes('gif') || file.type.includes('video')) {
            loadFFmpeg();
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    // --- Slice Logic ---
    const sliceImage = async () => {
        if (!file || !previewUrl) return;
        setIsProcessing(true);
        setProgress(0);
        setStatusText("Initializing...");

        try {
            const zip = new JSZip();
            const isGif = file.type.includes('gif') || file.type.includes('video');
            const cropHeight = isLongWorkshop ? Math.min(800, imageDimensions.height) : 150;
            const startX = (imageDimensions.width - TOTAL_WIDTH) / 2;

            if (isGif) {
                // --- GIF/Video Processing (FFmpeg) ---
                if (!ffmpegRef.current || !ffmpegLoaded) {
                    await loadFFmpeg();
                }
                const ffmpeg = ffmpegRef.current;
                if (!ffmpeg) throw new Error("FFmpeg not loaded");

                // Write input
                const data = await fetchFile(file);
                await ffmpeg.writeFile('input', data);

                for (let i = 0; i < 5; i++) {
                    const panelX = startX + (i * (PANEL_WIDTH + PANEL_GAP));
                    const outName = `workshop_${i + 1}.gif`;

                    // Run Crop Command
                    // -filter:v "crop=w:h:x:y"
                    await ffmpeg.exec([
                        '-i', 'input',
                        '-filter:v', `crop=${PANEL_WIDTH}:${cropHeight}:${panelX}:${cropY}`,
                        '-y',
                        outName
                    ]);

                    // Read Output
                    const outputData = await ffmpeg.readFile(outName);
                    zip.file(outName, outputData);

                    setProgress(20 + (i * 15));
                }

            } else {
                // --- Static Image Processing (Canvas) ---
                const img = new Image();
                img.src = previewUrl;
                await new Promise((resolve) => { img.onload = resolve; });

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error("Canvas context init failed");

                canvas.width = PANEL_WIDTH;
                canvas.height = cropHeight;

                for (let i = 0; i < 5; i++) {
                    const panelX = startX + (i * (PANEL_WIDTH + PANEL_GAP));

                    ctx.clearRect(0, 0, PANEL_WIDTH, cropHeight);
                    ctx.drawImage(img, panelX, cropY, PANEL_WIDTH, cropHeight, 0, 0, PANEL_WIDTH, cropHeight);

                    const fileType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                    const ext = file.type === 'image/png' ? 'png' : 'jpg';

                    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, fileType, 0.9));
                    if (blob) {
                        zip.file(`workshop_${i + 1}.${ext}`, blob);
                    }

                    setProgress(20 + (i * 15));
                }
            }

            const content = await zip.generateAsync({ type: "blob" });
            setGeneratedZips({ blob: content, name: `steam_workshop_slices.zip` });

        } catch (e) {
            console.error("Slicing failed", e);
            alert("Failed to slice image. if using GIF, ensure browser supports SharedArrayBuffer (enable cross-origin isolation).");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const consoleCode = `console.log("Setting Workshop IDs...");
$J('[name=consumer_app_id]').val(480); 
$J('[name=file_type]').val(0); 
$J('[name=visibility]').val(0); 
console.log("Ready to upload!");`;

    const copyCode = () => {
        navigator.clipboard.writeText(consoleCode);
        alert("Code copied to clipboard! Paste this in your browser console on the upload page.");
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8 min-h-[600px] animate-in fade-in duration-500 p-6">

            {/* Left: Controls & Upload */}
            <div className="w-full xl:w-1/3 space-y-6">
                <div className="bg-[#12141a] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Layers size={18} className="text-blue-400" /> Workshop Slicer
                    </h3>

                    {/* Upload */}
                    <div
                        className={`mb-6 border-2 border-dashed rounded-xl transition-all h-32 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group
                            ${dragActive ? 'border-steam-blue bg-steam-blue/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                        `}
                        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                        onDragOver={(e) => { e.preventDefault(); }}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            accept="image/*,video/*"
                            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                        />
                        <div className="flex flex-col items-center pointer-events-none">
                            <Upload className="w-8 h-8 mb-2 text-gray-400 group-hover:text-white transition-colors" />
                            <p className="text-xs text-center text-gray-400">
                                <span className="font-bold text-white">Click to Upload</span> or Drag Image/GIF
                            </p>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="space-y-4">


                        <div className="text-xs text-gray-500 p-2 leading-relaxed">
                            <Info size={12} className="inline mr-1 mb-0.5" />
                            Target 5 Workshop slots. Max 5MB per file.
                        </div>

                        {/* Action Buttons */}
                        <button
                            onClick={sliceImage}
                            disabled={!file || isProcessing}
                            className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2
                                ${!file ? 'bg-white/5 text-gray-500 cursor-not-allowed' :
                                    isProcessing ? 'bg-steam-blue/50 text-white cursor-wait' :
                                        'bg-steam-blue hover:bg-[#33c9dc] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'}
                            `}
                        >
                            {isProcessing ? (
                                <>
                                    <RefreshCw className="animate-spin" size={16} />
                                    {statusText || (progress > 0 ? `${Math.round(progress)}%` : 'Processing...')}
                                </>
                            ) : (
                                <>
                                    <Scissors size={16} /> Slice & Download
                                </>
                            )}
                        </button>

                        {generatedZips && (
                            <a
                                href={URL.createObjectURL(generatedZips.blob)}
                                download={generatedZips.name}
                                className="block w-full py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 rounded-xl font-bold uppercase text-xs text-center transition-all"
                            >
                                <Download size={16} className="inline mr-2" /> Download Bundle
                            </a>
                        )}
                    </div>
                </div>

                {/* Console Code Helper */}
                <div className="bg-[#12141a] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-white font-bold mb-4 text-sm flex items-center justify-between">
                        <span>Upload Helper Script</span>
                        <Copy size={14} className="text-gray-400 cursor-pointer hover:text-white" onClick={copyCode} />
                    </h3>
                    <div className="bg-black/50 p-3 rounded-lg border border-white/10 font-mono text-[10px] text-gray-400 overflow-x-auto whitespace-pre">
                        {consoleCode}
                    </div>
                    <button
                        onClick={copyCode}
                        className="mt-3 w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/5 transition-colors"
                    >
                        Copy to Clipboard
                    </button>
                    <p className="mt-2 text-[10px] text-gray-500 text-center">
                        Paste this in console (F12) when uploading "Long Workshop" images.
                    </p>
                </div>
            </div>

            {/* Right: Preview & Cropper */}
            <div className="w-full xl:w-2/3 bg-[#12141a] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex items-center justify-center">
                {previewUrl ? (
                    <div className="relative w-full h-full flex items-start justify-center overflow-auto" ref={containerRef}>
                        {/* Image/Video Container */}
                        <div className="relative" style={{ width: imageDimensions.width, height: imageDimensions.height }}>
                            {file?.type.startsWith('video/') ? (
                                <video
                                    src={previewUrl}
                                    className="max-w-none opacity-50"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            ) : (
                                <img src={previewUrl} alt="Preview" className="max-w-none opacity-50" />
                            )}

                            {/* Interactive Overlay */}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 border-2 border-steam-blue/80 shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-grab active:cursor-grabbing z-10"
                                style={{
                                    top: cropY,
                                    width: TOTAL_WIDTH,
                                    height: isLongWorkshop ? Math.min(800, imageDimensions.height) : 150
                                }}
                                onMouseDown={(e) => {
                                    const startY = e.clientY;
                                    const startTop = cropY;

                                    const handleMouseMove = (ev: MouseEvent) => {
                                        let newTop = startTop + (ev.clientY - startY);
                                        // Constrain
                                        newTop = Math.max(0, Math.min(newTop, imageDimensions.height - (isLongWorkshop ? 800 : 150)));
                                        setCropY(newTop);
                                    };

                                    const handleMouseUp = () => {
                                        window.removeEventListener('mousemove', handleMouseMove);
                                        window.removeEventListener('mouseup', handleMouseUp);
                                    };

                                    window.addEventListener('mousemove', handleMouseMove);
                                    window.addEventListener('mouseup', handleMouseUp);
                                }}
                            >
                                {/* Grid Lines (5 Columns) */}
                                <div className="absolute inset-0 flex">
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-full border-r border-steam-blue/30 last:border-r-0 relative" style={{ width: 150, marginRight: 4 }}>
                                            <div className="absolute inset-0 bg-steam-blue/10 hover:bg-steam-blue/20 transition-colors" />
                                            <div className="absolute top-2 left-2 text-[10px] font-bold text-steam-blue bg-black/50 px-1.5 py-0.5 rounded">
                                                #{i + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Drag Handle */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-steam-blue text-black/80 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider pointer-events-none">
                                    Drag to Position
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-600">
                        <Layers size={64} className="mb-4 opacity-20" />
                        <p className="text-sm font-bold opacity-50">Upload an image to start slicing</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default WorkshopSlicer;
