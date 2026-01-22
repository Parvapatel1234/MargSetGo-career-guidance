const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Message = require('../models/Message');
const User = require('../models/User');

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', protect, async (req, res) => {
    const { recipientId, content } = req.body;

    try {
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        const message = await Message.create({
            sender: req.user._id,
            recipient: recipientId,
            content
        });

        // Populate sender details for immediate UI update
        await message.populate('sender', 'name');
        await message.populate('recipient', 'name');

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/messages/:userId
// @desc    Get conversation with a specific user
// @access  Private
router.get('/:userId', protect, async (req, res) => {
    const otherUserId = req.params.userId;

    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, recipient: otherUserId },
                { sender: otherUserId, recipient: req.user._id }
            ]
        })
            .sort({ createdAt: 1 }) // Oldest first
            .populate('sender', 'name')
            .populate('recipient', 'name');

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
