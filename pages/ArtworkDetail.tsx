
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
    CornerDownRight
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
    <div className="min-h-screen bg-[#08090a] pt-16 text-gray-200">
      
      {/* 1. Header Navigation */}
      <div className="fixed top-16 left-0 right-0 z-40 px-6 py-4 bg-black/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-6">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white transition-all group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Market
              </button>
              <div className="w-px h-6 bg-white/10 hidden md:block"></div>
              <div className="flex flex-col">
                  <h2 className="text-white font-bold text-sm leading-tight">{artwork.title}</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-gray-300 uppercase tracking-wider">By <span className="text-steam-blue font-bold">{artwork.creatorName}</span></p>
                    <CreatorTag status={artwork.creatorStatus} size="sm" />
                  </div>
              </div>
          </div>
          <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all">
                  <Share2 size={14} /> Share
              </button>
          </div>
      </div>

      {/* 2. Main Visual Area */}
      <div className="relative w-full bg-[#050505] flex flex-col items-center pt-12 overflow-hidden border-b border-white/5">
          <div 
            className="absolute inset-0 opacity-20 blur-[150px] scale-110 pointer-events-none"
            style={{ 
                backgroundImage: `url(${artwork.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
              <div className="lg:col-span-8 flex justify-center">
                  <motion.div 
                    layoutId={`art-${artwork.id}`}
                    className="relative group shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-sm border border-white/10 overflow-hidden"
                  >
                    <img src={artwork.imageUrl} alt={artwork.title} className="max-h-[60vh] w-auto object-contain" />
                  </motion.div>
              </div>

              <div className="lg:col-span-4 h-full flex flex-col justify-center">
                  <div className="bg-[#121417]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-8">
                      <div className="space-y-2">
                          <div className="flex items-center gap-2 text-yellow-400 mb-1">
                              <Download size={18} />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Download</span>
                          </div>
                          <h3 className={`text-5xl font-black tracking-tight ${artwork.isOwned ? 'text-steam-blue' : artwork.price === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                              {artwork.isOwned ? 'OWNED' : artwork.price === 0 ? 'FREE' : `${artwork.price} AC`}
                          </h3>
                          <p className="text-[11px] text-gray-200 font-bold uppercase tracking-widest">Digital License • Lifetime Access</p>
                      </div>

                      <button 
                        onClick={() => !artwork.isOwned && onBuy(artwork.id)}
                        className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 disabled:bg-white/5 disabled:text-gray-500 disabled:border-white/10 disabled:shadow-none ${
                            artwork.isOwned 
                            ? 'bg-steam-blue text-black' 
                            : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/20'
                        }`}
                        disabled={artwork.isOwned}
                      >
                          {artwork.isOwned ? (
                              <><Check size={20} /> In Your Library</>
                          ) : (
                              <><Download size={20} /> {artwork.price === 0 ? 'Get Free' : 'Purchase with AC'}</>
                          )}
                      </button>

                      <div className="grid grid-cols-1 gap-4 pt-6 border-t border-white/5">
                          <div className="flex justify-between items-center group">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Resolution</span>
                              <span className="text-xs font-mono text-white">{artwork.resolution || '1920 x 1080'}</span>
                          </div>
                          <div className="flex justify-between items-center group">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Format</span>
                              <span className="text-xs font-mono text-white uppercase">{artwork.fileType || 'GIF / PNG'}</span>
                          </div>
                          <div className="flex justify-between items-center group">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Size</span>
                              <span className="text-xs font-mono text-white">{artwork.fileSize || '3.5 MB'}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="relative z-20 w-full bg-[#121417] border-y border-white/5 py-6">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                      <CreatorAvatar 
                        src={`https://picsum.photos/id/${parseInt(artwork.creatorId.substring(1)) + 50}/200/200`}
                        totalSales={artwork.creatorSales}
                        size="md"
                      />
                      <div>
                          <p className="text-[10px] text-steam-blue font-black uppercase tracking-[0.2em] mb-1">Creator Profile</p>
                          <div className="flex items-center gap-3">
                            <h4 className="text-2xl font-black text-white tracking-tighter">{artwork.creatorName}</h4>
                            <CreatorTag status={artwork.creatorStatus} size="lg" />
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-200 font-bold uppercase tracking-widest">
                              <span>Professional Designer</span>
                              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                              <span>Level 42</span>
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center gap-12">
                      <div className="hidden lg:flex items-center gap-10">
                          <div className="text-center">
                              <p className="text-white font-black text-lg leading-none">1.4k</p>
                              <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest mt-1">Works</p>
                          </div>
                          <div className="text-center">
                              <p className="text-white font-black text-lg leading-none">12k</p>
                              <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest mt-1">Fans</p>
                          </div>
                          <div className="text-center">
                              <p className="text-white font-black text-lg leading-none">4.9</p>
                              <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest mt-1">Rating</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 relative" ref={donationRef}>
                          <button 
                            onClick={() => setShowDonationMenu(!showDonationMenu)}
                            className={`p-3 rounded-xl border transition-all flex items-center justify-center ${showDonationMenu ? 'bg-steam-blue border-steam-blue text-black' : 'bg-white/5 hover:bg-white/10 text-gray-200 border-white/10'}`}
                            title="Donate to Creator"
                          >
                              <Gift size={20} />
                          </button>

                          <AnimatePresence>
                              {showDonationMenu && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="absolute bottom-full mb-4 right-0 w-64 bg-[#1c1e26] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 backdrop-blur-xl"
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

                          <button className="px-6 py-3 rounded-xl bg-steam-blue hover:bg-steam-deepBlue text-black text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-steam-blue/10 flex items-center gap-2">
                              <UserPlus size={16} /> Watch Artist
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 4. Detailed Content Area */}
      <div className="bg-[#08090a]">
          <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
              
              <div className="lg:col-span-8 space-y-20">
                  <div className="space-y-8">
                      <div className="flex items-end justify-between gap-6 border-b border-white/5 pb-10">
                          <div>
                              <h1 className="text-6xl font-black text-white mb-6 tracking-tighter leading-none">{artwork.title}</h1>
                              <p className="text-gray-100 text-xl leading-relaxed font-normal italic max-w-2xl">
                                  {artwork.description || "Designed for ultimate profile immersion. This asset features optimized bitrate for zero latency on Steam servers."}
                              </p>
                          </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                          {artwork.tags.map(tag => (
                              <span key={tag} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-gray-100 hover:text-steam-blue hover:border-steam-blue transition-all cursor-pointer">
                                  #{tag}
                              </span>
                          ))}
                      </div>
                  </div>

                  {/* Comment Section */}
                  <div className="space-y-10 pt-10 border-t border-white/5">
                      <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                              Comments
                              <span className="text-sm font-bold text-gray-300 px-3 py-1 rounded-full bg-white/5">{comments.length}</span>
                          </h3>
                      </div>

                      <form onSubmit={handlePostComment} className="flex gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                              <img src="https://picsum.photos/id/64/100/100" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 space-y-3">
                              <div className="relative">
                                  <textarea 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a public comment..."
                                    className="w-full bg-[#121417] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-steam-blue/50 transition-all min-h-[100px] resize-none"
                                  />
                              </div>
                              <div className="flex justify-end">
                                  <button type="submit" disabled={!newComment.trim()} className="px-6 py-2.5 bg-steam-blue disabled:opacity-30 disabled:cursor-not-allowed text-black text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all">
                                      Post <Send size={14} />
                                  </button>
                              </div>
                          </div>
                      </form>

                      <div className="space-y-12">
                          <AnimatePresence>
                              {comments.map((comment) => (
                                  <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                                      <div className="flex gap-4 group">
                                          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/5 shrink-0">
                                              <img src={comment.avatar} className="w-full h-full object-cover" />
                                          </div>
                                          <div className="flex-1 space-y-2">
                                              <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-3">
                                                      <span className="text-sm font-bold text-white hover:text-steam-blue cursor-pointer">{comment.username}</span>
                                                      <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">{comment.time}</span>
                                                  </div>
                                                  <button className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                                      <MoreHorizontal size={18} />
                                                  </button>
                                              </div>
                                              <p className="text-sm text-gray-100 leading-relaxed font-normal">{comment.text}</p>
                                              <div className="flex items-center gap-6 pt-1">
                                                  <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors">
                                                      <Heart size={14} /> {comment.likes}
                                                  </button>
                                                  <button 
                                                    onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                                                    className={`text-[10px] font-black uppercase tracking-widest transition-colors ${replyingToId === comment.id ? 'text-steam-blue' : 'text-gray-300 hover:text-white'}`}
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

              {/* Right Column */}
              <div className="lg:col-span-4">
                  <div className="sticky top-44 space-y-10">
                      <div>
                          <div className="flex items-center justify-between mb-8">
                              <div>
                                  <p className="text-steam-blue text-[10px] font-black uppercase tracking-[0.3em] mb-1">Portfolio</p>
                                  <h3 className="text-xl font-black text-white tracking-tight">More by {artwork.creatorName}</h3>
                              </div>
                              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
                                  <LayoutGrid size={18} className="text-gray-300" />
                              </button>
                          </div>
                          
                          <div className="space-y-4">
                              {creatorArtworks.filter(a => a.id !== artwork.id).slice(0, 5).map(art => (
                                  <div 
                                    key={art.id} 
                                    onClick={() => onSelectArtwork(art.id)}
                                    className="flex gap-4 group cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] p-3 rounded-2xl border border-white/5 transition-all"
                                  >
                                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-white/5">
                                          <img src={art.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                      </div>
                                      <div className="flex flex-col justify-center min-w-0">
                                          <div className="flex items-center gap-1.5">
                                            <h4 className="text-sm font-bold text-white truncate group-hover:text-steam-blue transition-colors">{art.title}</h4>
                                            <CreatorTag status={art.creatorStatus} size="sm" />
                                          </div>
                                          <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest mt-1">{art.price} AC</p>
                                          <div className="flex items-center gap-3 mt-3 text-gray-200 text-[10px] font-bold">
                                              <span className="flex items-center gap-1"><Heart size={10} /> {art.likes}</span>
                                              <span className="flex items-center gap-1"><ImageIcon size={10} /> {art.category}</span>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};

export default ArtworkDetail;
