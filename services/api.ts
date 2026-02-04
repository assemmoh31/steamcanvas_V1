const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export const api = {
    get: async (endpoint: string) => {
        const res = await fetch(`${API_URL}${endpoint}`);
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return res.json();
    },

    post: async (endpoint: string, body: any) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return res.json();
    },

    // Specific API calls
    checkHealth: async () => {
        try {
            return await api.get('/health');
        } catch (error) {
            console.error('Health check failed:', error);
            return { status: 'error', database: 'disconnected' };
        }
    }
};
