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

//get charity by id
router.get('/:id', verifyToken, charityController.getCharities);


module.exports = router;
