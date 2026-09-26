const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        // try
        const posts = await Post.find()
            .populate('author', 'username email')
            .sort({ createdAt: -1});
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'server error while fetching the posts'});
    }
});

router.get('/:id', async (req, res) => {
    try {
        // try
        const Post = await Post.findById(req.params.id).populate('author', 'username email');
        if (!Post) {
            return res.status(404).json({ message: "Post not found"});
        }
        res.json(Post);
    } catch (err) {
        // catch
        console.error(err);
        res.status(500).json({ message: "server error while fetching individual post"});
    }
});

router.post('/', auth, async (req, res) => {
    try {
        // try
        const { title, content, tags} = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "title or content is required"});
        }

        const newPost = new Post({
            title,
            content, 
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            author: req.user.userId
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "server error while creating a post" });
    }
});

module.exports = router;