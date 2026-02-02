import React, { useState } from 'react';
import { User, Artwork } from '../types';
import { 
  MapPin, 
  Calendar, 
  Award, 
  Edit, 
  Settings as SettingsIcon, 
  Image as ImageIcon,
  Plus,
  LayoutGrid,
  Shield,
  Clock,
  ExternalLink,
  ChevronDown,
  Trash2,
  MoveUp,
  MoveDown,
  Type,
  Layout,
  Star,
  ChevronLeft,
  ChevronRight,
  Palette,
  Search,
  Download,
  Filter,
  User as UserIcon,
  Heart,
  Gamepad2,
  BarChart3,
  ShieldAlert,
  Lock,
  Archive,
  HardDrive,
  CloudUpload,
  Zap,
  ArrowUpCircle,
  FileDigit,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Bookmark,
  Coins,
  FileText,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreatorTag from '../components/CreatorTag';
import CreatorAvatar from '../components/CreatorAvatar';
import StorageStatus from '../components/StorageStatus';
import { calculateCreatorLevel } from '../utils/leveling';

interface ProfileProps {
  user: User;
  artworks: Artwork[];
  onBuy: (id: string) => void;
  setPage: (page: string) => void;
}

type SectionType = 'Gallery' | 'Custom' | 'Carousel' | 'Badges';
type SidebarSectionType = 'LevelProgress' | 'Custom' | 'PostsFeed' | 'PostSpotlight' | 'DonationPool';

interface ProfileSection {
  id: string;
  type: SectionType;
  title: string;
  content?: string;
  subtitle?: string;
}

interface SidebarSection {
  id: string;
  type: SidebarSectionType;
  title: string;
  content?: string;
  goal?: number;
  current?: number;
}

const Profile: React.FC<ProfileProps> = ({ user, artworks, onBuy, setPage }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isEditMode, setIsEditMode] = useState(false);
  const [accentColor, setAccentColor] = useState('#05cc47'); // Default DA Green
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop');
  const [pageBackground, setPageBackground] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState('any');
  
  const levelInfo = calculateCreatorLevel(user.totalSales);

  const [sections, setSections] = useState<ProfileSection[]>([
    { 
      id: 'sec-1', 
      type: 'Gallery', 
      title: 'Featured Gallery',
      subtitle: 'Showcase your best works.'
    }
  ]);

  const [sidebarSections, setSidebarSections] = useState<SidebarSection[]>([]);

  const tabs = ['Home', 'Vault', 'Shop', 'Storage', 'About', 'Subscriptions', 'Stats'];

  const themeColors = [
    { name: 'DA Green', value: '#05cc47' },
    { name: 'Steam Blue', value: '#00E5FF' },
    { name: 'Vibrant Purple', value: '#a855f7' },
    { name: 'Hot Pink', value: '#ec4899' },
    { name: 'Amber Glow', value: '#f59e0b' },
  ];

  const handleTabClick = (tab: string) => {
    if (tab === 'Stats') {
      setPage('dashboard');
    } else if (tab === 'Subscriptions') {
      setPage('subscription');
    } else {
      setActiveTab(tab);
    }
  };

  const addSection = (type: SectionType) => {
    const newSection: ProfileSection = {
      id: `sec-${Date.now()}`,
      type,
      title: type === 'Custom' ? 'Custom Section' : type === 'Carousel' ? 'Art Carousel' : type === 'Badges' ? 'Badge Spotlight' : 'New Gallery',
      subtitle: type === 'Custom' ? 'Personal flair and details.' : 'Showcase your best works.',
      content: type === 'Custom' ? 'Write something about your style here.' : ''
    };
    setSections([...sections, newSection]);
  };

  const addSidebarSection = (type: SidebarSectionType) => {
    const newSection: SidebarSection = {
      id: `side-${Date.now()}`,
      type,
      title: type === 'LevelProgress' ? 'Level Progress' : 
             type === 'PostsFeed' ? 'Posts Feed' : 
             type === 'PostSpotlight' ? 'Featured Post' : 
             type === 'DonationPool' ? 'Donation Pool' : 'Custom Sidebar',
      content: type === 'Custom' ? 'Extra details go here.' : '',
      goal: type === 'DonationPool' ? 10000 : undefined,
      current: type === 'DonationPool' ? 2450 : undefined
    };
    setSidebarSections([...sidebarSections, newSection]);
  };

  const removeSection = (id: string, isSidebar = false) => {
    if (isSidebar) {
      setSidebarSections(sidebarSections.filter(s => s.id !== id));
    } else {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down', isSidebar = false) => {
    const list = isSidebar ? [...sidebarSections] : [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < list.length) {
      [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
      isSidebar ? setSidebarSections(list as SidebarSection[]) : setSections(list as ProfileSection[]);
    }
  };

  const ownedArtworks = artworks.filter(art => art.isOwned);
  // Filter artworks created by the current user for the Shop tab
  const shopArtworks = artworks.filter(art => art.creatorId === user.id);
  
  const storagePercentage = user.storageUsed && user.storageLimit ? (user.storageUsed / user.storageLimit) * 100 : 0;
  const uploadsUsed = artworks.filter(a => a.creatorId === user.id).length;
  const uploadLimit = 25;
  const uploadsRemaining = uploadLimit - uploadsUsed;

  const priceFilters = [
    { id: 'any', label: 'Any price' },
    { id: '0-500', label: '0 – 500 AC' },
    { id: '500-1000', label: '500 – 1000 AC' },
    { id: '1000+', label: '1000+ AC' },
  ];

  return (
    <div className="min-h-screen bg-[#060709] text-gray-200 font-sans selection:bg-white selection:text-black">
      
      {/* 1. HEADER */}
      <div className="relative bg-[#1a1a1a] border-b border-white/5 pt-20 pb-16 min-h-[340px] flex items-end">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000" 
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(6,7,9,0.3), rgba(6,7,9,0.95)), url(${coverImage})` }} 
        />
        <div className="absolute inset-0 opacity-10 pointer-events-none z-1" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-7xl mx-auto px-8 relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-8">
            <CreatorAvatar 
              src={user.avatarUrl} 
              totalSales={user.totalSales} 
              size="lg" 
            />
            
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">{user.username}</h1>
                <CreatorTag status={user.status} className="h-4 scale-125 origin-left" />
              </div>
              <div className="flex items-center gap-4 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                <span>0 Followers</span>
                <span className="opacity-20">|</span>
                <span>1 Page View</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
                onClick={() => setPage('moha31h')}
                className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20 backdrop-blur-md flex items-center gap-2"
              >
                <ShieldAlert size={14} /> Master Console
            </button>

            {isEditMode ? (
              <div className="flex flex-col items-end gap-3">
                <button 
                  onClick={() => setCoverImage(`https://picsum.photos/seed/${Math.random()}/1920/600`)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 backdrop-blur-md"
                >
                  <ImageIcon size={14} style={{ color: accentColor }} />
                  Change Header
                </button>
                <div className="flex gap-1.5 p-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                  {themeColors.map(color => (
                    <button 
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${accentColor === color.value ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditMode(true)}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-white/20 backdrop-blur-md"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <div className="bg-[#0b0c0f] border-b border-white/5 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab === 'Stats' && <BarChart3 size={14} style={{ color: accentColor }} />}
                  {tab === 'Vault' && <Lock size={14} style={{ color: accentColor }} />}
                  {tab === 'Storage' && <HardDrive size={14} style={{ color: accentColor }} />}
                  {tab}
                </span>
                {activeTab === tab && (
                  <motion.div 
                    layoutId="nav-underline" 
                    className="absolute bottom-0 left-0 right-0 h-1" 
                    style={{ backgroundColor: accentColor }} 
                  />
                )}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-8">
            <button className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest group">
              <SettingsIcon size={14} style={{ color: accentColor }} />
              Profile Skins
            </button>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC TAB CONTENT */}
      <div 
        className="relative min-h-[600px] transition-all duration-700"
        style={{ 
          background: pageBackground ? `linear-gradient(rgba(6,7,9,0.9), rgba(6,7,9,0.95)), url(${pageBackground}) center/cover fixed` : '#060709'
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-16">
          
          {/* STORAGE TAB */}
          {activeTab === 'Storage' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <HardDrive size={28} style={{ color: accentColor }} />
                    Server <span style={{ color: accentColor }}>Storage</span>
                  </h2>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Resource Allocation & Upload Quotas</p>
                </div>
                <button onClick={() => setPage('subscription')} className="px-6 py-2.5 bg-steam-blue/10 hover:bg-steam-blue text-steam-blue hover:text-black rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-steam-blue/20 flex items-center gap-2">
                    <ArrowUpCircle size={14} /> Upgrade Quota
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#0b0c0f]/80 backdrop-blur-sm border border-white/5 rounded-3xl p-10 space-y-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Disk Consumption</h3>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">Cloudflare R2 High-Performance Tier</p>
                    </div>
                    <div className="text-right">
                       <span className="text-3xl font-black text-white">{storagePercentage.toFixed(1)}%</span>
                       <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Utilized</p>
                    </div>
                  </div>
                  <div className="relative pt-4">
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${storagePercentage}%` }} className={`h-full rounded-full ${storagePercentage > 90 ? 'bg-red-500 animate-pulse' : 'bg-steam-blue'}`} style={{ boxShadow: storagePercentage > 90 ? '0 0 15px rgba(239, 68, 68, 0.4)' : '0 0 15px rgba(0, 229, 255, 0.2)' }} />
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span>{user.storageUsed?.toFixed(2)} GB Used</span>
                      <span>{user.storageLimit?.toFixed(1)} GB Total Capacity</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0b0c0f]/80 backdrop-blur-sm border border-white/5 rounded-3xl p-10 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-steam-blue/10 text-steam-blue border border-steam-blue/20"><CloudUpload size={20} /></div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Upload Quota</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white">{uploadsRemaining}</span>
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Slots left</span>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-500">Consumed</span>
                      <span className="text-white">{uploadsUsed} / {uploadLimit}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-steam-blue rounded-full" style={{ width: `${(uploadsUsed/uploadLimit)*100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* HOME TAB */}
          {activeTab === 'Home' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-16">
                <AnimatePresence mode="popLayout">
                  {sections.map((section, idx) => (
                    <motion.div key={section.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className={`relative ${isEditMode ? 'border-2 border-dashed border-white/10 p-8 rounded-2xl bg-white/[0.02]' : ''}`}
                    >
                      {isEditMode && (
                        <div className="absolute -top-4 right-4 flex items-center gap-2 z-50">
                          <button onClick={() => moveSection(idx, 'up')} className="p-2 bg-black text-white rounded-lg border border-white/10" disabled={idx === 0}><MoveUp size={14} /></button>
                          <button onClick={() => moveSection(idx, 'down')} className="p-2 bg-black text-white rounded-lg border border-white/10" disabled={idx === sections.length - 1}><MoveDown size={14} /></button>
                          <button onClick={() => removeSection(section.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20"><Trash2 size={14} /></button>
                        </div>
                      )}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h2 className="text-sm font-black text-white uppercase tracking-[0.25em]">{section.title}</h2>
                          {section.subtitle && <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{section.subtitle}</p>}
                        </div>
                        {section.type === 'Gallery' && (
                          <div className="bg-[#0b0c0f]/80 backdrop-blur-sm border border-white/5 rounded-md p-20 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 mb-8 opacity-20" style={{ color: accentColor }}><Layout size={96} /></div>
                            <h3 className="text-xl font-black text-white mb-3">Showcase your artwork</h3>
                            <button style={{ backgroundColor: accentColor }} className="px-10 py-3.5 text-black font-black text-[10px] uppercase tracking-widest rounded-sm">Submit Art</button>
                          </div>
                        )}
                        {section.type === 'Custom' && (
                          <div className="bg-[#0b0c0f]/80 backdrop-blur-sm border border-white/5 rounded-md p-10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: accentColor }} />
                            <p className="text-gray-400 text-lg leading-relaxed">{section.content}</p>
                          </div>
                        )}
                        {section.type === 'Carousel' && (
                          <div className="bg-[#0b0c0f]/80 backdrop-blur-sm border border-white/5 rounded-md overflow-hidden relative group">
                            <div className="aspect-[21/9] flex items-center justify-center bg-black/40 relative">
                              <img src={artworks[idx % artworks.length]?.imageUrl || artworks[0].imageUrl} className="w-full h-full object-cover opacity-60" />
                            </div>
                          </div>
                        )}
                        {section.type === 'Badges' && (
                          <div className="bg-[#0b0c0f]/80 backdrop-blur-sm border border-white/5 rounded-md p-10">
                            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-6">
                              {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="aspect-square bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-gray-500 hover:scale-110 transition-all"><Award size={32} style={{ color: i === 1 ? accentColor : '' }} /></div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isEditMode && (
                  <div className="bg-[#0b0c0f]/40 border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center gap-8">
                    <p className="text-white/60 font-black uppercase tracking-[0.2em] text-[11px]">Add New Main Component</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <button onClick={() => addSection('Custom')} className="flex flex-col items-center gap-3 px-8 py-6 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                        <Type size={20} style={{ color: accentColor }} /> Custom Section
                      </button>
                      <button onClick={() => addSection('Carousel')} className="flex flex-col items-center gap-3 px-8 py-6 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                        <LayoutGrid size={20} style={{ color: accentColor }} /> Art Carousel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SIDEBAR */}
              <div className="lg:col-span-4 space-y-8">
                {/* STATIC ABOUT CARD */}
                <div className="bg-[#0b0c0f]/80 backdrop-blur-sm border border-white/5 rounded-md overflow-hidden shadow-2xl relative">
                  <div className="p-8 border-b border-white/5"><h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">About {user.username}</h2></div>
                  <div className="p-8 space-y-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest"><Calendar size={18} style={{ color: accentColor }} /> AUG 6</div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest"><MapPin size={18} style={{ color: accentColor }} /> SPAIN</div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest"><Clock size={18} style={{ color: accentColor }} /> account age 4 MONTHS</div>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC SIDEBAR SECTIONS */}
                <AnimatePresence mode="popLayout">
                  {sidebarSections.map((section, idx) => (
                    <motion.div key={section.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className={`relative bg-[#0b0c0f]/80 backdrop-blur-sm border border-white/5 rounded-md overflow-hidden shadow-xl ${isEditMode ? 'ring-2 ring-dashed ring-white/10 p-2' : ''}`}
                    >
                      {isEditMode && (
                        <div className="absolute top-2 right-2 flex gap-1 z-50">
                           <button onClick={() => moveSection(idx, 'up', true)} className="p-1.5 bg-black/60 rounded border border-white/10 text-white" disabled={idx === 0}><MoveUp size={12} /></button>
                           <button onClick={() => moveSection(idx, 'down', true)} className="p-1.5 bg-black/60 rounded border border-white/10 text-white" disabled={idx === sidebarSections.length - 1}><MoveDown size={12} /></button>
                           <button onClick={() => removeSection(section.id, true)} className="p-1.5 bg-red-500/20 rounded border border-red-500/30 text-red-500"><Trash2 size={12} /></button>
                        </div>
                      )}
                      
                      <div className="p-6 space-y-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                           {section.type === 'LevelProgress' && <TrendingUp size={14} style={{ color: accentColor }} />}
                           {section.type === 'PostsFeed' && <MessageSquare size={14} style={{ color: accentColor }} />}
                           {section.type === 'PostSpotlight' && <Bookmark size={14} style={{ color: accentColor }} />}
                           {section.type === 'DonationPool' && <Coins size={14} style={{ color: accentColor }} />}
                           {section.type === 'Custom' && <Type size={14} style={{ color: accentColor }} />}
                           {section.title}
                        </h3>

                        {section.type === 'LevelProgress' && (
                          <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                               <span>LEVEL {levelInfo.level}</span>
                               <span>LEVEL {levelInfo.level + 1}</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                               <motion.div initial={{ width: 0 }} animate={{ width: `${levelInfo.progressPercent}%` }} className="h-full" style={{ backgroundColor: accentColor }} />
                            </div>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center">
                              {levelInfo.nextLevelXP ? `${(levelInfo.nextLevelXP - levelInfo.currentXP).toLocaleString()} AC to next tier` : 'MAX LEVEL ACHIEVED'}
                            </p>
                          </div>
                        )}

                        {section.type === 'PostsFeed' && (
                          <div className="space-y-3">
                             {[1, 2, 3].map(i => (
                               <div key={i} className="pb-3 border-b border-white/5 last:border-0 last:pb-0">
                                  <p className="text-[11px] text-white font-bold leading-tight line-clamp-1">New Steam Canvas tools released!</p>
                                  <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-1 block">OCT {i+10}, 2026</span>
                               </div>
                             ))}
                          </div>
                        )}

                        {section.type === 'PostSpotlight' && (
                          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                             <h4 className="text-xs font-black text-steam-blue mb-2">Featured Journal</h4>
                             <p className="text-[11px] text-gray-400 leading-relaxed italic">"My journey into minimalist design has been an amazing ride so far..."</p>
                          </div>
                        )}

                        {section.type === 'DonationPool' && (
                          <div className="space-y-3">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-400">Goal: New GPU</span>
                                <span style={{ color: accentColor }}>{section.current?.toLocaleString()} / {section.goal?.toLocaleString()} AC</span>
                             </div>
                             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full" style={{ width: `${(section.current! / section.goal!) * 100}%`, backgroundColor: accentColor }} />
                             </div>
                             <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-300">Donate to Pool</button>
                          </div>
                        )}

                        {section.type === 'Custom' && (
                          <p className="text-xs text-gray-400 leading-relaxed">{section.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* SIDEBAR ADD BUTTONS */}
                {isEditMode && (
                  <div className="bg-[#0b0c0f]/40 border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center gap-6">
                    <p className="text-white/60 font-black uppercase tracking-[0.2em] text-[9px]">Add Sidebar Widget</p>
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <button onClick={() => addSidebarSection('LevelProgress')} className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10">
                        <TrendingUp size={16} style={{ color: accentColor }} /> Level Up
                      </button>
                      <button onClick={() => addSidebarSection('PostsFeed')} className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10">
                        <MessageSquare size={16} style={{ color: accentColor }} /> Posts Feed
                      </button>
                      <button onClick={() => addSidebarSection('PostSpotlight')} className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10">
                        <Bookmark size={16} style={{ color: accentColor }} /> Post Spotlight
                      </button>
                      <button onClick={() => addSidebarSection('DonationPool')} className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10">
                        <Coins size={16} style={{ color: accentColor }} /> Donation Pool
                      </button>
                      <button onClick={() => addSidebarSection('Custom')} className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10 col-span-2">
                        <FileText size={16} style={{ color: accentColor }} /> Custom Section
                      </button>
                    </div>
                  </div>
                )}

                {/* STATS CARD (Fixed) */}
                <div className="bg-[#0b0c0f]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-10 space-y-8">
                  <h2 className="text-xs font-black text-white uppercase tracking-widest mb-6">Profile Stats</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Sales</span>
                      <span className="text-xs font-black text-white">1.2k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Feedback Score</span>
                      <span className="text-xs font-black text-[#05cc47]">100% Positive</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SHOP TAB */}
          {activeTab === 'Shop' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-12">
              <aside className="w-64 shrink-0 space-y-8 hidden xl:block">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-white/40 mb-4">
                    <Filter size={16} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Store Filters</h3>
                  </div>
                  <div className="space-y-4">
                    {priceFilters.map((p) => (
                      <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <input type="radio" name="shop-price" checked={selectedPrice === p.id} onChange={() => setSelectedPrice(p.id)} className="appearance-none w-5 h-5 rounded-full border-2 border-white/10 transition-all" />
                          {selectedPrice === p.id && <div className="absolute w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />}
                        </div>
                        <span className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${selectedPrice === p.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>
              
              <main className="flex-1 space-y-10">
                {shopArtworks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {shopArtworks.map((art) => (
                      <motion.div key={art.id} whileHover={{ y: -5 }} className="bg-[#0b0c0f]/80 backdrop-blur-sm border border-white/5 rounded-md overflow-hidden group shadow-xl hover:border-white/10 transition-all">
                        <div className="aspect-video bg-black relative">
                          <img src={art.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-4 flex justify-between items-start">
                          <div className="min-w-0 pr-4">
                            <h4 className="text-[13px] font-bold text-white truncate mb-1">{art.title}</h4>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Steam Showcase Asset</p>
                          </div>
                          <div className="text-right shrink-0">
                             <div className="text-[13px] font-black tracking-tight text-yellow-500">
                               {art.price || 0} <span className="text-[9px] opacity-70">AC</span>
                             </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-[#0b0c0f]/40 rounded-[40px] border border-white/5 border-dashed">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-gray-700 border border-white/5">
                      <ShoppingBag size={48} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white italic">Storefront Empty</h3>
                      <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed uppercase tracking-widest font-black text-[10px]">You haven't listed any designs for sale yet.</p>
                    </div>
                    <button 
                      onClick={() => setPage('upload')}
                      style={{ backgroundColor: accentColor }}
                      className="px-8 py-3 text-black font-black text-[10px] uppercase tracking-widest rounded-full shadow-xl hover:scale-105 transition-all"
                    >
                      Upload First Design
                    </button>
                  </div>
                )}
              </main>
            </motion.div>
          )}

          {/* VAULT TAB */}
          {activeTab === 'Vault' && (
            <div className="space-y-12">
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <Archive size={28} style={{ color: accentColor }} />
                    Personal <span style={{ color: accentColor }}>Vault</span>
                  </h2>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Collected Works & Profile Assets</p>
                </div>
                <div className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                  <Shield size={16} style={{ color: accentColor }} />
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{ownedArtworks.length} Items Secured</span>
                </div>
              </div>
              
              {ownedArtworks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12">
                  {ownedArtworks.map((art) => (
                    <motion.div key={art.id} whileHover={{ y: -8 }} className="bg-[#0b0c0f]/80 backdrop-blur-sm border border-steam-blue/20 rounded-2xl overflow-hidden group shadow-2xl relative">
                      <div className="aspect-video bg-black relative overflow-hidden">
                        <img src={art.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute top-3 left-3"><span className="px-2.5 py-1 bg-steam-blue text-black text-[8px] font-black uppercase tracking-widest rounded-md shadow-lg">In Vault</span></div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-sm font-bold text-white mb-1 truncate">{art.title}</h4>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-[#0b0c0f]/40 rounded-[40px] border border-white/5 border-dashed">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-gray-700 border border-white/5 animate-pulse"><Lock size={48} /></div>
                  <h3 className="text-xl font-black text-white">Your Vault is Empty</h3>
                  <button onClick={() => setPage('marketplace')} style={{ backgroundColor: accentColor }} className="px-8 py-3 text-black font-black text-[10px] uppercase tracking-widest rounded-full shadow-xl">Go to Marketplace</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER EDITOR BAR */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-black/80 backdrop-blur-2xl border border-white/10 px-10 py-5 rounded-full shadow-2xl flex items-center gap-10"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Blueprint Active</span>
              </div>
              <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest mt-1">Live Profile Tuning</span>
            </div>
            <div className="flex items-center gap-5">
               <button onClick={() => setIsEditMode(false)} className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl">Save Changes</button>
               <button onClick={() => setIsEditMode(false)} className="px-8 py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10 hover:bg-white/10 transition-all">Discard</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Profile;