const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JuniorProfile = require('../models/JuniorProfile');
const SeniorProfile = require('../models/SeniorProfile');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const {
        name, email, password, role, college, department, year, mobile,
        // Senior specific
        passingYear, currentPosition, linkedin, guidanceDomains,
        // Junior specific
        interests, goals
    } = req.body;



    console.log("REGISTER ATTEMPT:", { email, role });

    try {
        console.log("Checking if user exists...");
        const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name, email, password, role, college, department, year, mobile
        });

        if (user) {
            // Create Profile based on Role
            if (role === 'senior') {
                await SeniorProfile.create({
                    user: user._id,
                    passingYear,
                    currentPosition,
                    linkedin,
                    guidanceDomains
                });
            } else if (role === 'junior') {
                await JuniorProfile.create({
                    user: user._id,
                    interests,
                    goals
                });
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("REGISTRATION ERROR:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User with this email or mobile already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
