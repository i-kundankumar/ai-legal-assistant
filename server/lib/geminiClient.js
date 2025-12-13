// server/lib/geminiClient.js
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

// 1. Initialize with the new SDK format
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeDocument(docText) {
    try {
        const prompt = `
      You are an expert AI Legal Assistant. Analyze the following legal document text.
      
      Return the output in strictly valid JSON format with this structure:
      {
        "summary": ["Point 1", "Point 2"],
        "flags": ["Risk 1", "Risk 2"],
        "suggested_clause": "Revised clause suggestion..."
      }
      
      Do not use Markdown (like \`\`\`json). Just return raw JSON.

      DOCUMENT TEXT:
      "${docText}"
    `;

        console.log("🤖 Sending to Gemini 3.0...");

        // 2. Use the new 'ai.models.generateContent' syntax
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Or "gemini-1.5-flash" if you want speed
            contents: prompt,
        });

        // 3. Extract text (The new SDK returns text directly on the object)
        let text = response.text;

        // Cleanup Markdown if the AI adds it
        if (text) {
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        console.log("✅ Gemini Responded");
        return JSON.parse(text);

    } catch (error) {
        console.error("❌ AI Error:", error.message);

        // Rate Limit Handling (Status 429)
        if (error.message.includes("429") || error.status === 429) {
            return {
                summary: ["⚠️ System Busy", "We hit the Free Tier limit."],
                flags: ["Please wait 30 seconds and try again."],
                suggested_clause: "N/A"
            };
        }

        // Generic Fallback
        return {
            summary: ["Analysis Failed", "Could not connect to AI."],
            flags: ["Error: " + error.message],
            suggested_clause: "N/A"
        };
    }
}

module.exports = { analyzeDocument };