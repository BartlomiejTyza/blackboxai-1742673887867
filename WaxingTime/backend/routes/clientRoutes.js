const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Client profile endpoints
router.get('/:id', clientController.getClientProfile);
router.post('/:id/notes', clientController.updateClientNotes);

module.exports = router;