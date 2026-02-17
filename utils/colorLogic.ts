/**
 * SteamCanvas Color Logic Utilities
 * Includes:
 * 1. Color Conversion Helpers
 * 2. WCAG Contrast Calculations
 * 3. Smart Quantization for Palette Extraction
 */

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface ColorSwatch extends RGB {
    hex: string;
    hsl: [number, number, number]; // h, s, l (0-1 range)
    count: number;
    contrastWhite: number;
    contrastDark: number;
    role: 'Vibrant' | 'Muted' | 'Dark' | 'Light';
}

// --- Constants ---
const STEAM_DARK_BG = { r: 16, g: 18, b: 20 }; // #101214

// --- Color Conversion ---

export function componentToHex(c: number): string {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

// --- Accessibility & Analysis ---

export function getLuminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

export function getColorRole(r: number, g: number, b: number): 'Vibrant' | 'Muted' | 'Dark' | 'Light' {
    const [h, s, l] = rgbToHsl(r, g, b);

    if (l < 0.2) return 'Dark';
    if (l > 0.8) return 'Light';
    if (s > 0.4) return 'Vibrant';
    return 'Muted';
}

// --- Quantization (Histogram with Diversity Check) ---

function colorDistance(c1: RGB, c2: RGB): number {
    return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
}

export function quantize(pixels: Uint8ClampedArray, maxColors: number = 6): ColorSwatch[] {
    const colorMap: { [key: string]: { r: number, g: number, b: number, count: number } } = {};
    const quantizationFactor = 5; // Group similar colors (5x5x5 buckets)

    // 1. Build Histogram
    for (let i = 0; i < pixels.length; i += 4) {
        // Skip transparent pixels
        if (pixels[i + 3] < 128) continue;

        const r = Math.round(pixels[i] / quantizationFactor) * quantizationFactor;
        const g = Math.round(pixels[i + 1] / quantizationFactor) * quantizationFactor;
        const b = Math.round(pixels[i + 2] / quantizationFactor) * quantizationFactor;

        const key = `${r},${g},${b}`;
        if (colorMap[key]) {
            colorMap[key].count++;
        } else {
            colorMap[key] = { r, g, b, count: 1 };
        }
    }

    // 2. Sort by frequency
    let sortedColors = Object.values(colorMap).sort((a, b) => b.count - a.count);

    // 3. Select diverse colors
    const palette: ColorSwatch[] = [];
    const minDistance = 30; // Min euclidean distance to be considered "different"

    for (const color of sortedColors) {
        if (palette.length >= maxColors) break;

        const isTooClose = palette.some(p => colorDistance(p, color) < minDistance);

        if (!isTooClose) {
            const hex = rgbToHex(color.r, color.g, color.b);
            const contrastWhite = getContrastRatio(color, { r: 255, g: 255, b: 255 });
            const contrastDark = getContrastRatio(color, STEAM_DARK_BG);
            const [h, s, l] = rgbToHsl(color.r, color.g, color.b);

            palette.push({
                ...color,
                hex,
                hsl: [h, s, l],
                contrastWhite,
                contrastDark,
                role: getColorRole(color.r, color.g, color.b)
            });
        }
    }

    return palette;
}
