
import { quantize, ColorSwatch } from '../utils/colorLogic';

self.onmessage = (e: MessageEvent) => {
    const { pixels, maxColors } = e.data;

    try {
        // Run quantization (CPU intensive)
        const palette = quantize(pixels, maxColors);

        // Send back results
        self.postMessage({ palette });
    } catch (error) {
        self.postMessage({ error: 'Failed to analyze colors' });
    }
};
