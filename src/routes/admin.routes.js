const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');

// Get all users
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);

// Get all charities (including unapproved)
router.get('/charities', verifyToken, isAdmin, adminController.getAllCharities);

// Approve/reject charity
router.patch('/charities/:id/approve', verifyToken, isAdmin, adminController.approveCharity);

// Get donation statistics
router.get('/donations/stats', verifyToken, isAdmin, adminController.getDonationStats);

module.exports = router;
