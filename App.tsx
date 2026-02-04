
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import Wallet from './pages/Wallet';
import CreatorDashboard from './pages/CreatorDashboard';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CoinPurchase from './pages/CoinPurchase';
import Withdrawal from './pages/Withdrawal';
import Notifications from './pages/Notifications';
import ArtworkDetail from './pages/ArtworkDetail';
import Subscription from './pages/Subscription';
import Tools from './pages/Tools';
import ThemeFinder from './pages/ThemeFinder';
import UploadArtwork from './pages/UploadArtwork';
import AdminPanel from './pages/AdminPanel';
import AdminInspection from './pages/AdminInspection';
import Footer from './components/Footer';
import HelpCenter from './pages/HelpCenter';
import CustomGuide from './pages/CustomGuide';
import ContactSupport from './pages/ContactSupport';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookieSettings from './pages/CookieSettings';
import RefundPolicy from './pages/RefundPolicy';
import TransactionHistory from './pages/TransactionHistory';
import { User, Artwork } from './types';
import { getUser, getArtworks, buyArtwork, getInventory } from './services/mockApi';
import AuthCallback from './pages/AuthCallback';
import Gallery from './pages/Gallery';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);

  // Inside App component
  useEffect(() => {
    // Check if we are on the auth callback route
    if (window.location.pathname === '/auth/callback') {
      setCurrentPage('auth-callback');
    }

    const fetchData = async () => {
      try {
        const [userData, artworksData] = await Promise.all([
          getUser(),
          getArtworks()
        ]);

        setUser(userData);

        // If user is logged in, fetch inventory
        let ownedIds: string[] = [];
        if (userData) {
          ownedIds = await getInventory();
        }

        // Merge ownership status
        const mergedArtworks = artworksData.map(art => ({
          ...art,
          isOwned: ownedIds.includes(art.id)
        }));

        setAllArtworks(mergedArtworks);

      } catch (error) {
        console.error("Failed to load app data:", error);
      }
    };

    fetchData();
  }, []);

  const refreshUser = () => {
    getUser().then(data => setUser(data));
  };

  const handleLogin = () => {
    // Redirect to Backend Steam Auth
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
    window.location.href = `${API_URL}/api/v1/auth/steam`;
  };

  const handleBuy = async (id: string) => {
    const success = await buyArtwork(id);
    if (success) {
      alert("Artwork purchased! Adding to your collection.");
      refreshUser();
      setAllArtworks(prev => prev.map(a => a.id === id ? { ...a, isOwned: true } : a));
    }
  };

  const navigateToDetail = (id: string) => {
    setSelectedArtworkId(id);
    setCurrentPage('artwork-detail');
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'auth-callback':
        return <AuthCallback setUser={setUser} setPage={setCurrentPage} />;
      case 'home':
        return <Home setPage={setCurrentPage} />;
      case 'marketplace':
        return <Marketplace onSelectArtwork={navigateToDetail} artworks={allArtworks} />;
      case 'theme-finder':
        return <ThemeFinder setPage={setCurrentPage} />;
      case 'tools':
        return <Tools />;
      case 'wallet':
        if (!user) return <div className="pt-32 text-center text-gray-400">Please login to view wallet.</div>;
        return <Wallet user={user} setPage={setCurrentPage} />;
      case 'purchase-coins':
        return <CoinPurchase setPage={setCurrentPage} refreshUser={refreshUser} />;
      case 'withdrawal':
        if (!user) return <div className="pt-32 text-center text-gray-400">Please login to withdraw funds.</div>;
        return <Withdrawal user={user} setPage={setCurrentPage} />;
      case 'notifications':
        if (!user) return <div className="pt-32 text-center text-gray-400">Please login to view notifications.</div>;
        return <Notifications user={user} setPage={setCurrentPage} />;
      case 'dashboard':
        if (!user) return <div className="pt-32 text-center text-gray-400">Please login to view dashboard.</div>;
        return <CreatorDashboard user={user} setPage={setCurrentPage} />;
      case 'upload':
        if (!user) return <div className="pt-32 text-center text-gray-400">Please login to upload artwork.</div>;
        return <UploadArtwork setPage={setCurrentPage} />;
      case 'profile':
        if (!user) return <div className="pt-32 text-center text-gray-400">Please login to view profile.</div>;
        return <Profile user={user} artworks={allArtworks} onBuy={handleBuy} setPage={setCurrentPage} />;
      case 'subscription':
        return <Subscription setPage={setCurrentPage} />;
      case 'help-center':
        return <HelpCenter setPage={setCurrentPage} />;
      case 'custom-guide':
        return <CustomGuide setPage={setCurrentPage} />;
      case 'contact-support':
        return <ContactSupport setPage={setCurrentPage} />;
      case 'tos':
        return <TermsOfService setPage={setCurrentPage} />;
      case 'privacy':
        return <PrivacyPolicy setPage={setCurrentPage} />;
      case 'cookies':
        return <CookieSettings setPage={setCurrentPage} />;
      case 'refund-policy':
        return <RefundPolicy setPage={setCurrentPage} />;
      case 'transaction-history':
        return <TransactionHistory setPage={setCurrentPage} />;
      case 'moha31h':
        return <AdminPanel setPage={setCurrentPage} onInspect={(id) => { setSelectedArtworkId(id); setCurrentPage('admin-inspect'); }} />;
      case 'admin-inspect':
        return <AdminInspection id={selectedArtworkId} setPage={setCurrentPage} />;
      case 'gallery':
        if (!user) return <div className="pt-32 text-center text-gray-400">Please login to view gallery.</div>;
        return <Gallery user={user} setPage={setCurrentPage} />;
      case 'artwork-detail':
        const selectedArt = allArtworks.find(a => a.id === selectedArtworkId);
        if (!selectedArt) return <div className="pt-32 text-center text-gray-400">Artwork not found.</div>;
        const creatorOtherArt = allArtworks.filter(a => a.creatorId === selectedArt.creatorId);
        return (
          <ArtworkDetail
            artwork={selectedArt}
            creatorArtworks={creatorOtherArt}
            onBack={() => setCurrentPage('marketplace')}
            onBuy={handleBuy}
            onSelectArtwork={navigateToDetail}
          />
        );
      default:
        return <Home setPage={setCurrentPage} />;
    }
  };

  const showFooter = currentPage !== 'moha31h';

  return (
    <div className="min-h-screen bg-steam-dark text-[#C5C6C7] font-sans selection:bg-steam-blue selection:text-black flex flex-col">
      <Navbar
        user={user}
        currentPage={currentPage}
        setPage={setCurrentPage}
        onLogin={handleLogin}
      />
      <main className="fade-in flex-1">
        {renderPage()}
      </main>

      {showFooter && <Footer setPage={setCurrentPage} />}

      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-steam-blue/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-creator-base/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}

export default App;
