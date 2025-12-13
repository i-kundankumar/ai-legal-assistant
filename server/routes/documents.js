const express = require('express');
const router = express.Router();
// ❌ REMOVE fileDB imports, you don't need them anymore
// const { readDB, writeDB } = require('../lib/fileDB'); 

const { analyzeDocument } = require('../lib/geminiClient');
const Escalation = require('../models/Escalation');
const Document = require('../models/Document');

// GET all documents from MongoDB
router.get('/', async (req, res) => {
    try {
        // ✅ FIX: Fetch from MongoDB instead of readDB()
        // .sort({ uploaded_at: -1 }) puts the newest docs first
        const docs = await Document.find().sort({ uploaded_at: -1 });
        res.json(docs);
    } catch (err) {
        console.error("❌ Error fetching docs:", err.message);
        res.status(500).json({ error: "Failed to fetch documents" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Document.findByIdAndDelete(id);
        // Also delete any escalations linked to this doc (Optional but good practice)
        await Escalation.deleteMany({ document_id: id });

        console.log(`🗑️ Deleted document: ${id}`);
        res.json({ message: "Document deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Failed to delete document" });
    }
});

// POST analyze and save to MongoDB
router.post('/', async (req, res) => {
    console.log("📨 Server received a request!");
    const { title, text, userEmail } = req.body;

    try {
        console.log("🤖 Starting AI Analysis...");
        const analysisResults = await analyzeDocument(text);

        const newDoc = new Document({
            title,
            text,
            userEmail,
            analysis: analysisResults
        });

        console.log("💾 Saving to MongoDB...");
        await newDoc.save();

        console.log("✅ Successfully Saved:", newDoc._id);
        res.json(newDoc);
    } catch (err) {
        console.error("❌ ERROR IN BACKEND:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET specific document by ID
router.get('/:id', async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ error: "Document not found" });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;