const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const charityController = require('../controllers/charity.controller');

// Get all approved charities
router.get('/', charityController.getAllCharities);

// Register a new charity
router.post('/', verifyToken, charityController.createCharity);

// Update charity details
router.put('/:id', verifyToken, charityController.updateCharity);

// Approve/reject charity (admin only)
router.patch('/:id/approve', verifyToken, isAdmin, charityController.approveCharity);

module.exports = router;
