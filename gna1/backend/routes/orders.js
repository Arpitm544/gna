const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');

// Validation middleware
const validateOrder = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('customerDetails.name').notEmpty().withMessage('Customer name is required'),
  body('customerDetails.phone').notEmpty().withMessage('Customer phone is required'),
  body('customerDetails.address').notEmpty().withMessage('Customer address is required'),
  body('prepTime').isInt({ min: 0 }).withMessage('Prep time must be a positive number')
];

// Create new order (Restaurant Manager only)
router.post('/', auth, checkRole(['RESTAURANT_MANAGER']), validateOrder, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = new Order(req.body);
    await order.save();

    // Emit socket event for new order
    req.app.get('io').emit('newOrder', order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get all orders (Restaurant Manager only)
router.get('/', auth, checkRole(['RESTAURANT_MANAGER']), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('assignedDeliveryPartner', 'name phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('assignedDeliveryPartner', 'name phone');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has permission to view this order
    if (req.user.role === 'DELIVERY_PARTNER' && 
        order.assignedDeliveryPartner?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Assign delivery partner to order (Restaurant Manager only)
router.post('/:id/assign', auth, checkRole(['RESTAURANT_MANAGER']), async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;
    
    if (!deliveryPartnerId) {
      return res.status(400).json({ message: 'Delivery partner ID is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.assignedDeliveryPartner) {
      return res.status(409).json({ message: 'Order already has a delivery partner' });
    }

    const deliveryPartner = await User.findOne({
      _id: deliveryPartnerId,
      role: 'DELIVERY_PARTNER',
      isActive: true
    });

    if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    // Check if delivery partner already has active orders
    const activeOrders = await Order.countDocuments({
      assignedDeliveryPartner: deliveryPartnerId,
      status: { $in: ['PICKED_UP', 'ON_ROUTE'] }
    });

    if (activeOrders >= 3) {
      return res.status(400).json({ message: 'Delivery partner has reached maximum active orders' });
    }

    order.assignedDeliveryPartner = deliveryPartnerId;
    order.assignedAt = new Date();
    order.status = 'READY_FOR_PICKUP';
    await order.save();

    // Emit socket event for order assignment
    req.app.get('io').emit('orderAssigned', {
      orderId: order._id,
      deliveryPartnerId: deliveryPartnerId
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning delivery partner', error: error.message });
  }
});

// Update order status (Delivery Partner only)
router.put('/:id/status', auth, checkRole(['DELIVERY_PARTNER']), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.assignedDeliveryPartner?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    try {
      order.updateStatus(status);
      await order.save();

      // Emit socket event for status update
      req.app.get('io').emit('orderStatusUpdated', {
        orderId: order._id,
        status: order.status
      });

      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

module.exports = router; 