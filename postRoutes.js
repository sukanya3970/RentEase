const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/posts - Create a new post
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { price, category, description, location, email, contact } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }

    if (!price || !category || !description || !location || !email || !contact) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // ✅ Store relative URLs instead of full file paths
    const imagePaths = req.files.map(file => `uploads/${file.filename}`);

    const newPost = new Post({
      user: req.user.id,
      images: imagePaths,
      price,
      category,
      description,
      location,
      contact,
      email
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// GET /api/posts - Fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'userName email');
    res.status(200).json(posts);
  } catch (err) {
    console.error('Fetch posts error:', err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// GET /api/posts/category/:category - Fetch posts by category
router.get('/category/:category', async (req, res) => {
  try {
    const posts = await Post.find({ category: req.params.category });
    res.json(posts);
  } catch (err) {
    console.error('Fetch posts by category error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/posts/:id - Fetch a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'userName email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    console.error('Fetch post by ID error:', err);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

// Get posts by user email
router.get('/user/:email', async (req, res) => {
  try {
    const posts = await Post.find({ email: req.params.email });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a post by ID (only for authenticated users)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});



module.exports = router;
