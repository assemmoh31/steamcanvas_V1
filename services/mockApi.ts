
import { Artwork, User, Transaction, TransactionType } from '../types';

const MOCK_USER: User = {
  id: 'u1',
  steamId: '76561198000000000',
  username: 'SteamDesigner_X',
  avatarUrl: 'https://picsum.photos/id/64/100/100',
  purchaseCoins: 1250,
  creatorCoins: 4500,
  totalSales: 42000, // Level 2, near Level 3
  status: 'Pro',
  storageUsed: 2.88,
  storageLimit: 3.0
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-90821',
    userId: 'u1',
    amount: 500,
    type: TransactionType.DEPOSIT,
    date: '2026-01-28T10:00:00Z',
    status: 'success',
    itemName: '500 AC Starter Pack',
    isUsed: false
  },
  {
    id: 'TX-88210',
    userId: 'u1',
    amount: 1000,
    type: TransactionType.DEPOSIT,
    date: '2026-01-20T14:30:00Z',
    status: 'success',
    itemName: '1000 AC Standard Pack',
    isUsed: true
  },
  {
    id: 'TX-87112',
    userId: 'u1',
    amount: 500,
    type: TransactionType.PURCHASE,
    date: '2026-01-22T09:15:00Z',
    status: 'success',
    itemName: 'Cyberpunk Glitch Artwork',
    isUsed: true
  },
  {
    id: 'TX-85001',
    userId: 'u1',
    amount: 2000,
    type: TransactionType.DEPOSIT,
    date: '2026-01-05T12:00:00Z',
    status: 'success',
    itemName: '2000 AC Popular Pack',
    isUsed: false
  },
  {
    id: 'TX-82091',
    userId: 'u1',
    amount: 3500,
    type: TransactionType.DEPOSIT,
    date: '2026-01-30T16:45:00Z',
    status: 'pending',
    itemName: '3500 AC Pro Pack',
    isUsed: false
  }
];

const MOCK_ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: 'Cyberpunk Glitch',
    description: 'A high-energy cyberpunk glitch animation designed for the Steam Artwork Showcase.',
    creatorId: 'u2',
    creatorName: 'NeonDreamer',
    creatorStatus: 'Elite',
    creatorSales: 285000, // Level 5 Mythic
    price: 500,
    imageUrl: 'https://picsum.photos/id/237/800/1000',
    tags: ['Cyberpunk', 'Glitch', 'Neon', 'Purple', 'Blue'],
    likes: 124,
    sales: 450,
    category: 'artwork',
    isOwned: true,
    resolution: '1920x1080',
    fileSize: '4.2 MB',
    fileType: 'GIF / PNG',
    theme: 'Cyberpunk',
    colors: ['Purple', 'Blue']
  },
  {
    id: '2',
    title: 'Forest Mist',
    description: 'Calm, atmospheric forest scene with rolling fog.',
    creatorId: 'u3',
    creatorName: 'NatureSoul',
    creatorStatus: 'Creator',
    creatorSales: 3500, // Level 1 Bronze
    price: 0,
    imageUrl: 'https://picsum.photos/id/10/800/600',
    tags: ['Nature', 'Atmospheric', 'Green', 'Gray'],
    likes: 89,
    sales: 120,
    category: 'artwork',
    resolution: '1920x1080',
    fileSize: '2.1 MB',
    fileType: 'PNG',
    theme: 'Nature',
    colors: ['Green', 'Gray']
  },
  {
    id: '3',
    title: 'Anime Aesthetic',
    description: 'Soft pink anime aesthetics featuring a cozy city view.',
    creatorId: 'u1',
    creatorName: 'SteamDesigner_X',
    creatorStatus: 'Pro',
    creatorSales: 42000, // Level 2 Silver
    price: 800,
    imageUrl: 'https://picsum.photos/id/45/800/800',
    tags: ['Anime', 'Pink', 'Soft', 'Blue'],
    likes: 256,
    sales: 892,
    category: 'artwork',
    resolution: '1920x1080',
    fileSize: '3.8 MB',
    fileType: 'GIF',
    theme: 'Anime',
    colors: ['Pink', 'Blue']
  },
  { id: '4', title: 'Abstract Geometry', creatorId: 'u4', creatorName: 'PolyMaster', creatorStatus: 'Pro', creatorSales: 1200, price: 350, imageUrl: 'https://picsum.photos/id/88/600/900', tags: ['Abstract', 'Minimal', 'White', 'Black'], likes: 45, sales: 88, category: 'artwork', theme: 'Abstract', colors: ['White', 'Black'] },
  { id: 'w1', title: 'Neon Pulse Showcase', creatorId: 'u2', creatorName: 'NeonDreamer', creatorStatus: 'Elite', creatorSales: 285000, price: 1200, imageUrl: 'https://picsum.photos/id/122/600/800', tags: ['Animated', 'Neon', 'Blue'], likes: 840, sales: 1250, category: 'workshop', theme: 'Cyberpunk', colors: ['Blue'] },
  { id: 'w2', title: 'Glitch Profile Frame', creatorId: 'u1', creatorName: 'SteamDesigner_X', creatorStatus: 'Pro', creatorSales: 42000, price: 450, imageUrl: 'https://picsum.photos/id/145/400/400', tags: ['Frame', 'Animated', 'Purple'], likes: 310, sales: 642, category: 'workshop', theme: 'Cyberpunk', colors: ['Purple'] },
  { id: '5', title: 'Retro Vaporwave', creatorId: 'u2', creatorName: 'NeonDreamer', creatorStatus: 'Elite', creatorSales: 285000, price: 450, imageUrl: 'https://picsum.photos/id/56/600/500', tags: ['Retro', 'Vaporwave', 'Pink', 'Cyan'], likes: 167, sales: 311, category: 'artwork', theme: 'Cyberpunk', colors: ['Pink', 'Cyan'] },
  { id: '6', title: 'Dark Souls Tribute', creatorId: 'u5', creatorName: 'PraiseTheSun', creatorStatus: 'Creator', creatorSales: 80000, price: 1000, imageUrl: 'https://picsum.photos/id/77/600/700', tags: ['Dark', 'Fantasy', 'Red', 'Black'], likes: 500, sales: 245, category: 'artwork', theme: 'Horror', colors: ['Red', 'Black'] },
  { id: 'w3', title: 'Floating Island Mod', creatorId: 'u6', creatorName: 'StarGazer', creatorStatus: 'Creator', creatorSales: 150000, price: 1500, imageUrl: 'https://picsum.photos/id/180/600/400', tags: ['3D', 'Green', 'Blue'], likes: 620, sales: 150, category: 'workshop', theme: 'Nature', colors: ['Green', 'Blue'] },
  { id: '7', title: 'Space Voyager', creatorId: 'u6', creatorName: 'StarGazer', creatorStatus: 'Creator', creatorSales: 150000, price: 0, imageUrl: 'https://picsum.photos/id/99/600/800', tags: ['Space', 'Sci-Fi', 'Black', 'Blue'], likes: 320, sales: 500, category: 'artwork', theme: 'Abstract', colors: ['Black', 'Blue'] },
  { id: '8', title: 'Urban Decay', creatorId: 'u1', creatorName: 'SteamDesigner_X', creatorStatus: 'Pro', creatorSales: 42000, price: 300, imageUrl: 'https://picsum.photos/id/101/600/400', tags: ['Urban', 'Grungy', 'Gray'], likes: 78, sales: 42, category: 'artwork', theme: 'Horror', colors: ['Gray'] },
  { id: 'w4', title: 'Matrix Rain Showcase', creatorId: 'u4', creatorName: 'PolyMaster', creatorStatus: 'Pro', creatorSales: 1200, price: 900, imageUrl: 'https://picsum.photos/id/201/600/340', tags: ['Matrix', 'Green', 'Animated'], likes: 445, sales: 881, category: 'workshop', theme: 'Abstract', colors: ['Green'] },
];

