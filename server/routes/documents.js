const express = require("express");
const router = express.Router();
const { connectDB } = require("../lib/db");
const { analyzeDocument } = require("../lib/geminiClient");
const auth = require("../middleware/auth");

// ============================
// GET all documents
// ============================
router.get("/", auth, async (req, res) => {
  const db = await connectDB();

  // USER VIEW
  if (req.user.role === "user") {
    const docs = await db
      .collection("documents")
      .find({ ownerId: req.user.id })
      .toArray();

    return res.json(docs);
  }

  // LAWYER VIEW
  if (req.user.role === "lawyer") {
    const cases = await db
      .collection("documents")
      .find({ assignedLawyer: req.user.id })
      .toArray();

    return res.json(cases);
  }

  res.status(403).json({ error: "Unauthorized" });
});


// ============================
// DELETE document
// ============================
// ============================
// DELETE document (STEP 6 APPLIED)
// ============================
router.delete("/:id", auth, async (req, res) => {
  try {
    const db = await connectDB();
    const { ObjectId } = require("mongodb");

    const docId = new ObjectId(req.params.id);

    const doc = await db.collection("documents").findOne({ _id: docId });

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // 🔒 STEP 6: BLOCK USER AFTER ESCALATION
    if (doc.status === "escalated" && req.user.role === "user") {
      return res.status(403).json({
        error: "Document is locked. Lawyer is handling this case."
      });
    }

    // 🔒 Owner check (extra safety)
    if (req.user.role === "user" && doc.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Not your document" });
    }

    await db.collection("documents").deleteOne({ _id: docId });
    await db.collection("escalations").deleteMany({ document_id: docId });

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete document" });
  }
});


// ============================
// POST analyze + save document
// ============================
// ============================
// POST analyze + save document
// ============================
router.post("/", auth, async (req, res) => {
  try {
    const db = await connectDB();
    const { title, text, category } = req.body;

    if (!title || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const analysisResults = await analyzeDocument(text);

    const doc = {
      title,
      text,
      category: category || "contract",
      analysis: analysisResults,
      ownerId: req.user.id,        // ✅ REQUIRED
      ownerEmail: req.user.email,  // optional
      status: "analyzed",
      uploaded_at: new Date()
    };

    const result = await db.collection("documents").insertOne(doc);

    res.json({ _id: result.insertedId, ...doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================
// GET document by ID
// ============================
router.get("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const { ObjectId } = require("mongodb");

    const doc = await db
      .collection("documents")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
