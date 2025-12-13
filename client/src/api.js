// src/api.js

// 1. Define your Backend URL explicitly
// Change port 4000 to whatever your server runs on (check your server terminal)
const API_BASE = "http://localhost:4000";

export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = options.headers || {};

    // Default to JSON unless sending a file (FormData)
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) headers['Authorization'] = `Bearer ${token}`;

    // 2. Construct the full URL
    // Ensure endpoint starts with '/' to avoid double slashes if you mess up
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE}${cleanEndpoint}`;

    try {
        console.log(`📡 Requesting: ${url}`); // Debug Log

        const res = await fetch(url, { ...options, headers });

        // 3. Handle Non-JSON Responses (Common source of "Wrong Data")
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error("❌ Received HTML/Text instead of JSON:", text.substring(0, 100));
            throw new Error("Server returned non-JSON response. Check your API URL.");
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