
import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  X,
  ChevronLeft,
  Tag,
  Info,
  Eye,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  Coins,
  Check,
  Image as ImageIcon,
  Type,
  FileText,
  Play,
  HardDrive,
  FileArchive,
  File,
  Plus,
  Search,
  Fingerprint,
  FileCheck,
  ShieldCheck,
  Lock,
  Clock,
  Copyright,
  Ban,
  Gamepad,
  CheckCircle2,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadArtworkProps {
  setPage: (page: string) => void;
}

const SUGGESTED_TAGS = [
  "Anime", "Manga", "Cyberpunk", "Futuristic", "Vaporwave",
  "Aesthetic", "Minimalist", "Clean", "Pixel Art", "Lo-Fi", "Cozy"
];

const GLOBAL_TAG_LIBRARY = [
  ...SUGGESTED_TAGS,
  "Counter-Strike 2", "Rust", "Sci-Fi", "Space", "Fantasy",
  "RPG", "Horror", "Dark", "Adventure", "Action", "Survival",
  "Strategy", "Simulation", "Open World", "Shooter", "Puzzle",
  "Neon", "Glitch", "Retro", "Animated", "3D", "2D", "Character",
  "Environment", "Icon", "Background", "Frame"
];

const AVAILABLE_COLORS = [
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Gray', hex: '#6B7280' }
];

const AGREEMENT_POINTS = [
  {
    id: 'commission',
    title: '15% Platform Commission',
    desc: 'I agree that SteamCanvas will take a 15% fee from every sale or donation to support platform maintenance and hosting.',
    icon: <Coins size={16} />
  },
  {
    id: 'approval',
    title: 'Manual Approval Process',
    desc: 'I understand that every artwork is manually reviewed to prevent theft and ensure quality.',
    icon: <FileCheck size={16} />
  },
  {
    id: 'window',
    title: '24-Hour Review Window',
    desc: 'I acknowledge that the approval process can take up to 24 hours before the artwork becomes visible on the marketplace.',
    icon: <Clock size={16} />
  },
  {
    id: 'copyright',
    title: 'Originality & Copyright',
    desc: 'I certify that I am the original creator of this artwork and that it does not contain stolen assets or unauthorized AI-generated content.',
    icon: <Copyright size={16} />
  },
  {
    id: 'sfw',
    title: 'Strict Content Policy (SFW Only)',
    desc: 'I agree that this artwork contains no nudity, sexually explicit content (+18), or offensive imagery.',
    icon: <ShieldCheck size={16} />
  },
  {
    id: 'steam_tos',
    title: 'Steam Terms of Service',
    desc: 'I confirm that this artwork complies with the official Steam Subscriber Agreement regarding profile customization.',
    icon: <Gamepad size={16} />
  },
  {
    id: 'invisible',
    title: 'No "Invisible" Misuse',
    desc: 'I agree not to use "Invisible" character tricks to deceive users or bypass safety filters.',
    icon: <Ban size={16} />
  },
  {
    id: 'final_sale',
    title: 'Final Sale Policy',
    desc: 'I understand that once a user purchases an artwork with Coins, the transaction is final and cannot be reversed by the creator.',
    icon: <Lock size={16} />
  }
];

