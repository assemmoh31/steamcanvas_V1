
import React, { useState, useRef, useEffect } from 'react';
import { Artwork } from '../types';
import {
    Heart,
    Share2,
    Flag,
    Check,
    Download,
    ChevronLeft,
    MessageSquare,
    UserPlus,
    Maximize,
    Send,
    MoreHorizontal,
    Smile,
    Image as ImageIcon,
    LayoutGrid,
    MessageCircle,
    Gift,
    Star as StarIcon,
    Moon as MoonIcon,
    Zap as ZapIcon,
    CornerDownRight,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreatorTag from '../components/CreatorTag';
import CreatorAvatar from '../components/CreatorAvatar';

interface ArtworkDetailProps {
    artwork: Artwork;
    creatorArtworks: Artwork[];
    onBack: () => void;
    onBuy: (id: string) => void;
    onSelectArtwork: (id: string) => void;
}

interface Comment {
    id: string;
    username: string;
    avatar: string;
    text: string;
    time: string;
    likes: number;
    replies?: Comment[];
}

const MOCK_COMMENTS: Comment[] = [
    {
        id: 'c1',
        username: 'PixelMaster',
        avatar: 'https://picsum.photos/id/101/50/50',
        text: 'The lighting in this piece is absolutely incredible. How long did it take to render?',
        time: '2 hours ago',
        likes: 12,
        replies: [
            { id: 'r1', username: 'PolyMaster', avatar: 'https://picsum.photos/id/88/50/50', text: 'Thanks! Around 14 hours on a 4090.', time: '1 hour ago', likes: 5 }
        ]
    },
    { id: 'c2', username: 'SteamKing_99', avatar: 'https://picsum.photos/id/102/50/50', text: 'Just bought this for my main profile. Fits the purple theme perfectly! 🔥', time: '5 hours ago', likes: 8 },
    { id: 'c3', username: 'ArtEnthusiast', avatar: 'https://picsum.photos/id/103/50/50', text: 'Do you take commissions for workshop animations?', time: '1 day ago', likes: 2 },
];

const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ artwork, creatorArtworks, onBack, onBuy, onSelectArtwork }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
    const [newComment, setNewComment] = useState('');
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [showDonationMenu, setShowDonationMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const donationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (donationRef.current && !donationRef.current.contains(event.target as Node)) {
                setShowDonationMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now().toString(),
            username: 'You',
            avatar: 'https://picsum.photos/id/64/100/100',
            text: newComment,
            time: 'Just now',
            likes: 0
        };
        setComments([comment, ...comments]);
        setNewComment('');
    };

    const handlePostReply = (parentId: string) => {
        if (!replyText.trim()) return;

        const newReply: Comment = {
            id: `reply-${Date.now()}`,
            username: 'You',
            avatar: 'https://picsum.photos/id/64/100/100',
            text: replyText,
            time: 'Just now',
            likes: 0
        };

        setComments(prev => prev.map(c => {
            if (c.id === parentId) {
                return { ...c, replies: [...(c.replies || []), newReply] };
            }
            return c;
        }));

        setReplyText('');
        setReplyingToId(null);
    };

    const handleDonate = (giftName: string, amount: number) => {
        alert(`You donated a ${giftName} (${amount} AC) to ${artwork.creatorName}!`);
        setShowDonationMenu(false);
    };

    const donationOptions = [
        { name: 'Star', amount: 100, icon: <StarIcon size={16} className="text-yellow-400" />, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { name: 'Moon', amount: 300, icon: <MoonIcon size={16} className="text-blue-300" />, color: 'text-blue-300', bg: 'bg-blue-300/10' },
        { name: 'Comet', amount: 1000, icon: <ZapIcon size={16} className="text-purple-400" />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 selection:bg-steam-blue selection:text-black font-sans relative overflow-x-hidden">

            {/* 1. Ambient Backdrop - Immersive Glow */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {artwork.imageUrl?.endsWith('.webm') ? (
                    <video
                        src={artwork.imageUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[100px] scale-150"
                    />
                ) : (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 blur-[100px] scale-150 transition-all duration-1000"
                        style={{ backgroundImage: `url(${artwork.imageUrl})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-[#050505]/80 to-[#050505]" />
            </div>



            <main className="relative z-10 max-w-[1600px] mx-auto px-6 pt-32 pb-24 min-h-screen flex flex-col">
                {/* 5. Floating Navigation (Inline Sticky) */}
                <div className="sticky top-24 z-40 mb-8 self-start">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-3 pl-2 pr-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/5 hover:bg-black/60 hover:border-white/20 transition-all duration-300 shadow-2xl"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                            <ChevronLeft size={16} className="text-white group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">Back directly to Market</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 w-full">

                    {/* LEFT COLUMN: Stage & Info */}
                    <div className="lg:col-span-8 flex flex-col gap-12">

                        {/* 2. Hero Section: Artwork Stage */}
                        <motion.div
                            layoutId={`art-${artwork.id}`}
                            className="relative w-full rounded-2xl overflow-hidden bg-black/20 border border-white/10 shadow-[0_0_100px_-20px_rgba(255,255,255,0.05)] group"
                        >
                            {artwork.imageUrl?.endsWith('.webm') ? (
                                <video
                                    src={artwork.imageUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-auto object-cover max-h-[80vh]"
                                />
                            ) : (
                                <img
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    className="w-full h-auto object-cover max-h-[80vh]"
                                />
                            )}

                            {/* Artwork Overlay Controls (Play/Pause could go here, for now just subtle gradient) */}
                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>

                        {/* 3. Metadata Bar: Creator Profile */}
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="flex items-center gap-5">
                                <CreatorAvatar
                                    src={artwork.creatorAvatar || `https://picsum.photos/id/${parseInt(artwork.creatorId.substring(1)) + 50}/200/200`}
                                    totalSales={artwork.creatorSales}
                                    size="lg"
                                />
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-black text-white tracking-tight">{artwork.creatorName}</h3>
                                        <CreatorTag status={artwork.creatorStatus} size="sm" />
                                    </div>
                                    <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-steam-blue" /> Level 42</span>
                                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500" /> 12k Works</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowDonationMenu(!showDonationMenu)}
                                    className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/5"
                                >
                                    <Gift size={20} />
                                    <AnimatePresence>
                                        {showDonationMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                className="absolute bottom-full mb-4 right-0 w-64 bg-[#1c1e26] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 backdrop-blur-xl text-left cursor-default"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-4 px-1">Support the artist</p>
                                                <div className="space-y-2">
                                                    {donationOptions.map((opt) => (
                                                        <button
                                                            key={opt.name}
                                                            onClick={() => handleDonate(opt.name, opt.amount)}
                                                            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-lg ${opt.bg} flex items-center justify-center`}>
                                                                    {opt.icon}
                                                                </div>
                                                                <span className="text-xs font-bold text-white group-hover:text-steam-blue transition-colors">Donate {opt.name}</span>
                                                            </div>
                                                            <span className="text-[11px] font-mono text-gray-200 font-bold">{opt.amount} AC</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                                <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                                    <Share2 size={16} /> Share
                                </button>
                            </div>
                        </div>

                        {/* 4. Information Section */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[0.9]">{artwork.title}</h1>
                                <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl">
                                    {artwork.description || "Designed for ultimate profile immersion. This asset features optimized bitrate for zero latency on Steam servers, giving your profile that premium, polished look."}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {artwork.tags.map(tag => (
                                    <span key={tag} className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all cursor-pointer select-none">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-white/5 my-4" />

                        {/* Comments Section (Preserved) */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                                    Discussion
                                    <span className="text-xs font-bold text-gray-400 px-2 py-1 rounded-md bg-white/5">{comments.length}</span>
                                </h3>
                            </div>
                            {/* ... Existing Comment Form & List Logic ... */}
                            <div className="space-y-8">
                                <form onSubmit={handlePostComment} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0 bg-black/50">
                                        <img src="https://picsum.photos/id/64/100/100" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="relative">
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a public comment..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-steam-blue/50 focus:bg-white/10 transition-all min-h-[100px] resize-none"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button type="submit" disabled={!newComment.trim()} className="px-6 py-2.5 bg-steam-blue disabled:opacity-30 disabled:cursor-not-allowed text-black text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-steam-deepBlue transition-all">
                                                Post <Send size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <div className="space-y-8">
                                    <AnimatePresence>
                                        {comments.map((comment) => (
                                            <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                                                <div className="flex gap-4 group">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/5 shrink-0 bg-black/30">
                                                        <img src={comment.avatar} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm font-bold text-white hover:text-steam-blue cursor-pointer">{comment.username}</span>
                                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{comment.time}</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-300 leading-relaxed font-normal">{comment.text}</p>
                                                        <div className="flex items-center gap-5 pt-1">
                                                            <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors">
                                                                <Heart size={14} /> {comment.likes}
                                                            </button>
                                                            <button
                                                                onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                                                                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${replyingToId === comment.id ? 'text-steam-blue' : 'text-gray-500 hover:text-white'}`}
                                                            >
                                                                {replyingToId === comment.id ? 'Cancel' : 'Reply'}
                                                            </button>
                                                        </div>

                                                        {/* REPLY INPUT AREA */}
                                                        <AnimatePresence>
                                                            {replyingToId === comment.id && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    className="pt-4 overflow-hidden"
                                                                >
                                                                    <div className="flex gap-3 items-start">
                                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                                                                            <img src="https://picsum.photos/id/64/100/100" className="w-full h-full object-cover" />
                                                                        </div>
                                                                        <div className="flex-1 space-y-3">
                                                                            <input
                                                                                autoFocus
                                                                                value={replyText}
                                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                                placeholder={`Reply to ${comment.username}...`}
                                                                                className="w-full bg-[#121417] border-b border-white/10 text-sm py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-steam-blue transition-all"
                                                                                onKeyDown={(e) => e.key === 'Enter' && handlePostReply(comment.id)}
                                                                            />
                                                                            <div className="flex justify-end gap-2">
                                                                                <button
                                                                                    onClick={() => setReplyingToId(null)}
                                                                                    className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    disabled={!replyText.trim()}
                                                                                    onClick={() => handlePostReply(comment.id)}
                                                                                    className="px-5 py-1.5 bg-steam-blue disabled:opacity-30 text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                                                                                >
                                                                                    Reply
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>

                                                {/* NESTED REPLIES DISPLAY */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div className="ml-16 space-y-6 border-l border-white/5 pl-6 relative">
                                                        {comment.replies.map((reply) => (
                                                            <div key={reply.id} className="flex gap-4 group">
                                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/5 shrink-0">
                                                                    <img src={reply.avatar} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1 space-y-1">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-xs font-bold text-white hover:text-steam-blue cursor-pointer">{reply.username}</span>
                                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{reply.time}</span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-200 leading-relaxed font-normal">{reply.text}</p>
                                                                    <div className="flex items-center gap-4 pt-1">
                                                                        <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">
                                                                            <Heart size={12} /> {reply.likes}
                                                                        </button>
                                                                        <button className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Reply</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Action Card & Recommendations */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-24 space-y-10">

                            {/* 2. The Action Card */}
                            <div className="rounded-3xl bg-white/5 backdrop-blur-[16px] border border-white/10 p-8 shadow-2xl relative overflow-hidden group">
                                {/* Subtle gradient glow inside card */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />

                                <div className="relative z-10 space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${artwork.isOwned ? 'bg-steam-blue/20 text-steam-blue' : 'bg-green-500/20 text-green-400'}`}>
                                                {artwork.isOwned ? 'Licensed Owner' : 'Available Now'}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                {artwork.isOwned && <div className="text-steam-blue"><Check size={16} /></div>}
                                                <button
                                                    onClick={() => setShowReportModal(true)}
                                                    className="p-1.5 rounded-full hover:bg-white/5 text-gray-600 hover:text-red-500 transition-all"
                                                    title="Report this artwork"
                                                >
                                                    <Flag size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <h2 className="text-4xl font-black text-white tracking-tight">
                                            {artwork.price === 0 ? 'Free' : `${artwork.price} AC`}
                                        </h2>
                                    </div>

                                    {artwork.isOwned ? (
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Digital License</p>
                                                <div className="flex justify-between font-mono text-xs text-white">
                                                    <span>{artwork.resolution || '1920x1080'}</span>
                                                    <span>{artwork.fileType || 'MP4'}</span>
                                                    <span>{artwork.fileSize || '12 MB'}</span>
                                                </div>
                                            </div>
                                            <button className="w-full py-4 rounded-xl bg-steam-blue hover:bg-steam-deepBlue text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all animate-pulse-slow">
                                                <Download size={18} /> Download Source
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => onBuy(artwork.id)}
                                            className="w-full py-5 rounded-xl bg-white text-black hover:bg-steam-blue hover:text-black hover:scale-[1.02] active:scale-[0.98] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg"
                                        >
                                            Purchase License
                                            <div className="w-px h-4 bg-black/20" />
                                            <span className="opacity-60">{artwork.price} AC</span>
                                        </button>
                                    )}

                                    <p className="text-[10px] text-center text-gray-500 font-medium">
                                        Secure transaction via SteamCanvas escrow. <br />
                                        Instant delivery to inventory.
                                    </p>
                                </div>
                            </div>

                            {/* More from Creator */}
                            <div className="space-y-4 pt-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">More by {artwork.creatorName}</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {creatorArtworks.filter(a => a.id !== artwork.id).slice(0, 3).map(art => (
                                        <div
                                            key={art.id}
                                            onClick={() => onSelectArtwork(art.id)}
                                            onMouseEnter={(e) => {
                                                const video = e.currentTarget.querySelector('video');
                                                if (video) void video.play();
                                            }}
                                            onMouseLeave={(e) => {
                                                const video = e.currentTarget.querySelector('video');
                                                if (video) {
                                                    video.pause();
                                                    video.currentTime = 0;
                                                }
                                            }}
                                            className="flex gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer group"
                                        >
                                            <div className="w-48 h-36 rounded-lg overflow-hidden relative bg-white/5 shrink-0">
                                                {art.imageUrl?.endsWith('.webm') ? (
                                                    <video
                                                        src={art.imageUrl}
                                                        loop
                                                        muted
                                                        playsInline
                                                        preload="none"
                                                        poster={art.imageUrl.replace('.webm', '.jpg')} // Fallback if you had one, but preload=none is key
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img src={art.imageUrl} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h5 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{art.title}</h5>
                                                <p className="text-[10px] text-steam-blue font-bold">{art.price} AC</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>

            {/* Report Modal */}
            <AnimatePresence>
                {showReportModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowReportModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-[#1c1e26] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                                    <Flag size={18} className="text-red-500" /> Report Artwork
                                </h3>
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <p className="text-sm text-gray-400">
                                    Why are you reporting <span className="text-white font-bold">{artwork.title}</span>?
                                    This report will be anonymous.
                                </p>

                                <div className="space-y-2">
                                    {['Inappropriate Content', 'Copyright Violation', 'Spam or Scam', 'Misleading Information', 'Other'].map((reason) => (
                                        <label key={reason} className="flex items-center gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/40 border border-white/5 cursor-pointer group transition-colors">
                                            <input
                                                type="radio"
                                                name="reportReason"
                                                value={reason}
                                                checked={reportReason === reason}
                                                onChange={(e) => setReportReason(e.target.value)}
                                                className="mr-2 accent-steam-blue"
                                            />
                                            <span className="text-sm font-medium text-gray-300 group-hover:text-white">{reason}</span>
                                        </label>
                                    ))}
                                </div>

                                <textarea
                                    className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 transition-all resize-none"
                                    placeholder="Please provide additional details..."
                                />

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setShowReportModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest text-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!reportReason) return;

                                            // Optimistic UI close (or use loading state)
                                            // setShowReportModal(false);

                                            const token = localStorage.getItem('token');
                                            if (!token) {
                                                alert('You must be logged in to report.');
                                                return;
                                            }

                                            try {
                                                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
                                                const res = await fetch(`${API_URL}/api/v1/reports`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${token}`
                                                    },
                                                    body: JSON.stringify({
                                                        artworkId: artwork.id,
                                                        reason: reportReason,
                                                        description: document.querySelector('textarea')?.value || ''
                                                    })
                                                });

                                                if (res.ok) {
                                                    alert(`Report submitted successfully.`);
                                                    setShowReportModal(false);
                                                    setReportReason('');
                                                } else {
                                                    const err = await res.json();
                                                    alert(`Failed to submit: ${err.error || 'Unknown error'}`);
                                                }
                                            } catch (error) {
                                                console.error(error);
                                                alert('Network error submitting report.');
                                            }
                                        }}
                                        disabled={!reportReason}
                                        className="flex-1 py-3 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:hover:bg-red-500/10 disabled:hover:text-red-500 text-xs font-black uppercase tracking-widest text-red-500 border border-red-500/20 transition-all"
                                    >
                                        Submit Report
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ArtworkDetail;
