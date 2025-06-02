const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');

// Get all delivery partners (Restaurant Manager only)
router.get('/', auth, checkRole(['RESTAURANT_MANAGER']), async (req, res) => {
  try {
    const deliveryPartners = await User.find({
      role: 'DELIVERY_PARTNER',
      isActive: true
    }).select('-password');

    // Get active orders count for each delivery partner
    const partnersWithOrders = await Promise.all(
      deliveryPartners.map(async (partner) => {
        const activeOrders = await Order.countDocuments({
          assignedDeliveryPartner: partner._id,
          status: { $in: ['PICKED_UP', 'ON_ROUTE'] }
        });

        return {
          ...partner.toObject(),
          activeOrders
        };
      })
    );

    res.json(partnersWithOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching delivery partners', error: error.message });
  }
});

// Get delivery partner's assigned orders
router.get('/:id/orders', auth, async (req, res) => {
  try {
    // Check if user is requesting their own orders or is a restaurant manager
    if (req.user.role === 'DELIVERY_PARTNER' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({
      assignedDeliveryPartner: req.params.id
    })
    .sort({ createdAt: -1 })
    .populate('assignedDeliveryPartner', 'name phone');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get delivery partner's active orders
router.get('/:id/active-orders', auth, async (req, res) => {
  try {
    // Check if user is requesting their own orders or is a restaurant manager
    if (req.user.role === 'DELIVERY_PARTNER' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({
      assignedDeliveryPartner: req.params.id,
      status: { $in: ['PICKED_UP', 'ON_ROUTE'] }
    })
    .sort({ createdAt: -1 })
    .populate('assignedDeliveryPartner', 'name phone');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active orders', error: error.message });
  }
});

// Get delivery partner's completed orders
router.get('/:id/completed-orders', auth, async (req, res) => {
  try {
    // Check if user is requesting their own orders or is a restaurant manager
    if (req.user.role === 'DELIVERY_PARTNER' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({
      assignedDeliveryPartner: req.params.id,
      status: 'DELIVERED'
    })
    .sort({ createdAt: -1 })
    .populate('assignedDeliveryPartner', 'name phone');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching completed orders', error: error.message });
  }
});

// Get delivery partner's statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    // Check if user is requesting their own stats or is a restaurant manager
    if (req.user.role === 'DELIVERY_PARTNER' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const [
      totalOrders,
      completedOrders,
      activeOrders,
      averageDeliveryTime
    ] = await Promise.all([
      Order.countDocuments({ assignedDeliveryPartner: req.params.id }),
      Order.countDocuments({
        assignedDeliveryPartner: req.params.id,
        status: 'DELIVERED'
      }),
      Order.countDocuments({
        assignedDeliveryPartner: req.params.id,
        status: { $in: ['PICKED_UP', 'ON_ROUTE'] }
      }),
      Order.aggregate([
        {
          $match: {
            assignedDeliveryPartner: req.params.id,
            status: 'DELIVERED',
            actualDeliveryTime: { $exists: true }
          }
        },
        {
          $group: {
            _id: null,
            avgTime: {
              $avg: {
                $subtract: ['$actualDeliveryTime', '$assignedAt']
              }
            }
          }
        }
      ])
    ]);

    res.json({
      totalOrders,
      completedOrders,
      activeOrders,
      averageDeliveryTime: averageDeliveryTime[0]?.avgTime || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router; 