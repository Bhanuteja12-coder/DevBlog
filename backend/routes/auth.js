const express = require("express");
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route POST /api/auth/register
// @desc  Register a new user

router.post('/register', async (req, res) => {
    try {
        const { username, email, password} = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists with this email"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        
        res.status(201).json({ message: "User registed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'server error during registration'});

    }
});

router.post('/login', async(req, res) => {
    try {
        // try
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials "});
        }

        const payload = {
            userId: user._id,
            role: user.role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error during login "});
    }
});

module.exports = router;