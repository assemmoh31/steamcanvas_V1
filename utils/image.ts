
/**
 * Utility to generate Cloudflare Image Resizing URLs.
 * This helps in serving optimized images based on device capabilities and screen size.
 */

interface ImageTransformOptions {
    width?: number;
    height?: number;
    format?: 'avif' | 'webp' | 'json';
    quality?: number;
    fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
    background?: string;
}

export const getOptimizedImageUrl = (url: string, options: ImageTransformOptions = {}): string => {
    if (!url) return '';

    // Filter out invalid URLs or data URIs
    if (url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }

    // Disable optimization on localhost (Vite dev server doesn't handle /cdn-cgi/image)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return url;
    }

    if (url.includes('localhost')) {
        return url;
    }

    // If already a Cloudflare resized URL, return as is (to avoid double processing)
    if (url.includes('/cdn-cgi/image/')) {
        return url;
    }

    // Construct the transformation string
    const params: string[] = [];

    if (options.width) params.push(`width=${options.width}`);
    if (options.height) params.push(`height=${options.height}`);
    // Default to AVIF for best compression if not specified
    params.push(`format=${options.format || 'avif'}`);
    if (options.quality) params.push(`quality=${options.quality}`);
    if (options.fit) params.push(`fit=${options.fit}`);
    if (options.background) params.push(`background=${options.background}`);

    const transformationString = params.join(',');

    // Check if it's a relative URL or absolute
    try {
        const urlObj = new URL(url, window.location.origin);

        // Inject /cdn-cgi/image/ before the path
        // If it's a full URL to another domain, we wrap it
        // Default strategy: assume the current domain serves images via /cdn-cgi/image
        // or the image domain supports it.

        // If the image is on the same domain or a subdomain we control
        if (urlObj.hostname === window.location.hostname || urlObj.hostname.includes('steamcanvas')) {
            return `${urlObj.origin}/cdn-cgi/image/${transformationString}${urlObj.pathname}${urlObj.search}`;
        }

        // Fallback: If it's an external R2 bucket url (e.g. pub-xxx.r2.dev), 
        // we might need a worker proxy. 
        // For now, let's assume we can use the current origin's image resizer to proxy it
        // return `/cdn-cgi/image/${transformationString}/${url}`;

        // Actually, safest is to append it if we know it's our asset domain.
        // For this task, we'll assume the `imageUrl` is compatible with this transformation.

        return `/cdn-cgi/image/${transformationString}/${url}`;

    } catch (e) {
        // If URL parsing fails, return original
        return url;
    }
};
