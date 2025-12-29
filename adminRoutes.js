const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

// GET /api/admin/users - Get all users with post counts
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    const usersWithPostCount = await Promise.all(users.map(async user => {
      const postCount = await Post.countDocuments({ user: user._id });
      return {
        id: user._id,
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        postCount
      };
    }));

    res.json(usersWithPostCount);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/user/:id - Delete user and their posts
router.delete('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await Post.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User and their posts deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
