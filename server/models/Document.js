const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    userEmail: String,
    uploaded_at: { type: Date, default: Date.now },
    status: {
        type: String,
        default: 'analyzed', // Default state when created
        enum: ['pending', 'analyzed', 'escalated', 'resolved']
    },
    analysis: {
        summary: [String],
        flags: [String],
        suggested_clause: String
    },
    revisions: [{
        revised_text: String,
        comments: String,
        lawyerName: String,
        date: { type: Date, default: Date.now }
    }]
});


module.exports = mongoose.model('Document', DocumentSchema);