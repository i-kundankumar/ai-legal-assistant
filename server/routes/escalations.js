const express = require('express');
const router = express.Router();
const Escalation = require('../models/Escalation');
const Document = require('../models/Document');

// GET all cases
router.get('/', async (req, res) => {
    try {
        const cases = await Escalation.find().sort({ created_at: -1 });
        res.json(cases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create case (ESCALATE)
router.post('/', async (req, res) => {
    const { documentId, analysisId, requesterEmail } = req.body;

    try {
        // 1. Fetch Document (to get the Title)
        const doc = await Document.findById(documentId);
        if (!doc) return res.status(404).json({ error: "Document not found" });

        // 2. Create the Escalation Ticket
        const newEscalation = new Escalation({
            document_id: documentId,
            analysis_id: analysisId,
            requester_email: requesterEmail,
            document_title: doc.title || "Untitled Document", // Use real title
            status: 'pending'
        });

        await newEscalation.save();

        // 3. IMPORTANT: Update the Original Document Status to 'escalated'
        const updatedDoc = await Document.findByIdAndUpdate(
            documentId,
            { status: 'escalated' },
            { new: true }
        );

        console.log(`🔄 Escalated Doc: "${doc.title}" | Status is now: ${updatedDoc.status}`);

        res.json({ message: "Escalated successfully", escalationId: newEscalation._id });

    } catch (err) {
        console.error("Escalation Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST submit review (RESOLVE)
router.post('/:id/submit-review', async (req, res) => {
    const { edited_clause, comments, lawyerName } = req.body;

    try {
        const kase = await Escalation.findById(req.params.id);
        if (!kase) return res.status(404).json({ error: "Case not found" });

        // 1. Add revisions to the document AND Update status to 'resolved'
        await Document.findByIdAndUpdate(kase.document_id, {
            $push: {
                revisions: { revised_text: edited_clause, comments, lawyerName }
            },
            status: 'resolved' // <--- CRITICAL FIX: Mark document as resolved too!
        });

        // 2. Mark Escalation Ticket as resolved
        kase.status = 'resolved';
        await kase.save();

        console.log(`✅ Case Resolved. Document ${kase.document_id} marked as 'resolved'.`);

        res.json({ message: "Review submitted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;