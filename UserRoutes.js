const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const User = require('../models/User'); 
const authMiddleware = require('../middleware/authMiddleware');

router.post("/signup", registerUser);
router.post("/login", loginUser);

// GET /api/user/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      email: user.email,
      name: user.userName,
      phone: user.phone,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
