const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const impactController = require('../controllers/impact.controller');

// Create impact report for a charity
router.post('/charities/:charityId/reports', verifyToken, impactController.createImpactReport);

// Get all impact reports for a charity
router.get('/charities/:charityId/reports', impactController.getCharityImpactReports);

// Update impact report
router.put('/reports/:reportId', verifyToken, impactController.updateImpactReport);

// Delete impact report
router.delete('/reports/:reportId', verifyToken, impactController.deleteImpactReport);

module.exports = router;
