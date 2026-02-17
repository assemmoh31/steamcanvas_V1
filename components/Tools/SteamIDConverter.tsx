import React, { useState, useEffect } from 'react';
import { Copy, Check, Search, Link as LinkIcon, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEAM_BASELINE = 76561197960265728n;

interface SteamIDs {
    steamID64: string;
    steamIDLegacy: string;
    steamID3: string;
    accountID: string;
    inviteLink: string;
}

const SteamIDConverter: React.FC = () => {
    const [input, setInput] = useState('');
    const [results, setResults] = useState<SteamIDs | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Auto-detect and convert logic
    useEffect(() => {
        const processInput = async () => {
            setError(null);
            if (!input.trim()) {
                setResults(null);
                return;
            }

            // Check for Vanity URL first (contains steamcommunity.com or looks like a name)
            // Basic regex for traditional IDs to rule them out
            const isSteamID64 = /^\d{17}$/.test(input);
            const isLegacy = /^STEAM_[0-5]:[0-1]:\d+$/.test(input);
            const isSteamID3 = /^\[U:1:\d+\]$/.test(input);
            const isAccountID = /^\d{1,10}$/.test(input); // Up to 10 digits for 32-bit int

            if (isSteamID64 || isLegacy || isSteamID3 || isAccountID) {
                convertGeneric(input);
            } else {
                // Assume Vanity URL or Partial URL
                await resolveVanity(input);
            }
        };

        const timer = setTimeout(() => {
            processInput();
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [input]);

    const resolveVanity = async (val: string) => {
        // Extract vanity name if full URL provided
        let vanity = val;
        if (val.includes('steamcommunity.com/id/')) {
            const parts = val.split('/id/');
            if (parts[1]) {
                vanity = parts[1].split('/')[0];
            }
        } else if (val.includes('steamcommunity.com/profiles/')) {
            // It's a profile link with ID64, extract and convert directly
            const parts = val.split('/profiles/');
            if (parts[1]) {
                const id = parts[1].split('/')[0];
                convertGeneric(id);
                return;
            }
        }

        setLoading(true);
        try {
            const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8787';
            const res = await fetch(`${API_URL}/api/v1/steam/resolve/${vanity}`);
            const data = await res.json();

            if (data.steamid) {
                convertGeneric(data.steamid);
            } else {
                setError('Could not resolve Vanity URL');
                setResults(null);
            }
        } catch (err) {
            setError('Error connecting to steam services');
        } finally {
            setLoading(false);
        }
    };

    const convertGeneric = (val: string) => {
        try {
            let steamID64 = 0n;

            if (/^\d{17}$/.test(val)) {
                // Input is SteamID64
                steamID64 = BigInt(val);
            } else if (/^STEAM_[0-5]:[0-1]:\d+$/.test(val)) {
                // Input is Legacy: STEAM_X:Y:Z
                const parts = val.split(':');
                const Y = BigInt(parts[1]);
                const Z = BigInt(parts[2]);
                // Account ID = Z * 2 + Y
                const accountID = Z * 2n + Y;
                steamID64 = STEAM_BASELINE + accountID;
            } else if (/^\[U:1:\d+\]$/.test(val)) {
                // Input is SteamID3: [U:1:12345]
                const match = val.match(/\d+/); // The first number is '1' (universe), second is ID
                if (match) {
                    const parts = val.split(':');
                    const idPart = parts[2].replace(']', '');
                    const accountID = BigInt(idPart);
                    steamID64 = STEAM_BASELINE + accountID;
                }
            } else if (/^\d{1,10}$/.test(val)) {
                // Input is AccountID
                const accountID = BigInt(val);
                steamID64 = STEAM_BASELINE + accountID;
            } else {
                setError('Invalid Format');
                return;
            }

            // Calculate others from SteamID64
            const accountIDBig = steamID64 - STEAM_BASELINE;

            if (accountIDBig < 0n) {
                setError('Invalid Steam ID (Too old/low)');
                return;
            }

            const accountID = accountIDBig.toString();
            const Y = accountIDBig % 2n;
            const Z = accountIDBig / 2n;
            const steamIDLegacy = `STEAM_0:${Y}:${Z}`;
            const steamID3 = `[U:1:${accountID}]`;
            const inviteLink = `https://steamcommunity.com/profiles/${steamID64}`;

            setResults({
                steamID64: steamID64.toString(),
                steamIDLegacy,
                steamID3,
                accountID,
                inviteLink
            });

        } catch (e) {
            console.error(e);
            setError('Conversion Failed');
        }
    };

    // Helper for quick invite link (hex encoding of account id)
    // Removed for simplicity as we use profile link

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    interface ResultItem {
        label: string;
        value: string;
        icon: any;
        full?: boolean;
    }

    const resultItems: ResultItem[] = results ? [
        { label: 'SteamID64 (Community ID)', value: results.steamID64, icon: Hash },
        { label: 'SteamID (Legacy)', value: results.steamIDLegacy, icon: Hash },
        { label: 'SteamID3', value: results.steamID3, icon: Hash },
        { label: 'Account ID', value: results.accountID, icon: Hash },
        { label: 'Profile URL', value: results.inviteLink, icon: LinkIcon, full: true },
    ] : [];

    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-steam-blue to-cyan-400">
                    Steam ID Converter
                </h2>
                <p className="text-gray-400">
                    Instantly convert between SteamID, SteamID3, SteamID64, and Vanity URLs.
                </p>
            </div>

            {/* Input Zone */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-steam-blue/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
                <div className="relative bg-[#1a1d26] border border-white/10 rounded-xl p-2 flex items-center shadow-2xl">
                    <div className="pl-4 pr-3 text-steam-blue">
                        {loading ? (
                            <div className="animate-spin h-6 w-6 border-2 border-steam-blue border-t-transparent rounded-full" />
                        ) : (
                            <Search size={24} />
                        )}
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter SteamID, URL, or Vanity Name..."
                        className="w-full bg-transparent border-none text-white text-lg placeholder-gray-500 focus:ring-0 focus:outline-none py-3"
                        autoFocus
                    />
                    {input && (
                        <div className="pr-4 text-xs text-gray-500 font-mono hidden sm:block">
                            AUTO-DETECT
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-center font-medium bg-red-500/10 py-2 rounded-lg border border-red-500/20"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Grid */}
            <AnimatePresence mode="wait">
                {results && !loading && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {resultItems.map((item, idx) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 overflow-hidden group hover:bg-white/10 transition-colors ${item.full ? 'md:col-span-2' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                                        <item.icon size={14} /> {item.label}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(item.value, item.label)}
                                        className="text-steam-blue opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                                        title="Copy"
                                    >
                                        {copiedField === item.label ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                                <div className="font-mono text-lg text-white truncate selection:bg-steam-blue selection:text-black">
                                    {item.value}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {!results && !loading && !error && (
                <div className="text-center text-gray-500 py-12">
                    <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                        <Hash size={48} className="opacity-50" />
                    </div>
                    <p>Enter any format above to see the magic happen.</p>
                </div>
            )}
        </div>
    );
};

export default SteamIDConverter;
