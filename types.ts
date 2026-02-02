
export interface User {
  id: string;
  steamId: string;
  username: string;
  avatarUrl: string;
  purchaseCoins: number; // Coin A
  creatorCoins: number;  // Coin B
  totalSales: number;    // XP (Total AC generated)
  status?: 'Creator' | 'Pro' | 'Elite';
  storageUsed?: number;  // in GB
  storageLimit?: number; // in GB
}

export type ArtworkCategory = 'artwork' | 'workshop';
export type ArtworkStatus = 'live' | 'pending' | 'rejected';

export interface Artwork {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  creatorName: string;
  creatorStatus?: 'Creator' | 'Pro' | 'Elite';
  creatorSales: number; // For level display
  price: number;
  imageUrl: string;
  tags: string[];
  likes: number;
  sales: number;
  category: ArtworkCategory;
  status?: ArtworkStatus;
  isOwned?: boolean;
  resolution?: string;
  fileSize?: string;
  fileType?: string;
  theme?: string;
  colors?: string[];
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  PURCHASE = 'PURCHASE',
  WITHDRAWAL = 'WITHDRAWAL',
  CREATOR_EARNING = 'CREATOR_EARNING'
}

export type TransactionStatus = 'success' | 'pending' | 'refunded' | 'non-refundable';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  date: string;
  status: TransactionStatus;
  itemName: string;
  isUsed?: boolean; // Required for refund logic: have coins been spent?
}
