const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// @route   GET /api/posts
// @desc    Get all posts (public)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username email')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'server error while fetching the posts' });
    }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const foundPost = await Post.findById(req.params.id).populate('author', 'username email');
        if (!foundPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(foundPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error while fetching individual post" });
    }
});

// @route   POST /api/posts
// @desc    Create a new post (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "title or content is required" });
        }

        const newPost = new Post({
            title,
            content, 
            tags: typeof tags === 'string' && tags.trim() !== '' 
                ? tags.split(',').map(tag => tag.trim()) 
                : [],
            author: req.user.userId
        });

        // Save to database and send response!
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error while creating a post" });
    }
});

module.exports = router;