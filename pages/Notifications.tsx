import React, { useState } from 'react';
import { User } from '../types';
import { 
  Bell, 
  ShoppingBag, 
  Heart, 
  UserPlus, 
  Settings, 
  Trash2, 
  CheckCheck, 
  MessageCircle,
  AlertCircle,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationsProps {
  user: User;
  setPage: (page: string) => void;
}

type NotificationType = 'sale' | 'like' | 'follow' | 'comment' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  meta?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'sale',
    title: 'Item Sold!',
    description: 'GhostRider purchased your "Neon Genesis" artwork.',
    time: '2 minutes ago',
    isUnread: true,
    meta: '+500 CC'
  },
  {
    id: '2',
    type: 'like',
    title: 'New Favourite',
    description: 'PixelQueen added "Cyberpunk Glitch" to their favourites.',
    time: '15 minutes ago',
    isUnread: true
  },
  {
    id: '3',
    type: 'follow',
    title: 'New Follower',
    description: 'VaporDave is now watching your gallery.',
    time: '1 hour ago',
    isUnread: false
  },
  {
    id: '4',
    type: 'system',
    title: 'Withdrawal Successful',
    description: 'Your withdrawal request of €35.00 has been processed.',
    time: '3 hours ago',
    isUnread: false
  },
  {
    id: '5',
    type: 'comment',
    title: 'New Comment',
    description: 'AnimeFan99 commented: "This would look amazing with my setup!"',
    time: '5 hours ago',
    isUnread: false
  }
];

const Notifications: React.FC<NotificationsProps> = ({ user, setPage }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'interactions' | 'system'>('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'sales') return n.type === 'sale';
    if (activeTab === 'interactions') return ['like', 'follow', 'comment'].includes(n.type);
    if (activeTab === 'system') return n.type === 'system';
    return true;
  });

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isUnread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'sale': return <ShoppingBag size={18} className="text-green-400" />;
      case 'like': return <Heart size={18} className="text-red-400" />;
      case 'follow': return <UserPlus size={18} className="text-blue-400" />;
      case 'comment': return <MessageCircle size={18} className="text-purple-400" />;
      case 'system': return <AlertCircle size={18} className="text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-3xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setPage('home')}
                className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={markAllRead}
                className="p-2 text-gray-400 hover:text-steam-blue hover:bg-steam-blue/5 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                title="Mark all as read"
            >
                <CheckCheck size={18} />
                <span className="hidden sm:inline">Mark Read</span>
            </button>
            <button 
                onClick={clearAll}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                title="Clear all"
            >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Clear</span>
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-6">
        {(['all', 'sales', 'interactions', 'system'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-bold capitalize transition-all relative ${
              activeTab === tab ? 'text-steam-blue' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="notif-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-steam-blue" />
            )}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 rounded-xl border flex gap-4 items-start transition-all ${
                  n.isUnread 
                  ? 'bg-steam-blue/5 border-steam-blue/20' 
                  : 'bg-[#1c1e26] border-white/5 opacity-80 hover:opacity-100'
                }`}
              >
                <div className={`p-2.5 rounded-lg bg-black/40 border border-white/5`}>
                  {getIcon(n.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold text-sm ${n.isUnread ? 'text-white' : 'text-gray-300'}`}>{n.title}</h3>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock size={10} />
                      {n.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {n.description}
                  </p>
                  {n.meta && (
                    <div className="mt-2 inline-block px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-xs font-bold font-mono">
                      {n.meta}
                    </div>
                  )}
                </div>

                {n.isUnread && (
                  <div className="w-2 h-2 rounded-full bg-steam-blue mt-2 shadow-[0_0_8px_#66FCF1]"></div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center text-gray-500 flex flex-col items-center gap-4"
            >
                <Bell size={48} className="opacity-20" />
                <p>No notifications found in this category.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;