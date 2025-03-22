const express = require('express');
const router = express.Router();
const queueRoutes = require('./queueRoutes');
const clientRoutes = require('./clientRoutes');
const staffRoutes = require('./staffRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const reportRoutes = require('./reportRoutes');
const notificationRoutes = require('./notificationRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const loyaltyRoutes = require('./loyaltyRoutes');

router.use('/queue', queueRoutes);
router.use('/clients', clientRoutes);
router.use('/staff', staffRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/loyalty', loyaltyRoutes);

module.exports = router;