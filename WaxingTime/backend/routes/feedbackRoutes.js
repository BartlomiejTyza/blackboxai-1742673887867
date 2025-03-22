const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Feedback endpoints
router.post('/', feedbackController.submitFeedback);
router.get('/', feedbackController.getFeedback);
router.get('/stats', feedbackController.getFeedbackStats);

module.exports = router;