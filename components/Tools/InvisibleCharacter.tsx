import React, { useState, useCallback } from 'react';
import { Copy, Check, Info, FileText, Type, AlertCircle } from 'lucide-react';

const CHARACTERS = {
    HANGUL_FILLER: '\u3164',
    BRAILLE_BLANK: '\u2800',
    ZERO_WIDTH_JOINER: '\u200D',
};

const InvisibleCharacter: React.FC = () => {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [customLength, setCustomLength] = useState<number>(5);

    const handleCopy = useCallback(async (text: string, key: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    }, []);

    const generateCustomString = () => {
        return CHARACTERS.HANGUL_FILLER.repeat(customLength);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 lg:p-8 space-y-12">

            {/* Header */}
            <div className="text-center space-y-4">
                <h2 className="text-5xl font-black italic text-white tracking-tighter uppercase relative inline-block">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 pr-2">
                        Invisible Character
                    </span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Generate valid zero-width characters to create blank names, invisible separators, and clean bios.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Card 1: Blank Name */}
                <div className="bg-[#151921]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 flex flex-col items-center text-center hover:border-white/20 transition-colors group">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-300 mb-6 group-hover:bg-white/10 transition-colors">
                        <Type size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Blank Name</h3>
                    <p className="text-sm text-gray-500 mb-8 max-w-[200px]">
                        The classic Hangul Filler (U+3164). Best for making your Steam profile name invisible.
                    </p>
                    <button
                        onClick={() => handleCopy(CHARACTERS.HANGUL_FILLER, 'name')}
                        className={`mt-auto w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${copiedKey === 'name'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                            }`}
                    >
                        {copiedKey === 'name' ? (
                            <>
                                <Check size={18} /> Copied!
                            </>
                        ) : (
                            <>
                                <Copy size={18} /> Copy Character
                            </>
                        )}
                    </button>
                </div>

                {/* Card 2: Clear Bio */}
                <div className="bg-[#151921]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 flex flex-col items-center text-center hover:border-white/20 transition-colors group">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-300 mb-6 group-hover:bg-white/10 transition-colors">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Clear Bio</h3>
                    <p className="text-sm text-gray-500 mb-8 max-w-[200px]">
                        Braille Pattern Blank (U+2800). Perfect for clearing out bio lines or creating multi-line empty spaces.
                    </p>
                    <button
                        onClick={() => handleCopy(CHARACTERS.BRAILLE_BLANK.repeat(3), 'bio')}
                        className={`mt-auto w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${copiedKey === 'bio'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                            }`}
                    >
                        {copiedKey === 'bio' ? (
                            <>
                                <Check size={18} /> Copied!
                            </>
                        ) : (
                            <>
                                <Copy size={18} /> Copy Sequence
                            </>
                        )}
                    </button>
                </div>

                {/* Card 3: Custom Length */}
                <div className="bg-[#151921]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 flex flex-col items-center text-center hover:border-white/20 transition-colors group">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-300 mb-6 group-hover:bg-white/10 transition-colors">
                        <span className="font-mono text-2xl font-bold px-2 border-x border-dashed border-gray-600">{'   '}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Custom Length</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-[200px]">
                        Generate a specific length string for games checking character minimums.
                    </p>

                    <div className="w-full px-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Length</span>
                            <span className="text-xs font-mono text-white bg-white/10 px-2 rounded">{customLength} chars</span>
                        </div>
                        <input
                            type="range"
                            min="2"
                            max="32"
                            value={customLength}
                            onChange={(e) => setCustomLength(parseInt(e.target.value))}
                            className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                        />
                    </div>

                    <button
                        onClick={() => handleCopy(generateCustomString(), 'custom')}
                        className={`mt-auto w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${copiedKey === 'custom'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                            }`}
                    >
                        {copiedKey === 'custom' ? (
                            <>
                                <Check size={18} /> Copied!
                            </>
                        ) : (
                            <>
                                <Copy size={18} /> Copy String
                            </>
                        )}
                    </button>
                </div>

            </div>

            {/* Pro Tips Section */}
            <div className="bg-gradient-to-br from-blue-900/10 to-purple-900/10 rounded-2xl border border-white/5 p-6 backdrop-blur-md">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                        <AlertCircle size={24} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-lg font-bold text-white">Pro Tip: Which character should I use?</h4>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
                            Steam's filters update occasionally. If the primary <b>Hangul Filler</b> doesn't work for your name, try the <b>Braille Blank</b>. For clearing your bio or long text fields, the <b>Braille Blank</b> pattern is almost always the best choice as it supports multi-line formatting correctly.
                        </p>
                        <div className="pt-2 flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-black/20 border border-white/5 rounded text-xs text-gray-500 font-mono">U+3164 (Hangul)</span>
                            <span className="px-2 py-1 bg-black/20 border border-white/5 rounded text-xs text-gray-500 font-mono">U+2800 (Braille)</span>
                            <span className="px-2 py-1 bg-black/20 border border-white/5 rounded text-xs text-gray-500 font-mono">U+200D (ZWJ)</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default InvisibleCharacter;
