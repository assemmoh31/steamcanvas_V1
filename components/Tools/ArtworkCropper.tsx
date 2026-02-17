import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Upload, Download, Maximize2, Move, ZoomIn, ZoomOut, RefreshCw, BoxSelect } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CropResult {
    main: Blob | null;
    side: Blob | null;
}

const ArtworkCropper: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [fileName, setFileName] = useState<string>('artwork');
    const [cropY, setCropY] = useState(270); // Default vertical offset roughly where artwork starts
    const [cropHeight, setCropHeight] = useState(600); // Default height for long artwork
    const [isGuidelineDragging, setIsGuidelineDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<{ main: string; side: string } | null>(null);

    // Constants for Steam Profile Dimensions (based on 1920px width)
    const PROFILE_WIDTH = 1920;
    // Steam centers content in a ~940px container usually, but backgrounds scale.
    // Standard "Fixed" background approach:
    // Main Panel: 506px width. X offset ~508px from left of 1920px bg.
    // Side Panel: 100px width. X offset ~1028px (508 + 506 + 14px gap).
    const MAIN_X = 508;
    const MAIN_WIDTH = 506;
    const GAP = 14;
    const SIDE_WIDTH = 100;
    const SIDE_X = MAIN_X + MAIN_WIDTH + GAP;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name.split('.')[0]);

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setImage(img);
                    // Auto-adjust crop height if image is shorter
                    if (img.height < cropHeight) setCropHeight(img.height);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    // Draw the canvas and update previews
    useEffect(() => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Scale image to 1920 width
        const scale = PROFILE_WIDTH / image.width;
        const scaledHeight = image.height * scale;

        canvas.width = PROFILE_WIDTH;
        canvas.height = scaledHeight; // Allow full height

        ctx.drawImage(image, 0, 0, PROFILE_WIDTH, scaledHeight);

        // Update previews in real-time (debounced ideally, but canvas is fast enough for small updates)
        updatePreviews(canvas);

    }, [image, cropY, cropHeight]);

    const updatePreviews = (sourceCanvas: HTMLCanvasElement) => {
        // We need to slice based on current CropY and Dimensions
        // Main Panel
        const mainCanvas = document.createElement('canvas');
        mainCanvas.width = MAIN_WIDTH;
        mainCanvas.height = cropHeight;
        const mainCtx = mainCanvas.getContext('2d');

        // Side Panel
        const sideCanvas = document.createElement('canvas');
        sideCanvas.width = SIDE_WIDTH;
        sideCanvas.height = cropHeight;
        const sideCtx = sideCanvas.getContext('2d');

        if (mainCtx && sideCtx) {
            // Draw Main
            mainCtx.drawImage(
                sourceCanvas,
                MAIN_X, cropY, MAIN_WIDTH, cropHeight, // Source
                0, 0, MAIN_WIDTH, cropHeight // Destination
            );

            // Draw Side
            sideCtx.drawImage(
                sourceCanvas,
                SIDE_X, cropY, SIDE_WIDTH, cropHeight, // Source
                0, 0, SIDE_WIDTH, cropHeight // Destination
            );

            setPreviewUrls({
                main: mainCanvas.toDataURL('image/jpeg', 0.9),
                side: sideCanvas.toDataURL('image/jpeg', 0.9)
            });
        }
    };

    const handleDownload = async () => {
        if (!canvasRef.current || !image) return;
        setIsProcessing(true);

        // optimization: Use WebWorker for heavy lifting if images were massive
        // For 1920px width, main thread is usually fine, but let's simulate the proper export flow.

        setTimeout(async () => {
            if (!previewUrls) return;

            // Helper to trigger download
            const downloadBlob = (dataUrl: string, name: string) => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };

            downloadBlob(previewUrls.main, `${fileName}_Middle.jpg`);
            downloadBlob(previewUrls.side, `${fileName}_Right.jpg`);

            setIsProcessing(false);
        }, 500);
    };

    // Dragging Logic
    const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        setIsGuidelineDragging(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isGuidelineDragging || !containerRef.current || !image) return;

        // Calculate Y based on container scale
        const rect = containerRef.current.getBoundingClientRect();
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        // Relative position in the displayed image container
        const relativeY = clientY - rect.top;

        // Conversion factor between Displayed Height and Actual Canvas Height
        // The canvas is displayed with max-width: 100%, height: auto.
        const displayScale = canvasRef.current!.offsetWidth / PROFILE_WIDTH;

        let newCropY = relativeY / displayScale - (cropHeight / 2); // Center the drag?? No, usually top handle

        // Clamping
        const maxY = (canvasRef.current!.height) - cropHeight;
        newCropY = Math.max(0, Math.min(newCropY, maxY));

        setCropY(newCropY);
    }, [isGuidelineDragging, cropHeight, image]);

    const handleMouseUp = useCallback(() => {
        setIsGuidelineDragging(false);
    }, []);

    useEffect(() => {
        if (isGuidelineDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove);
            window.addEventListener('touchend', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isGuidelineDragging, handleMouseMove, handleMouseUp]);


    return (
        <div className="flex flex-col xl:flex-row gap-8 min-h-[600px] animate-in fade-in duration-500">

            {/* Left Column: Editor */}
            <div className="flex-1 space-y-6">
                <div className="bg-[#12141a] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">

                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2"><Maximize2 size={18} className="text-steam-blue" /> Source Background</h3>
                        <div className="flex gap-2">
                            <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors">
                                <Upload size={14} /> Change Image
                                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div
                        ref={containerRef}
                        className="relative bg-black/50 border border-white/5 rounded-xl overflow-hidden cursor-crosshair select-none"
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                    >
                        {image ? (
                            <>
                                <canvas
                                    ref={canvasRef}
                                    className="w-full h-auto block"
                                />

                                {(() => {
                                    // Calculate canvas height based on image aspect ratio and fixed width
                                    // Determine height based on image state to avoid ref null access
                                    const canvasHeight = image ? image.height * (PROFILE_WIDTH / image.width) : 1;

                                    return (
                                        <>
                                            {/* Dark Overlay Outside Selection */}
                                            <div
                                                className="absolute inset-0 bg-black/60 pointer-events-none"
                                                style={{
                                                    maskImage: `linear-gradient(to bottom, 
                                white ${(cropY / canvasHeight) * 100}%, 
                                transparent ${(cropY / canvasHeight) * 100}%, 
                                transparent ${((cropY + cropHeight) / canvasHeight) * 100}%, 
                                white ${((cropY + cropHeight) / canvasHeight) * 100}%
                              )`
                                                }}
                                            />

                                            {/* The Guide Overlay */}
                                            <div
                                                className="absolute left-0 right-0 border-y-2 border-steam-blue box-content shadow-[0_0_20px_rgba(0,229,255,0.3)] pointer-events-none"
                                                style={{
                                                    top: `${(cropY / canvasHeight) * 100}%`,
                                                    height: `${(cropHeight / canvasHeight) * 100}%`
                                                }}
                                            >
                                                {/* Main Panel Highlight */}
                                                <div
                                                    className="absolute top-0 bottom-0 border border-steam-blue/50 bg-steam-blue/10"
                                                    style={{
                                                        left: `${(MAIN_X / PROFILE_WIDTH) * 100}%`,
                                                        width: `${(MAIN_WIDTH / PROFILE_WIDTH) * 100}%`
                                                    }}
                                                >
                                                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-[10px] text-steam-blue font-bold rounded">Main</div>
                                                </div>

                                                {/* Side Panel Highlight */}
                                                <div
                                                    className="absolute top-0 bottom-0 border border-steam-blue/50 bg-steam-blue/10"
                                                    style={{
                                                        left: `${(SIDE_X / PROFILE_WIDTH) * 100}%`,
                                                        width: `${(SIDE_WIDTH / PROFILE_WIDTH) * 100}%`
                                                    }}
                                                >
                                                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-[10px] text-steam-blue font-bold rounded">Side</div>
                                                </div>

                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="bg-black/50 px-3 py-1 rounded-full text-white text-xs font-bold pointer-events-auto cursor-move backdrop-blur-sm border border-white/10 flex items-center gap-2">
                                                        <Move size={12} /> Drag to Position
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}

                            </>
                        ) : (
                            <div className="aspect-video flex flex-col items-center justify-center text-gray-500">
                                <BoxSelect size={48} className="mb-4 opacity-50" />
                                <p className="font-bold uppercase tracking-widest text-sm">No Image Selected</p>
                                <p className="text-xs mt-2">Upload a background to start cropping</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <span>Cropping Height:</span>
                        <input
                            type="range"
                            min="300"
                            max="1000"
                            value={cropHeight}
                            onChange={(e) => setCropHeight(Number(e.target.value))}
                            className="flex-1 accent-steam-blue h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="w-12 text-right text-white">{cropHeight}px</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Preview & Export */}
            <div className="w-full xl:w-96 space-y-6">
                <div className="bg-[#12141a] border border-white/5 rounded-3xl p-6 sticky top-24">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                        <RefreshCw size={18} className="text-green-400" /> Preview Alignment
                    </h3>

                    {previewUrls ? (
                        <div className="flex gap-4 justify-center bg-black/40 p-6 rounded-xl border border-white/5 overflow-hidden relative">
                            {/* Simulate Steam Profile Layout */}
                            <div className="flex gap-[14px]">
                                {/* Main */}
                                <div style={{ width: 150 }} className="relative group">
                                    <img src={previewUrls.main} className="w-full h-auto shadow-lg shadow-black/50" alt="Main" />
                                    <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">Main: {MAIN_WIDTH}x{cropHeight}</span>
                                </div>
                                {/* Side */}
                                <div style={{ width: 30 }} className="relative group">
                                    <img src={previewUrls.side} className="w-full h-auto shadow-lg shadow-black/50" alt="Side" />
                                    <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">Side: {SIDE_WIDTH}x{cropHeight}</span>
                                </div>
                            </div>

                            {/* Profile Context Mockup */}
                            <div className="absolute top-0 left-0 right-0 h-8 flex items-center gap-2 px-2 opacity-20 pointer-events-none">
                                <div className="w-6 h-6 rounded bg-gray-500" />
                                <div className="h-2 w-20 bg-gray-500 rounded" />
                            </div>
                        </div>
                    ) : (
                        <div className="h-48 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-gray-600 text-xs font-bold uppercase tracking-widest text-center px-8">
                            Preview will appear here
                        </div>
                    )}

                    <div className="mt-8 space-y-3">
                        <button
                            onClick={handleDownload}
                            disabled={!image || isProcessing}
                            className="w-full py-4 bg-steam-blue hover:bg-[#33c9dc] text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? 'Processing...' : <><Download size={18} /> Download Slices</>}
                        </button>
                        <p className="text-[10px] text-gray-500 text-center font-bold">
                            Auto-generates "Middle.jpg" and "Right.jpg" ready for upload.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ArtworkCropper;
