const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const SeniorProfile = require('../models/SeniorProfile');

// @route   GET /api/users/seniors
// @desc    Get all verified seniors with filters
// @access  Private
router.get('/seniors', protect, async (req, res) => {
    try {
        const { college, department, domain } = req.query;

        // Build query for User (role=senior)
        let userQuery = { role: 'senior' }; // Add verified: true later when admin is ready
        if (college) {
            userQuery.college = { $regex: college, $options: 'i' };
        }
        if (department) {
            userQuery.department = { $regex: department, $options: 'i' };
        }

        // Find users first
        const users = await User.find(userQuery).select('-password');
        const userIds = users.map(user => user._id);

        // Build query for SeniorProfile
        let profileQuery = { user: { $in: userIds } };
        if (domain) {
            profileQuery.guidanceDomains = { $regex: domain, $options: 'i' };
        }

        const seniorProfiles = await SeniorProfile.find(profileQuery).populate('user', '-password');

        res.json(seniorProfiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        let profile = null;
        if (user.role === 'senior') {
            profile = await SeniorProfile.findOne({ user: user._id });
        } else if (user.role === 'junior') {
            // Assuming JuniorProfile exists, though I didn't import it. 
            // For now, return basic user info if junior profile not critical yet
            // or import it.
            const JuniorProfile = require('../models/JuniorProfile');
            profile = await JuniorProfile.findOne({ user: user._id });
        }

        res.json({ ...user.toObject(), profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
