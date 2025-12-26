const express = require("express");
const router = express.Router();
const { connectDB } = require("../lib/db");
const auth = require("../middleware/auth");
const { ObjectId } = require("mongodb");

/* ============================
   GET cases (LAWYER ONLY)
============================ */
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "lawyer") {
      return res.status(403).json({ error: "Lawyers only" });
    }

    const db = await connectDB();

    console.log("LAWYER FETCH ID:", String(req.user.id));

    const cases = await db
      .collection("escalations")
      .find({ assignedLawyers: String(req.user.id) }) 
      .sort({ created_at: -1 })
      .toArray();

    console.log("CASES FOUND:", cases.length);

    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   ESCALATE (USER ONLY)
============================ */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ error: "Only users can escalate" });
    }

    const { documentId } = req.body;
    const db = await connectDB();

    // 1️⃣ Fetch logged-in user (FOR NAME + EMAIL)
    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.user.id)
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2️⃣ Fetch document owned by user
    const doc = await db.collection("documents").findOne({
      _id: new ObjectId(documentId),
      ownerId: String(req.user.id)
    });

    if (!doc) {
      return res.status(404).json({
        error: "Document not found or not owned by you"
      });
    }

    // 3️⃣ Fetch ALL lawyers
    const lawyers = await db
      .collection("users")
      .find({ role: "lawyer" })
      .toArray();

    if (lawyers.length === 0) {
      return res.status(400).json({ error: "No lawyers available" });
    }

    // 4️⃣ Create escalation (WITH NAME + EMAIL)
    const escalation = {
      document_id: doc._id,
      document_title: doc.title,
      requester_id: String(req.user.id),
      requester_name: user.name,        // ✅ FIX
      requester_email: user.email,      // ✅ FIX
      assignedLawyers: lawyers.map(l => String(l._id)),
      status: "pending",
      created_at: new Date()
    };

    const result = await db.collection("escalations").insertOne(escalation);

    // 5️⃣ Update document status
    await db.collection("documents").updateOne(
      { _id: doc._id },
      { $set: { status: "escalated" } }
    );

    res.json({
      message: "Escalated to all lawyers",
      escalationId: result.insertedId
    });

  } catch (err) {
    console.error("ESCALATION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});



/* ============================
   RESOLVE CASE (LAWYER ONLY)
============================ */
router.post("/:id/submit-review", auth, async (req, res) => {
  try {
    if (req.user.role !== "lawyer") {
      return res.status(403).json({ error: "Lawyers only" });
    }

    const { edited_clause, comments } = req.body;
    const db = await connectDB();

    // ✅ MATCH AGAINST ARRAY
    const kase = await db.collection("escalations").findOne({
      _id: new ObjectId(req.params.id),
      assignedLawyers: String(req.user.id)
    });

    if (!kase) {
      return res.status(404).json({
        error: "Case not found or not assigned to you"
      });
    }

    // 1️⃣ Update document
    await db.collection("documents").updateOne(
      { _id: kase.document_id },
      {
        $push: {
          revisions: {
            revised_text: edited_clause,
            comments,
            lawyerName: req.user.email,
            date: new Date()
          }
        },
        $set: { status: "resolved" }
      }
    );

    // 2️⃣ Mark escalation resolved
    await db.collection("escalations").updateOne(
      { _id: kase._id },
      { $set: { status: "resolved" } }
    );

    res.json({ message: "Case resolved successfully" });

  } catch (err) {
    console.error("SUBMIT REVIEW ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
