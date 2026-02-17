
import React, { useEffect, useState, useMemo } from 'react';
import { Artwork, ArtworkCategory } from '../types';
import { getArtworks, buyArtwork } from '../services/mockApi';
import ArtworkCard from '../components/ArtworkCard';
import Banner from '../components/Banner';
import { Search, Filter, Image as ImageIcon, Box, X, ChevronRight, Palette, Tag, Banknote, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { List } from 'react-window';
import { AutoSizer } from 'react-virtualized-auto-sizer';

interface MarketplaceProps {
  onSelectArtwork: (id: string) => void;
  artworks: Artwork[];
}

interface BannerConfig {
  ads_enabled: boolean;
  interval: number;
  banners: any[];
}

const GAP = 48; // gap-12

// Moved Row outside to prevent re-creation on every render
const Row = ({ index, style, rows, columnCount, onBuy, onSelectArtwork }: any) => {
  const row = rows[index];
  if (!row) return <div style={style} />;

  if (row.type === 'spacer') {
    return <div style={style} />;
  }

  if (row.type === 'banner') {
    return (
      <div style={{ ...style, height: (typeof style.height === 'number' ? style.height : parseFloat(style.height)) - GAP, marginBottom: GAP }} className="w-full">
        <Banner banner={row.banner} />
      </div>
    );
  }

  return (
    <div style={{ ...style, height: (typeof style.height === 'number' ? style.height : parseFloat(style.height as string)) - GAP }} className="w-full px-1">
      <div className="flex gap-12 h-full">
        {row.items.map((artwork: Artwork) => (
          <div key={artwork.id} className="flex-1 h-full min-w-0">
            <ArtworkCard artwork={artwork} onBuy={onBuy} onClick={onSelectArtwork} />
          </div>
        ))}
        {/* Fill empty spaces to maintain alignment */}
        {Array.from({ length: columnCount - row.items.length }).map((_, i) => (
          <div key={`spacer-${i}`} className="flex-1 min-w-0" />
        ))}
      </div>
    </div>
  );
};

const Marketplace: React.FC<MarketplaceProps> = ({ onSelectArtwork, artworks }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>({ ads_enabled: false, interval: 15, banners: [] });

  useEffect(() => {
    let isMounted = true;
    const fetchBanners = async () => {
      try {
        // Use window.location to determine API URL if env missing
        const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8787';
        console.log("Fetching banners from:", `${API_URL}/api/v1/banners`);

        const res = await fetch(`${API_URL}/api/v1/banners`);

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          // Ensure min interval of 3
          if (data.interval < 3) data.interval = 3;
          if (data.banners?.length === 0) console.warn("No active banners found in response");
          if (isMounted) setBannerConfig(data);
        } else {
          console.error("Failed to fetch banners:", res.status, res.statusText);
        }
      } catch (e) {
        if (isMounted) console.error("Failed to load ads", e);
      }
    };
    fetchBanners();
    return () => { isMounted = false; };
  }, []);
  const [activeCategory, setActiveCategory] = useState<ArtworkCategory | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<'all' | 'free' | 'under500' | 'premium'>('all');

  const THEMES = ['Cyberpunk', 'Anime', 'Horror', 'Nature', 'Abstract'];
  const COLORS = ['Blue', 'Purple', 'Pink', 'Red', 'Green', 'Cyan', 'Black', 'White', 'Gray'];



  const handleBuy = async (id: string) => {
    const success = await buyArtwork(id);
    if (success) {
      alert('Artwork purchased! (Mock)');
    }
  };

  const toggleFilter = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const filteredArtworks = useMemo(() => artworks.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || a.category === activeCategory;

    // Check themes against tags (case insensitive)
    const matchesTheme = selectedThemes.length === 0 ||
      selectedThemes.some(theme =>
        a.tags.some(tag => tag.toLowerCase() === theme.toLowerCase()) ||
        (a.theme && a.theme.toLowerCase() === theme.toLowerCase())
      );

    // Check colors (case insensitive)
    const matchesColor = selectedColors.length === 0 ||
      (a.colors && a.colors.some(c =>
        selectedColors.some(sc => sc.toLowerCase() === c.toLowerCase())
      )) ||
      (a.dominant_colors && JSON.parse(a.dominant_colors).some((c: string) =>
        selectedColors.some(sc => sc.toLowerCase() === c.toLowerCase())
      ));

    const matchesPrice = priceRange === 'all' ||
      (priceRange === 'free' && a.price === 0) ||
      (priceRange === 'under500' && a.price > 0 && a.price <= 500) ||
      (priceRange === 'premium' && a.price > 500);

    return matchesSearch && matchesCategory && matchesTheme && matchesColor && matchesPrice;
  }), [artworks, searchTerm, activeCategory, selectedThemes, selectedColors, priceRange]);

  const clearFilters = () => {
    setSelectedThemes([]);
    setSelectedColors([]);
    setPriceRange('all');
    setActiveCategory('all');
    setSearchTerm('');
  };

  const activeFilterCount = selectedThemes.length + selectedColors.length + (priceRange !== 'all' ? 1 : 0) + (activeCategory !== 'all' ? 1 : 0);

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-0 relative flex flex-col h-screen">

      {/* 1. Page Header */}
      <div className="mb-10 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end flex-shrink-0">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            Discover <span className="text-steam-blue">Excellence</span>
          </h1>
          <p className="text-gray-300 font-medium">
            Explore {filteredArtworks.length} premium designs crafted for the elite Steam community.
          </p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#12141a] border border-white/5 text-gray-100 text-sm rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-steam-blue focus:ring-1 focus:ring-steam-blue/20 transition-all placeholder:text-gray-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all font-bold text-sm tracking-tight relative ${activeFilterCount > 0 ? 'bg-steam-blue/10 border-steam-blue text-steam-blue' : 'bg-[#12141a] border-white/5 text-gray-300 hover:text-white hover:border-white/10'}`}
          >
            <Filter size={18} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-steam-blue text-black px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Fast Category Selectors (Top Bar) */}
      <div className="flex items-center gap-8 border-b border-white/5 mb-6 overflow-x-auto no-scrollbar flex-shrink-0">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-2 py-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative ${activeCategory === 'all' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Sparkles size={16} />
          All Works
          {activeCategory === 'all' && (
            <motion.div layoutId="market-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-steam-blue shadow-[0_0_15px_rgba(102,252,241,0.5)]" />
          )}
        </button>
        <button
          onClick={() => setActiveCategory('artwork')}
          className={`flex items-center gap-2 py-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative ${activeCategory === 'artwork' ? 'text-steam-blue' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <ImageIcon size={16} />
          Artwork
          {activeCategory === 'artwork' && (
            <motion.div layoutId="market-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-steam-blue shadow-[0_0_15px_rgba(102,252,241,0.5)]" />
          )}
        </button>
        <button
          onClick={() => setActiveCategory('workshop')}
          className={`flex items-center gap-2 py-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative ${activeCategory === 'workshop' ? 'text-steam-blue' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Box size={16} />
          Workshop
          <span className="bg-steam-blue/10 text-steam-blue text-[9px] px-1.5 py-0.5 rounded font-black ml-1.5 border border-steam-blue/20">NEW</span>
          {activeCategory === 'workshop' && (
            <motion.div layoutId="market-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-steam-blue shadow-[0_0_15px_rgba(102,252,241,0.5)]" />
          )}
        </button>
      </div>

      {/* 3. Main Grid - Virtualized */}
      <div className="flex-1 w-full min-h-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-32 gap-6 h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-steam-blue shadow-[0_0_20px_rgba(102,252,241,0.2)]"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Inventory...</p>
          </div>
        ) : filteredArtworks.length > 0 ? (
          <div className="flex-1 w-full relative h-full">
            {/* @ts-ignore */}
            <AutoSizer renderProp={
              ({ height, width }: { height: number; width: number }) => {
                // Ensure dimensions are numbers (library might pass undefined initially)
                const safeHeight = height || 0;
                const safeWidth = width || 0;

                // Debug log
                console.log("AutoSizer dimensions:", safeHeight, safeWidth);
                if (safeHeight === 0 || safeWidth === 0) return null;

                const columnCount = safeWidth > 1536 ? 3 : safeWidth > 1280 ? 3 : safeWidth > 768 ? 2 : 1;
                const columnWidth = (safeWidth - GAP * (columnCount - 1)) / columnCount;
                // Aspect 4:3 -> Width / Height = 4/3 -> Height = Width * 0.75
                const CARD_HEIGHT = columnWidth * 0.75;
                const ROW_HEIGHT = CARD_HEIGHT + GAP; // Add gap to row height

                // Generate Rows
                const rows: any[] = [];
                let currentChunk: Artwork[] = [];

                // Create a copy of filteredArtworks to iterate safely
                const artworksToRender = [...filteredArtworks];

                let artworkIndex = 0;
                while (artworkIndex < artworksToRender.length) {
                  // Inject Banner (every 600px of height approx, or every 2 rows)
                  // But let's keep it simple: banner after every 6 items for now
                  if (rows.length > 0 && rows.length % 4 === 0) {
                    // Check if we should inject a banner
                    // Basic logic: just one banner for demo at index 5
                    // Let's use the random logic from before but mapped to rows
                    // For now, let's just push artworks
                  }

                  currentChunk.push(artworksToRender[artworkIndex]);
                  artworkIndex++;

                  if (currentChunk.length === columnCount) {
                    rows.push({ type: 'artworks', items: [...currentChunk] });
                    currentChunk = [];

                    // Inject Banner logic
                    if (rows.length === 2 && bannerConfig.banners.length > 0) {
                      rows.push({ type: 'banner', banner: bannerConfig.banners[0] });
                    }
                  }
                }

                if (currentChunk.length > 0) {
                  rows.push({ type: 'artworks', items: [...currentChunk] });
                }

                // Bottom padding
                rows.push({ type: 'spacer', height: 80 });

                // console.log("Rows generated:", rows.length);

                return (
                  <List
                    style={{ height, width }}
                    className="no-scrollbar" // Hide scrollbar if needed
                    rowCount={rows.length}
                    rowHeight={(index: number) => {
                      const row = rows[index];
                      let calculatedHeight;
                      if (!row) {
                        calculatedHeight = ROW_HEIGHT;
                      } else if (row.type === 'banner') {
                        calculatedHeight = 120 + GAP;
                      } else if (row.type === 'spacer') {
                        calculatedHeight = row.height;
                      } else {
                        calculatedHeight = ROW_HEIGHT;
                      }
                      console.log("Row height for index", index, ":", calculatedHeight);
                      return calculatedHeight;
                    }}
                    rowProps={{ rows, columnCount, onBuy: handleBuy, onSelectArtwork }}
                    rowComponent={Row}
                  />
                );
              }} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-40 flex flex-col items-center text-center gap-6"
          >
            <div className="w-20 h-20 bg-[#12141a] rounded-full flex items-center justify-center border border-white/5">
              <Search className="text-gray-600" size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white mb-2">No results found</h3>
              <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
                We couldn't find any designs matching your specific filters. Try adjusting your search or clearing filters.
              </p>
            </div>
            <button
              onClick={clearFilters}
              className="text-steam-blue text-xs font-black uppercase tracking-widest hover:underline"
            >
              Reset all filters
            </button>
          </motion.div>
        )}
      </div>

      {/* 4. Sidebar Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0a0c10] border-l border-white/5 z-[101] flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter size={20} className="text-steam-blue" />
                  <h2 className="text-xl font-black text-white tracking-tight">Market Filters</h2>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">

                {/* Theme Filter */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-100 font-black uppercase tracking-widest text-[10px]">
                    <Tag size={12} className="text-steam-blue" /> Theme
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {THEMES.map(theme => (
                      <button
                        key={theme}
                        onClick={() => toggleFilter(selectedThemes, setSelectedThemes, theme)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedThemes.includes(theme) ? 'bg-steam-blue border-steam-blue text-black' : 'bg-[#12141a] border-white/5 text-gray-400 hover:border-white/20'}`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-100 font-black uppercase tracking-widest text-[10px]">
                    <Palette size={12} className="text-steam-blue" /> Dominant Colors
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleFilter(selectedColors, setSelectedColors, color)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold transition-all border ${selectedColors.includes(color) ? 'bg-white/10 border-steam-blue text-steam-blue' : 'bg-[#12141a] border-white/5 text-gray-400 hover:border-white/10'}`}
                      >
                        <div className={`w-3 h-3 rounded-full border border-white/10`} style={{ backgroundColor: color.toLowerCase() }} />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-100 font-black uppercase tracking-widest text-[10px]">
                    <Banknote size={12} className="text-steam-blue" /> Price Tier
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'all', label: 'Any Price' },
                      { id: 'free', label: 'Free Designs' },
                      { id: 'under500', label: 'Standard (Under 500 AC)' },
                      { id: 'premium', label: 'Premium (Over 500 AC)' },
                    ].map(tier => (
                      <button
                        key={tier.id}
                        onClick={() => setPriceRange(tier.id as any)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all border ${priceRange === tier.id ? 'bg-steam-blue/10 border-steam-blue text-steam-blue' : 'bg-[#12141a] border-white/5 text-gray-400 hover:border-white/10'}`}
                      >
                        {tier.label}
                        {priceRange === tier.id && <ChevronRight size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-white/5 bg-[#0a0c10]">
                <div className="flex gap-4">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-[2] py-4 bg-steam-blue hover:bg-steam-deepBlue text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-steam-blue/10"
                  >
                    Show Results
                  </button>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div >
  );
};

export default Marketplace;
