const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');

// Loyalty program endpoints
router.get('/:clientId', loyaltyController.getLoyaltyPoints);
router.post('/earn', loyaltyController.earnLoyaltyPoints);
router.post('/redeem', loyaltyController.redeemPoints);
router.get('/:clientId/history', loyaltyController.getLoyaltyHistory);

module.exports = router;