const UploadArtwork: React.FC<UploadArtworkProps> = ({ setPage }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string | null>(null);

  // Source File States
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceDragActive, setSourceDragActive] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('250');
  const [isFree, setIsFree] = useState(false);

  // Tag Management States
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Color Selection State
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const [isNoAI, setIsNoAI] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Agreement State
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreedPoints, setAgreedPoints] = useState<string[]>([]);

  // Upload Status State
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'intent' | 'uploading' | 'finalizing' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // --- Helper: Extract Colors ---
  const extractDominantColors = (file: File) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Simple sampling: center + 4 corners
      const samples = [
        ctx.getImageData(img.width / 2, img.height / 2, 1, 1).data, // Center
        ctx.getImageData(10, 10, 1, 1).data, // Top Left
        ctx.getImageData(img.width - 10, img.height - 10, 1, 1).data, // Bottom Right
      ];

      // Map to Nearest Available Color
      const detectedColors: Set<string> = new Set();

      samples.forEach(pixel => {
        let minDist = Infinity;
        let bestColor = '';

        AVAILABLE_COLORS.forEach(c => {
          const hex = c.hex;
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);

          const dist = Math.sqrt(
            Math.pow(pixel[0] - r, 2) +
            Math.pow(pixel[1] - g, 2) +
            Math.pow(pixel[2] - b, 2)
          );

          if (dist < minDist) {
            minDist = dist;
            bestColor = c.name;
          }
        });

        if (bestColor) detectedColors.add(bestColor);
      });

      setSelectedColors(Array.from(detectedColors));
      URL.revokeObjectURL(objectUrl);
    };
  };

  const handleDrag = (e: React.DragEvent, type: 'preview' | 'source') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      type === 'preview' ? setDragActive(true) : setSourceDragActive(true);
    } else if (e.type === "dragleave") {
      type === 'preview' ? setDragActive(false) : setSourceDragActive(false);
    }
  };

  const handlePreviewFile = (file: File) => {
    setFileMimeType(file.type);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewFile(file);
    if (file.type.startsWith('image/')) {
      extractDominantColors(file);
    }
  };

  const handleSourceFile = (file: File) => {
    setSourceFile(file);
  };

  const handleDrop = (e: React.DragEvent, type: 'preview' | 'source') => {
    e.preventDefault();
    e.stopPropagation();
    type === 'preview' ? setDragActive(false) : setSourceDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      type === 'preview'
        ? handlePreviewFile(e.dataTransfer.files[0])
        : handleSourceFile(e.dataTransfer.files[0]);
    }
  };

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handlePreviewFile(e.target.files[0]);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleSourceFile(e.target.files[0]);
    }
  };

  // Tag Logic
  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Color selection logic
  const toggleColor = (colorName: string) => {
    if (selectedColors.includes(colorName)) {
      setSelectedColors(selectedColors.filter(c => c !== colorName));
    } else {
      setSelectedColors([...selectedColors, colorName]);
    }
  };

  const filteredLibrary = tagInput
    ? GLOBAL_TAG_LIBRARY.filter(t =>
      t.toLowerCase().startsWith(tagInput.toLowerCase()) && !tags.includes(t)
    )
    : [];

  const isPriceValid = isFree || (parseInt(price) >= 250);

  const toggleNoAI = () => {
    const newValue = !isNoAI;
    setIsNoAI(newValue);
    if (newValue) setIsAI(false); // Mutually exclusive
  };

  const toggleAI = () => {
    const newValue = !isAI;
    setIsAI(newValue);
    if (newValue) setIsNoAI(false); // Mutually exclusive
  };

  const toggleAgreementPoint = (id: string) => {
    if (agreedPoints.includes(id)) {
      setAgreedPoints(agreedPoints.filter(p => p !== id));
    } else {
      setAgreedPoints([...agreedPoints, id]);
    }
  };

  const handleAgreeToAll = () => {
    setAgreedPoints(AGREEMENT_POINTS.map(p => p.id));
  };

  const isAllAgreed = agreedPoints.length === AGREEMENT_POINTS.length;

  // --- MAIN UPLOAD LOGIC ---
  const handleFinalPublish = async () => {
    if (!previewFile || !sourceFile) return;

    setIsUploading(true);
    setShowAgreement(false);
    setUploadStatus('intent');
    setUploadProgress(10);

    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in to publish.");
      setIsUploading(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';

      // STEP 1: UPLOAD INTENT
      const intentRes = await fetch(`${apiUrl}/api/v1/assets/upload-intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          previewMetadata: { name: previewFile.name, type: previewFile.type, size: previewFile.size },
          sourceMetadata: { name: sourceFile.name, type: sourceFile.type, size: sourceFile.size }
        })
      });

      if (!intentRes.ok) throw new Error('Failed to initiate upload');
      const { preview, source } = await intentRes.json();

      setUploadStatus('uploading');
      setUploadProgress(30);

      // STEP 2: PARALLEL UPLOAD TO R2
      const uploadFile = async (url: string, file: File) => {
        const res = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
        return res;
      };

      await Promise.all([
        uploadFile(preview.url, previewFile),
        uploadFile(source.url, sourceFile)
      ]);

      setUploadStatus('finalizing');
      setUploadProgress(90);

      // STEP 3: FINALIZE
      const finalizeRes = await fetch(`${apiUrl}/api/v1/assets/finalize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          price: parseInt(price),
          tags,
          dominantColors: selectedColors,
          isAiGenerated: isAI,
          category: 'artwork',
          previewKey: preview.key,
          sourceKey: source.key
        })
      });

      if (!finalizeRes.ok) throw new Error('Failed to finalize artwork');

      setUploadStatus('success');
      setUploadProgress(100);

      setTimeout(() => {
        alert('Artwork successfully published!');
        setPage('dashboard');
      }, 1000);

    } catch (error) {
      console.error('Upload Failed:', error);
      setUploadStatus('error');
      alert(`Upload Failed: ${error}`);
      setIsUploading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#060709] pt-16 flex flex-col">
      {/* Top Header Bar */}
      <div className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl px-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setPage('dashboard')}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-white font-black text-sm uppercase tracking-widest">Creator Studio</h1>
            <p className="text-[10px] text-steam-blue font-black uppercase tracking-[0.2em]">Upload New Masterpiece</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage('dashboard')}
            className="px-6 py-2 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowAgreement(true)}
            disabled={!previewUrl || !sourceFile || !title || isUploading || !isPriceValid}
            className="px-8 py-2.5 bg-steam-blue disabled:opacity-30 disabled:cursor-not-allowed text-black text-[10px] font-black uppercase tracking-widest rounded-full transition-all shadow-lg shadow-steam-blue/10"
          >
            {isUploading ? 'Uploading...' : 'Publish Design'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* Left Column: Canvas Preview & Source File */}
        <div className="flex-1 bg-[#0a0c10] relative p-12 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start space-y-12">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          {/* Preview Section */}
          <div className="w-full max-w-4xl pt-8">
            <div className="flex items-center gap-2 text-white/40 mb-4 ml-2">
              <Eye size={14} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Display Preview</h2>
            </div>
            <AnimatePresence mode="wait">
              {!previewUrl ? (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onDragEnter={(e) => handleDrag(e, 'preview')}
                  onDragLeave={(e) => handleDrag(e, 'preview')}
                  onDragOver={(e) => handleDrag(e, 'preview')}
                  onDrop={(e) => handleDrop(e, 'preview')}
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-video border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center text-center cursor-pointer transition-all ${dragActive ? 'border-steam-blue bg-steam-blue/5 scale-105' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'}`}
                >
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handlePreviewChange} accept="image/*,video/webm" />
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gray-500 group-hover:text-white transition-colors">
                    <ImageIcon size={32} />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">Drop display preview here</h3>
                  <p className="text-gray-500 text-xs font-medium">This is what users see in the market. WEBM supported.</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-steam-blue/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />

                    {fileMimeType?.startsWith('video/') ? (
                      <video
                        src={previewUrl}
                        autoPlay
                        loop
                        muted
                        className="relative w-full rounded-2xl border border-white/10 shadow-2xl object-contain max-h-[60vh] mx-auto bg-black"
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="relative w-full rounded-2xl border border-white/10 shadow-2xl object-contain max-h-[60vh] mx-auto bg-black"
                      />
                    )}

                    <button
                      onClick={() => { setPreviewUrl(null); setFileMimeType(null); }}
                      className="absolute top-4 right-4 p-2 bg-black/80 text-white rounded-full hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black text-steam-blue uppercase tracking-widest opacity-60">
                    <Play size={10} /> Live Rendering Mode
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Source File Section */}
          <div className="w-full max-w-4xl pb-12">
            <div className="flex items-center gap-2 text-white/40 mb-4 ml-2">
              <HardDrive size={14} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Source Asset</h2>
            </div>

            <AnimatePresence mode="wait">
              {!sourceFile ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onDragEnter={(e) => handleDrag(e, 'source')}
                  onDragLeave={(e) => handleDrag(e, 'source')}
                  onDragOver={(e) => handleDrag(e, 'source')}
                  onDrop={(e) => handleDrop(e, 'source')}
                  onClick={() => sourceInputRef.current?.click()}
                  className={`p-10 border-2 border-dashed rounded-3xl flex items-center justify-between cursor-pointer transition-all ${sourceDragActive ? 'border-steam-blue bg-steam-blue/5' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'}`}
                >
                  <input ref={sourceInputRef} type="file" className="hidden" onChange={handleSourceChange} />
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
                      <Upload size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-black text-sm uppercase tracking-widest">Upload Source File</h3>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Zip, PNG, WEBM, or JPG. This is the file users will download.</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full group-hover:bg-white/10 transition-all">
                    Browse File
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-steam-blue/5 border border-steam-blue/20 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-steam-blue/20 flex items-center justify-center text-steam-blue">
                      {sourceFile.name.endsWith('.zip') || sourceFile.name.endsWith('.rar') ? <FileArchive size={24} /> : <File size={24} />}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm truncate max-w-md">{sourceFile.name}</h4>
                      <p className="text-[10px] text-steam-blue font-black uppercase tracking-widest mt-0.5">{(sourceFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for delivery</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSourceFile(null)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Properties Inspector */}
        <div className="w-full lg:w-[480px] bg-[#0b0c0f] border-l border-white/5 overflow-y-auto p-10 space-y-10 custom-scrollbar">

          <section className="space-y-6">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <Type size={14} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Basic Info</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Artwork Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Neon Horizon"
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-steam-blue/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell the community about your creation..."
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-steam-blue/30 transition-all min-h-[120px] resize-none"
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <Coins size={14} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Economy & Pricing</h2>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Free Access</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Allow anyone to collect for 0 AC</p>
                </div>
                <button
                  onClick={() => setIsFree(!isFree)}
                  className={`w-12 h-6 rounded-full transition-all relative ${isFree ? 'bg-steam-blue' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isFree ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {!isFree && (
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Listing Price (AC)</label>
                    <span className="text-[9px] text-steam-blue font-black uppercase tracking-widest">Min: 250 AC</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="250"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`w-full bg-black/40 border rounded-xl px-5 py-4 text-lg font-black transition-all focus:outline-none ${parseInt(price) < 250 ? 'border-red-500/50 text-red-400' : 'border-white/10 text-yellow-400 focus:border-steam-blue/50'}`}
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-500">ART COINS</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-3">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Info size={10} /> Marketplace Fee: 15%
                    </p>
                    <p className="text-[10px] text-steam-blue font-black uppercase tracking-widest flex items-center gap-1">
                      <Coins size={10} /> Estimated earnings: {Math.floor(parseInt(price || '0') * 0.85)} CC
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <Tag size={14} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Discovery & Labels</h2>
            </div>

            <div className="space-y-6">
              {/* Intelligent Tag Search with Autocomplete */}
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tags Search</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-steam-blue/10 border border-steam-blue/20 rounded-lg text-[10px] font-black text-steam-blue uppercase tracking-widest">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      ref={tagInputRef}
                      type="text"
                      value={tagInput}
                      onFocus={() => setShowSuggestions(true)}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && tagInput) {
                          e.preventDefault();
                          addTag(tagInput);
                        }
                      }}
                      placeholder="Search for tags (e.g. 'Anime')..."
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-10 py-4 text-sm text-white focus:outline-none focus:border-steam-blue/30 transition-all"
                    />

                    {/* Autocomplete Dropdown */}
                    <AnimatePresence>
                      {tagInput && filteredLibrary.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute z-[60] left-0 right-0 top-full mt-2 bg-[#121417]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto no-scrollbar"
                        >
                          {filteredLibrary.map(suggestion => (
                            <button
                              key={suggestion}
                              onClick={() => addTag(suggestion)}
                              className="w-full text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-steam-blue hover:bg-white/5 transition-all border-b border-white/5 last:border-0"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Suggested Tags Quick-Add Bar */}
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Sparkles size={10} className="text-steam-blue" /> Suggested Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        disabled={tags.includes(tag)}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${tags.includes(tag)
                          ? 'bg-steam-blue/5 border-steam-blue/20 text-steam-blue/40 cursor-not-allowed opacity-50'
                          : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/10'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Color Selection Section (Color Tags) */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Palette size={12} className="text-steam-blue" /> Dominant Colors
                  </label>
                  <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Select Palette</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {AVAILABLE_COLORS.map(color => (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      title={color.name}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all border ${selectedColors.includes(color.name)
                        ? 'bg-white/10 border-white/20 scale-105'
                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:scale-105'
                        }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full shadow-lg border border-white/10 relative"
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedColors.includes(color.name) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check size={12} className={color.name === 'White' || color.name === 'Yellow' ? 'text-black' : 'text-white'} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-tighter text-gray-500 group-hover:text-gray-300">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4">
                <button
                  onClick={toggleNoAI}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isNoAI ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isNoAI ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-500'}`}>
                      <Fingerprint size={18} />
                    </div>
                    <div className="text-left">
                      <p className={`text-xs font-bold uppercase tracking-widest ${isNoAI ? 'text-green-400' : 'text-gray-300'}`}>No AI</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Artwork created entirely by a human</p>
                    </div>
                  </div>
                  {isNoAI && <Check size={16} className="text-green-400" />}
                </button>

                <button
                  onClick={toggleAI}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isAI ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isAI ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-500'}`}>
                      <Sparkles size={18} />
                    </div>
                    <div className="text-left">
                      <p className={`text-xs font-bold uppercase tracking-widest ${isAI ? 'text-purple-400' : 'text-gray-300'}`}>AI-Generated</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Created using generative AI tools</p>
                    </div>
                  </div>
                  {isAI && <Check size={16} className="text-purple-400" />}
                </button>
              </div>
            </div>
          </section>

          <div className="pt-10 border-t border-white/5">
            <div className="flex gap-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
              <AlertCircle size={18} className="text-yellow-500 shrink-0" />
              <p className="text-[10px] text-yellow-500/80 font-medium leading-relaxed uppercase tracking-widest">
                By publishing, you confirm that you own the rights to this content or have permission to sell it. False claims lead to permanent ban.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* CREATOR AGREEMENT MODAL */}
      <AnimatePresence>
        {showAgreement && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAgreement(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0b0c0f] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-steam-blue/10 flex items-center justify-center text-steam-blue border border-steam-blue/20">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Creator Agreement</h2>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Review your commitments</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAgreement(false)}
                  className="p-3 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content - Checklist */}
              <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl mb-4">
                  <div className="flex gap-4">
                    <AlertCircle size={24} className="text-yellow-500 shrink-0" />
                    <div>
                      <p className="text-[11px] text-white font-black uppercase tracking-widest leading-relaxed">
                        Acknowledge Required Points
                      </p>
                      <p className="text-[10px] text-yellow-500/70 font-bold uppercase tracking-widest mt-1">
                        Please read and verify all {AGREEMENT_POINTS.length} points to proceed.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleAgreeToAll}
                    className="flex items-center gap-2 px-5 py-2.5 bg-steam-blue/10 hover:bg-steam-blue/20 border border-steam-blue/30 text-steam-blue text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all whitespace-nowrap"
                  >
                    <CheckCircle2 size={14} />
                    Agree to All
                  </button>
                </div>

                {AGREEMENT_POINTS.map((point) => (
                  <button
                    key={point.id}
                    onClick={() => toggleAgreementPoint(point.id)}
                    className={`w-full flex items-start gap-4 p-5 rounded-3xl border transition-all text-left group ${agreedPoints.includes(point.id) ? 'bg-steam-blue/10 border-steam-blue/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                  >
                    <div className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all border ${agreedPoints.includes(point.id) ? 'bg-steam-blue border-steam-blue text-black' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                      {agreedPoints.includes(point.id) ? <Check size={14} strokeWidth={4} /> : point.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xs font-black uppercase tracking-widest transition-colors ${agreedPoints.includes(point.id) ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {point.title}
                      </h3>
                      <p className={`text-[11px] leading-relaxed mt-2 transition-colors ${agreedPoints.includes(point.id) ? 'text-gray-300' : 'text-gray-500'}`}>
                        {point.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-white/5 bg-black/40">
                <div className="flex items-center justify-between gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Acknowledgment Status</span>
                    <span className={`text-xs font-black uppercase tracking-widest mt-1 ${isAllAgreed ? 'text-green-400' : 'text-steam-blue'}`}>
                      {agreedPoints.length} / {AGREEMENT_POINTS.length} Points Verified
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowAgreement(false)}
                      className="px-8 py-3 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleFinalPublish}
                      disabled={!isAllAgreed}
                      className="px-10 py-3 bg-steam-blue disabled:opacity-30 disabled:cursor-not-allowed text-black text-[10px] font-black uppercase tracking-widest rounded-full transition-all shadow-lg shadow-steam-blue/20"
                    >
                      Confirm Publication
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Progress Overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center flex-col gap-8"
          >
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                <motion.circle
                  cx="48" cy="48" r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-steam-blue"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: uploadProgress / 100 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-white">
                {Math.round(uploadProgress)}%
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Deploying to SteamCanvas</h2>
              <p className="text-steam-blue font-bold uppercase tracking-widest text-xs animate-pulse">
                {uploadStatus === 'intent' && 'Verifying credentials...'}
                {uploadStatus === 'uploading' && 'Encrypting & syncing assets...'}
                {uploadStatus === 'finalizing' && 'Minting database entry...'}
                {uploadStatus === 'success' && 'Deployment Complete!'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UploadArtwork;
