const mongoose = require('mongoose');

const seniorProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    passingYear: { type: String, required: true },
    currentPosition: { type: String, required: true }, // e.g. "SDE at Google" or "Masters at IITB"
    linkedin: { type: String },
    guidanceDomains: [{ type: String }], // e.g. ["Web Dev", "DSA", "Masters"]
});

module.exports = mongoose.model('SeniorProfile', seniorProfileSchema);
