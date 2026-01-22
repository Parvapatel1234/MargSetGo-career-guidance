const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User');

// @route   POST /api/requests
// @desc    Send a mentorship request
// @access  Private (Junior only)
router.post('/', protect, async (req, res) => {
    const { seniorId, message } = req.body;

    try {
        if (req.user.role !== 'junior') {
            return res.status(403).json({ message: 'Only juniors can send requests' });
        }

        const senior = await User.findById(seniorId);
        if (!senior || senior.role !== 'senior') {
            return res.status(404).json({ message: 'Senior not found' });
        }

        // Check if request already exists
        const existingRequest = await MentorshipRequest.findOne({
            junior: req.user._id,
            senior: seniorId,
            status: { $in: ['pending', 'accepted'] }
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Request already sent or accepted' });
        }

        const request = await MentorshipRequest.create({
            junior: req.user._id,
            senior: seniorId,
            message
        });

        res.status(201).json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/requests/my-requests
// @desc    Get requests for the logged in user
// @access  Private
router.get('/my-requests', protect, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'senior') {
            query = { senior: req.user._id };
        } else {
            query = { junior: req.user._id };
        }

        const requests = await MentorshipRequest.find(query)
            .populate('junior', 'name email college department mobile')
            .populate('senior', 'name email college department mobile')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/requests/:id
// @desc    Update request status (Accept/Reject)
// @access  Private (Senior only)
router.put('/:id', protect, async (req, res) => {
    const { status } = req.body; // 'accepted' or 'rejected'

    try {
        if (req.user.role !== 'senior') {
            return res.status(403).json({ message: 'Only seniors can respond to requests' });
        }

        const request = await MentorshipRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Ensure the senior owns this request
        if (request.senior.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        request.status = status;
        await request.save();

        res.json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
