const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Inventory management endpoints
router.get('/', inventoryController.getInventory);
router.post('/', inventoryController.addProduct);
router.put('/:id', inventoryController.updateStock);
router.get('/low-stock', inventoryController.getLowStockAlerts);

module.exports = router;