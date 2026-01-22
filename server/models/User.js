const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['junior', 'senior', 'admin'], required: true },
    college: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true }, // e.g., "3rd Year", "2024"
    mobile: { type: String, required: true, unique: true, index: true },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

// Password hashing middleware
// Password hashing middleware
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Password verification method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
