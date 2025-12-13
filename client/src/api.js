// src/api.js

// 1. REMOVE the hardcoded domain.
// In production (Vercel), we just use the relative path (e.g. "/api/documents")
// The browser will automatically attach the correct domain.
const API_BASE = "";

export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = options.headers || {};

    // Default to JSON unless sending a file (FormData)
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) headers['Authorization'] = `Bearer ${token}`;

    // 2. Clean up the endpoint
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // 3. Construct URL (Now it's just "/api/..." instead of "http://localhost:4000/api/...")
    const url = `${API_BASE}${cleanEndpoint}`;

    try {
        console.log(`📡 Requesting: ${url}`);

        const res = await fetch(url, { ...options, headers });

        // 4. Handle HTML Errors (Like 404 pages from Vercel)
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error("❌ Received HTML/Text instead of JSON:", text.substring(0, 100));
            throw new Error(`Server Error: Received ${res.status} (${res.statusText})`);
        }

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || data.message || `API Error: ${res.status}`);
        }

        return data;
    } catch (error) {
        console.error("❌ API Fetch Error:", error);
        throw error;
    }
}