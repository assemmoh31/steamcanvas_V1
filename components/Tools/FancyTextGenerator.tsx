import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Type, Info, AlertTriangle, Sparkles, Sliders, ClipboardCopy } from 'lucide-react';

// --- Constants & Mappings ---

const STYLES = [
    { id: 'script', name: 'Script', map: { a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: 'ℯ', f: '𝒻', g: 'ℊ', h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀', l: '𝓁', m: '𝓂', n: '𝓃', o: 'ℴ', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊', v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏', A: '𝒜', B: 'ℬ', C: '𝒞', D: '𝒟', E: 'ℰ', F: 'ℱ', G: '𝒢', H: 'ℋ', I: 'ℐ', J: '𝒥', K: '𝒦', L: 'ℒ', M: 'ℳ', N: '𝒩', O: '𝒪', P: '𝒫', Q: '𝒬', R: 'ℛ', S: '𝒮', T: '𝒯', U: '𝒰', V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵' } },
    { id: 'bold_serif', name: 'Bold Serif', map: { a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠', h: '𝐡', i: '𝐢', j: '𝐣', k: '𝐤', l: '𝐥', m: '𝐦', n: '𝐧', o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭', u: '𝐮', v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳', A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆', H: '𝐇', I: '𝐈', J: '𝐉', K: '𝐊', L: '𝐋', M: '𝐌', N: '𝐍', O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓', U: '𝐔', V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙', '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗' } },
    { id: 'bold_italic_serif', name: 'Bold Italic Serif', map: { a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋', k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐', p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕', u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵', O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿', Y: '𝑀', Z: '𝒁' } },
    { id: 'monospace', name: 'Monospace', map: { a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖', n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝', u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣', A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼', N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉', '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿' } },
    { id: 'double_struck', name: 'Double Struck', map: { a: '𝕒', b: '𝕓', c: '𝕔', d: '𝕕', e: '𝕖', f: '𝕗', g: '𝕘', h: '𝕙', i: '𝕚', j: '𝕛', k: '𝕜', l: '𝕝', m: '𝕞', n: '𝕟', o: '𝕠', p: '𝕡', q: '𝕢', r: '𝕣', s: '𝕤', t: '𝕥', u: '𝕦', v: '𝕧', w: '𝕨', x: '𝕩', y: '𝕪', z: '𝕫', A: '𝔸', B: '𝔹', C: 'ℂ', D: '𝔻', E: '𝔼', F: '𝔽', G: '𝔾', H: 'ℍ', I: '𝕀', J: '𝕁', K: '𝕂', L: '𝕃', M: '𝕄', N: 'ℕ', O: '𝕆', P: 'ℙ', Q: 'ℚ', R: 'ℝ', S: '𝕊', T: '𝕋', U: '𝕌', V: '𝕍', W: '𝕎', X: '𝕏', Y: '𝕐', Z: 'ℤ', '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡' } },
    { id: 'small_caps', name: 'Small Caps', map: { a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ', A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ', I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ', Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x', Y: 'ʏ', Z: 'ᴢ' } },
    { id: 'fraktur', name: 'Fraktur', map: { a: '𝔞', b: '𝔟', c: '𝔠', d: '𝔡', e: '𝔢', f: '𝔣', g: '𝔤', h: '𝔥', i: '𝔦', j: '𝔧', k: '𝔨', l: '𝔩', m: '𝔪', n: '𝔫', o: '𝔬', p: '𝔭', q: '𝔮', r: '𝔯', s: '𝔰', t: '𝔱', u: '𝔲', v: '𝔳', w: '𝔴', x: '𝔵', y: '𝔶', z: '𝔷', A: '𝔄', B: '𝔅', C: '𝔆', D: '𝔇', E: '𝔈', F: '𝔉', G: '𝔊', H: '𝔋', I: 'ℑ', J: '𝔍', K: '𝔎', L: '𝔏', M: '𝔐', N: '𝔑', O: '𝔒', P: '𝔓', Q: '𝔔', R: 'ℜ', S: '𝔖', T: '𝔗', U: '𝔘', V: '𝔙', W: '𝔚', X: '𝔛', Y: '𝔜', Z: 'ℨ' } },
    { id: 'bold_fraktur', name: 'Bold Fraktur', map: { a: '𝖆', b: '𝖇', c: '𝖈', d: '𝖉', e: '𝖊', f: '𝖋', g: '𝖌', h: '𝖍', i: '𝖎', j: '𝖏', k: '𝖐', l: '𝖑', m: '𝖒', n: '𝖓', o: '𝖔', p: '𝖕', q: '𝖖', r: '𝖗', s: '𝖘', t: '𝖙', u: '𝖚', v: '𝖛', w: '𝖜', x: '𝖝', y: '𝖞', z: '𝖟', A: '𝕬', B: '𝕭', C: '𝕮', D: '𝕯', E: '𝕰', F: '𝕱', G: '𝕲', H: '𝕳', I: '𝕴', J: '𝕵', K: '𝕶', L: '𝕷', M: '𝕸', N: '𝕹', O: '𝕺', P: '𝕻', Q: '𝕼', R: '𝕽', S: '𝕾', T: '𝕿', U: '𝖀', V: '𝖁', W: '𝖂', X: '𝖃', Y: '𝖄', Z: '𝖅' } },
    { id: 'sans_serif', name: 'Sans Serif', map: { a: '𝖺', b: '𝖻', c: '𝖼', d: '𝖽', e: '𝖾', f: '𝖿', g: '𝗀', h: '𝗁', i: '𝗂', j: '𝗃', k: '𝗄', l: '𝗅', m: '𝗆', n: '𝗇', o: '𝗈', p: '𝗉', q: '𝗊', r: '𝗋', s: '𝗌', t: '𝗍', u: '𝗎', v: '𝗏', w: '𝗐', x: '𝗑', y: '𝗒', z: '𝗓', A: '𝖠', B: '𝖡', C: '𝖢', D: '𝖣', E: '𝖤', F: '𝖥', G: '𝖦', H: '𝖧', I: '𝖨', J: '𝖩', K: '𝖪', L: '𝖫', M: '𝖬', N: '𝖭', O: '𝖮', P: '𝖯', Q: '𝖰', R: '𝖱', S: '𝖲', T: '𝖳', U: '𝖴', V: '𝖵', W: '𝖶', X: '𝖷', Y: '𝖸', Z: '𝖹', '0': '𝟢', '1': '𝟣', '2': '𝟲', '3': '𝟳', '4': '𝟴', '5': '𝟵', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫' } },
    { id: 'bold_sans_serif', name: 'Bold Sans Serif', map: { a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇', A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭', '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵' } },

    // New Styles
    { id: 'vaporwave', name: 'Vaporwave (Full Width)', map: { '!': '！', '"': '＂', '#': '＃', '$': '＄', '%': '％', '&': '＆', "'": '＇', '(': '（', ')': '）', '*': '＊', '+': '＋', ',': '，', '-': '－', '.': '．', '/': '／', '0': '０', '1': '１', '2': '２', '3': '３', '4': '４', '5': '５', '6': '６', '7': '７', '8': '８', '9': '９', ':': '：', ';': '；', '<': '＜', '=': '＝', '>': '＞', '?': '？', '@': '＠', 'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ', 'G': 'Ｇ', 'H': 'Ｈ', 'I': 'Ｉ', 'J': 'Ｊ', 'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ', 'O': 'Ｏ', 'P': 'Ｐ', 'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ', 'U': 'Ｕ', 'V': 'Ｖ', 'W': 'Ｗ', 'X': 'Ｘ', 'Y': 'Ｙ', 'Z': 'Ｚ', '[': '［', '\\': '＼', ']': '］', '^': '＾', '_': '＿', '`': '｀', 'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ', 'i': 'ｉ', 'j': 'ｊ', 'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ', 'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ', 'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ', 'y': 'ｙ', 'z': 'ｚ', '{': '｛', '|': '｜', '}': '｝', '~': '～' } },
    { id: 'bubbles', name: 'Bubbles', map: { a: 'ⓐ', b: 'ⓑ', c: 'ⓒ', d: 'ⓓ', e: 'ⓔ', f: 'ⓕ', g: 'ⓖ', h: 'ⓗ', i: 'ⓘ', j: 'ⓙ', k: 'ⓚ', l: 'ⓛ', m: 'ⓜ', n: 'ⓝ', o: 'ⓞ', p: 'ⓟ', q: 'ⓠ', r: 'ⓡ', s: 'ⓢ', t: 'ⓣ', u: 'ⓤ', v: 'ⓥ', w: 'ⓦ', x: 'ⓧ', y: 'ⓨ', z: 'ⓩ', A: 'Ⓐ', B: 'Ⓑ', C: 'Ⓒ', D: 'Ⓓ', E: 'Ⓔ', F: 'Ⓕ', G: 'Ⓖ', H: 'Ⓗ', I: 'Ⓘ', J: 'Ⓙ', K: 'Ⓚ', L: 'Ⓛ', M: 'Ⓜ', N: 'Ⓝ', O: 'Ⓞ', P: 'Ⓟ', Q: 'Ⓠ', R: 'Ⓡ', S: 'Ⓢ', T: 'Ⓣ', U: 'Ⓤ', V: 'Ⓥ', W: 'Ⓦ', X: 'Ⓧ', Y: 'Ⓨ', Z: 'Ⓩ', '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨' } },
    { id: 'squares', name: 'Squares', map: { a: '🄰', b: '🄱', c: '🄲', d: '🄳', e: '🄴', f: '🄵', g: '🄶', h: '🄷', i: '🄸', j: '🄹', k: '🄺', l: '🄻', m: '🄼', n: '🄽', o: '🄾', p: '🄿', q: '🅀', r: '🅁', s: '🅂', t: '🅃', u: '🅄', v: '🅅', w: '🅆', x: '🅇', y: '🅈', z: '🅉', A: '🄰', B: '🄱', C: '🄲', D: '🄳', E: '🄴', F: '🄵', G: '🄶', H: '🄷', I: '🄸', J: '🄹', K: '🄺', L: '🄻', M: '🄼', N: '🄽', O: '🄾', P: '🄿', Q: '🅀', R: '🅁', S: '🅂', T: '🅃', U: '🅄', V: '🅅', W: '🅆', X: '🅇', Y: '🅈', Z: '🅉' } },
    { id: 'strikethrough', name: 'Strikethrough', customTransform: (text: string) => text.split('').map(c => c + '\u0336').join('') }
];

const DECORATIONS = [
    { id: 'none', name: 'None', prefix: '', suffix: '' },
    { id: 'sparkles', name: 'Sparkles', prefix: '✨ ', suffix: ' ✨' },
    { id: 'stars', name: 'Stars', prefix: '★ ', suffix: ' ★' },
    { id: 'border', name: 'Border', prefix: '【 ', suffix: ' 】' },
    { id: 'arrows', name: 'Arrows', prefix: '» ', suffix: ' «' },
    { id: 'cyber', name: 'Cyber', prefix: '⚡ ', suffix: ' ⚡' },
];

const FancyTextGenerator: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [activeDecoration, setActiveDecoration] = useState<string>('none');
    const [copiedStyleId, setCopiedStyleId] = useState<string | null>(null);

    const transformText = (text: string, style: any, decorationId: string) => {
        let transformed = '';
        if (style.customTransform) {
            transformed = style.customTransform(text);
        } else {
            transformed = text.split('').map(char => style.map[char] || char).join('');
        }

        const decoration = DECORATIONS.find(d => d.id === decorationId);
        if (decoration && decoration.id !== 'none') {
            return `${decoration.prefix}${transformed}${decoration.suffix}`;
        }
        return transformed;
    };

    const handleCopy = useCallback(async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedStyleId(id);
            setTimeout(() => setCopiedStyleId(null), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    }, []);

    const handleCopyAll = async () => {
        const allText = STYLES.map(style => transformText(inputText, style, activeDecoration)).join('\n');
        handleCopy(allText, 'all');
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 lg:p-8 space-y-12">

            {/* Header */}
            <div className="text-center space-y-4">
                <h2 className="text-5xl font-black italic text-white tracking-tighter uppercase relative inline-block">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 pr-2">
                        Fancy Text Generator
                    </span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Type your text below to generate stylish unicode fonts. Perfect for your Steam profile name, summary, or info box.
                </p>
            </div>

            {/* Main Interface */}
            <div className="space-y-8">

                {/* Input Zone */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-lg"></div>
                    <div className="relative bg-[#151921] rounded-2xl border border-white/10 p-1">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type something amazing..."
                            className="w-full bg-black/40 text-white placeholder-gray-500 text-2xl font-bold p-6 rounded-xl outline-none border-none resize-none h-40 focus:ring-2 ring-purple-500/50 transition-all"
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2 max-w-[calc(100%-2rem)]">
                            {/* Decoration Toggle */}
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur border border-white/10 rounded-lg p-1 max-w-full overflow-x-auto no-scrollbar">
                                <span className="text-xs font-bold text-gray-400 px-2 uppercase shrink-0">Decorations:</span>
                                {DECORATIONS.map(dec => (
                                    <button
                                        key={dec.id}
                                        onClick={() => setActiveDecoration(dec.id)}
                                        className={`px-3 py-1.5 rounded text-xs font-bold transition-all shrink-0 whitespace-nowrap ${activeDecoration === dec.id
                                            ? 'bg-purple-500 text-white shadow-lg'
                                            : 'hover:bg-white/10 text-gray-400'
                                            }`}
                                    >
                                        {dec.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                {inputText ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                                Generated Styles (~{STYLES.length})
                            </span>
                            <button
                                onClick={handleCopyAll}
                                className="flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                {copiedStyleId === 'all' ? <Check size={14} /> : <ClipboardCopy size={14} />}
                                {copiedStyleId === 'all' ? 'Copied All!' : 'Copy All Results'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {STYLES.map((style) => {
                                const result = transformText(inputText, style, activeDecoration);
                                return (
                                    <div key={style.id} className="group bg-[#151921]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-purple-500/50 hover:bg-white/5 transition-all">
                                        <div className="overflow-hidden mr-4">
                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                {style.name}
                                            </div>
                                            <div className="text-xl text-white truncate font-medium">
                                                {result}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(result, style.id)}
                                            className={`p-3 rounded-lg transition-all flex-shrink-0 ${copiedStyleId === style.id
                                                ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                                                : 'bg-white/5 text-gray-400 group-hover:bg-purple-500 group-hover:text-white'
                                                }`}
                                        >
                                            {copiedStyleId === style.id ? <Check size={20} /> : <Copy size={20} />}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                        <Sparkles size={48} className="text-gray-600 mb-4" />
                        <p className="text-gray-500 font-bold">Start typing above to see the magic happen</p>
                    </div>
                )}
            </div>

            {/* Accessibility Warning */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center gap-4 max-w-2xl mx-auto">
                <AlertTriangle className="text-orange-500 flex-shrink-0" size={24} />
                <p className="text-sm text-orange-200/80">
                    <span className="font-bold text-orange-400">⚠️ Note:</span> Some screen readers and older mobile devices may have difficulty reading these fonts. Use sparingly for important profile information to ensure accessibility for all users.
                </p>
            </div>

        </div>
    );
};

export default FancyTextGenerator;
