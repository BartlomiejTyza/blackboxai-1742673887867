const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Report endpoints
router.get('/revenue', reportController.getRevenueReport);
router.get('/popular-services', reportController.getPopularServices);
router.get('/team-efficiency', reportController.getTeamEfficiency);
router.get('/summary', reportController.getDashboardSummary);
router.post('/custom', reportController.getCustomReport);

module.exports = router;