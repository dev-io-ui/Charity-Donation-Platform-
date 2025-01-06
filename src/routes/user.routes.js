const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// Get user profile
router.get('/profile', verifyToken, userController.getProfile);

// Update user profile
router.put('/profile', verifyToken, userController.updateProfile);

module.exports = router;
