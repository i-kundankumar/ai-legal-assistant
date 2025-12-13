const mongoose = require('mongoose');

const EscalationSchema = new mongoose.Schema({
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    document_title: String,
    requester_email: String,
    status: { type: String, default: 'pending', enum: ['pending', 'review_in_progress', 'resolved'] },
    created_at: { type: Date, default: Date.now },
    lawyerId: String
});

module.exports = mongoose.model('Escalation', EscalationSchema);