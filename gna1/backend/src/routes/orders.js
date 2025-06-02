const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// @route   GET api/orders
// @desc    Get all orders for restaurant manager
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'RESTAURANT_MANAGER') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (req.user.role === 'RESTAURANT_MANAGER' || 
        (req.user.role === 'DELIVERY_PARTNER' && order.deliveryPartner === req.user.id)) {
      res.json(order);
    } else {
      res.status(403).json({ message: 'Not authorized' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { items, customerName, deliveryAddress } = req.body;

    const order = new Order({
      items,
      customerName,
      deliveryAddress,
      status: 'PENDING'
    });

    await order.save();

    // Emit new order event to restaurant room
    req.app.get('io').to('restaurant').emit('newOrder', order);

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to update this order
    if (req.user.role === 'RESTAURANT_MANAGER') {
      order.status = status;
      await order.save();

      // Emit order status update event
      req.app.get('io').to('restaurant').emit('orderStatusUpdated', { orderId: order._id });
      if (order.deliveryPartner) {
        req.app.get('io').to('delivery').emit('orderStatusUpdated', { orderId: order._id });
      }

      res.json(order);
    } else {
      res.status(403).json({ message: 'Not authorized' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/orders/:id/assign
// @desc    Assign order to delivery partner
// @access  Private
router.put('/:id/assign', auth, async (req, res) => {
  try {
    if (req.user.role !== 'RESTAURANT_MANAGER') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { deliveryPartnerId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.deliveryPartner = deliveryPartnerId;
    order.status = 'ASSIGNED';
    await order.save();

    // Emit order assigned event
    req.app.get('io').to('restaurant').emit('orderAssigned', { orderId: order._id });
    req.app.get('io').to('delivery').emit('orderAssigned', { orderId: order._id });

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 