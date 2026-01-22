const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
    junior: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senior: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    message: { type: String }, // Optional message from junior
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
