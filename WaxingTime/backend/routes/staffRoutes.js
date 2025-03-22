const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// Staff management endpoints
router.get('/', staffController.getAllStaff);
router.post('/', staffController.addStaff);
router.put('/:id', staffController.updateStaff);
router.put('/:id/schedule', staffController.updateSchedule);
router.get('/:id/performance', staffController.getStaffPerformance);

module.exports = router;