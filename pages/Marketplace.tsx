
import React, { useEffect, useState } from 'react';
import { Artwork, ArtworkCategory } from '../types';
import { getArtworks, buyArtwork } from '../services/mockApi';
import ArtworkCard from '../components/ArtworkCard';
import { Search, Filter, Image as ImageIcon, Box, X, ChevronRight, Palette, Tag, Banknote, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketplaceProps {
  onSelectArtwork: (id: string) => void;
  artworks: Artwork[];
}

const Marketplace: React.FC<MarketplaceProps> = ({ onSelectArtwork, artworks }) => {
  const [loading, setLoading] = useState(false); // Controlled by parent passing data
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredArtworks = artworks.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || a.category === activeCategory;

    const matchesTheme = selectedThemes.length === 0 || (a.theme && selectedThemes.includes(a.theme));

    const matchesColor = selectedColors.length === 0 || (a.colors && a.colors.some(c => selectedColors.includes(c)));

    const matchesPrice = priceRange === 'all' ||
      (priceRange === 'free' && a.price === 0) ||
      (priceRange === 'under500' && a.price > 0 && a.price <= 500) ||
      (priceRange === 'premium' && a.price > 500);

    return matchesSearch && matchesCategory && matchesTheme && matchesColor && matchesPrice;
  });

  const clearFilters = () => {
    setSelectedThemes([]);
    setSelectedColors([]);
    setPriceRange('all');
    setActiveCategory('all');
    setSearchTerm('');
  };

  const activeFilterCount = selectedThemes.length + selectedColors.length + (priceRange !== 'all' ? 1 : 0) + (activeCategory !== 'all' ? 1 : 0);

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-20 relative">

      {/* 1. Page Header */}
      <div className="mb-10 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end">
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
      <div className="flex items-center gap-8 border-b border-white/5 mb-10 overflow-x-auto no-scrollbar">
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

      {/* 3. Main Grid - Updated for Larger Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-32 gap-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-steam-blue shadow-[0_0_20px_rgba(102,252,241,0.2)]"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Inventory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredArtworks.length > 0 ? (
              filteredArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} onBuy={handleBuy} onClick={onSelectArtwork} />
              ))
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
          </AnimatePresence>
        </div>
      )}

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

    </div>
  );
};

export default Marketplace;
