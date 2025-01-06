const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Create Razorpay order for donation
router.post('/create-order', verifyToken, donationController.createDonationOrder);

// Verify and complete donation after Razorpay payment
router.post('/verify', verifyToken, donationController.verifyDonation);

// Get donation history
router.get('/history', verifyToken, donationController.getDonationHistory);

// Get donation receipt
router.get('/receipt/:id', verifyToken, donationController.getDonationReceipt);

module.exports = router;
