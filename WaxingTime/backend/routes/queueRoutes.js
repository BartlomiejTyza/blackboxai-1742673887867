const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

// Endpoints
router.post('/join', queueController.joinQueue);
router.get('/', queueController.getQueueStatus);
router.put('/toggle', queueController.toggleQueue);
router.put('/:queueId/status', queueController.updateQueueStatus);

module.exports = router;