const mongoose = require('mongoose');

const juniorProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    interests: [{ type: String }],
    goals: { type: String },
});

module.exports = mongoose.model('JuniorProfile', juniorProfileSchema);
