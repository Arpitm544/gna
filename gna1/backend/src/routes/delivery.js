const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const deliveryController = require('../controllers/deliveryController');

// Delivery routes
router.get('/', auth, checkRole('RESTAURANT_MANAGER'), deliveryController.getAllDeliveryPartners);
router.get('/available', auth, checkRole('RESTAURANT_MANAGER'), deliveryController.getAvailableDeliveryPartners);
router.get('/:deliveryPartnerId/orders', auth, deliveryController.getAssignedOrders);
router.get('/:deliveryPartnerId/completed', auth, deliveryController.getCompletedOrders);
router.patch('/:deliveryPartnerId/availability', auth, checkRole('DELIVERY_PARTNER'), deliveryController.updateAvailability);
router.get('/:deliveryPartnerId/stats', auth, deliveryController.getPerformanceStats);

module.exports = router;