export const getUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/v1/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      if (res.status === 401) localStorage.removeItem('token');
      return null;
    }

    const data = await res.json();
    return {
      id: data.id,
      steamId: data.steamId,
      username: data.username,
      avatarUrl: data.avatarUrl,
      purchaseCoins: data.purchaseCoins,
      creatorCoins: data.creatorCoins,
      totalSales: 0,
      status: data.status,
      storageUsed: 0,
      storageLimit: 1.0
    };
  } catch (err) {
    console.error('Failed to fetch user:', err);
    return null;
  }
};

// Use VITE_API_URL or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787';

export const getArtworks = async (): Promise<Artwork[]> => {
  try {
    const res = await fetch(`${API_URL}/api/v1/artworks`);
    if (!res.ok) throw new Error('Failed to fetch artworks');

    // Map D1 result to frontend Interface
    // Note: D1 returns snake_case columns (preview_url), our generic type expects imageUrl
    // We need to map it correctly.
    const data = await res.json();

    // If API returns { results: [...] } or just array, handle it
    const list = Array.isArray(data) ? data : (data.results || []);

    return list.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      imageUrl: item.preview_url, // map snake_case to camelCase
      category: item.category || 'artwork',
      creatorId: item.creator_id,
      creatorName: item.creator_name || 'Unknown',
      creatorStatus: 'Creator',
      creatorAvatar: item.creator_avatar,
      creatorSales: 0,
      tags: [], // Tags need separate table later
      likes: 0,
      sales: 0,
    }));
  } catch (error) {
    console.error('API Error (getArtworks):', error);
    return []; // Return empty array on failure so UI doesn't crash
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_TRANSACTIONS]), 600));
};

export const buyArtwork = async (artworkId: string): Promise<boolean> => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const res = await fetch(`${API_URL}/api/v1/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ artworkId })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Purchase failed:', errorData);
      alert(errorData.error || 'Purchase failed');
      return false;
    }

    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error('Purchase error:', err);
    return false;
  }
};

export const addFunds = async (amount: number): Promise<boolean> => {
  // Placeholder: In real app, this would use Stripe
  return new Promise((resolve) => {
    setTimeout(() => {
      // We can't actually add funds via API yet without payment gateway
      resolve(true);
    }, 1500);
  });
};

export const getInventory = async (): Promise<string[]> => {
  const token = localStorage.getItem('token');
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/api/v1/user/inventory`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.ownedIds || [];
  } catch (err) {
    console.error('Failed to fetch inventory:', err);
    return [];
  }
};
