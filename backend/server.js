const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// Test Route
app.get('/', (req, res) => {
    res.json({message: "DevBlog API is running..."});
});

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Database connection and server start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/DevBlog";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("connected to MongoDB");
        app.listen(PORT, () => console.log(`server running on port ${PORT}`));
    })
    .catch((err) => console.error("database connection error:", err));