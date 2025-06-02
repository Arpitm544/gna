const User = require('../models/User');
const Order = require('../models/Order');

const getAllDeliveryPartners = async (req, res) => {
  try {
    const partners = await User.find({ role: 'DELIVERY_PARTNER' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch delivery partners' });
  }
};

const getAvailableDeliveryPartners = async (req, res) => {
  try {
    const partners = await User.find({ role: 'DELIVERY_PARTNER', isAvailable: true }).select('-password');
    const result = await Promise.all(partners.map(async (p) => {
      const orders = await Order.countDocuments({
        deliveryPartner: p._id,
        status: { $in: ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'] }
      });
      return { ...p.toObject(), activeOrders: orders };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch available partners' });
  }
};

const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.params.deliveryPartnerId,
      status: { $in: ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'] }
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assigned orders' });
  }
};

const getCompletedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.params.deliveryPartnerId,
      status: 'DELIVERED'
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch completed orders' });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const partner = await User.findById(req.params.deliveryPartnerId);

    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    if (partner.role !== 'DELIVERY_PARTNER') return res.status(403).json({ message: 'Not a delivery partner' });

    partner.isAvailable = isAvailable;
    await partner.save();
    res.json(partner);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update availability' });
  }
};

const getPerformanceStats = async (req, res) => {
  try {
    const id = req.params.deliveryPartnerId;
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [stats] = await Order.aggregate([
      { $match: { deliveryPartner: id, status: 'DELIVERED', createdAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalEarnings: { $sum: '$deliveryFee' },
          averageDeliveryTime: { $avg: { $subtract: ['$deliveredAt', '$assignedAt'] } }
        }
      }
    ]);

    const result = stats || { totalOrders: 0, totalEarnings: 0, averageDeliveryTime: 0 };
    const onTime = await Order.countDocuments({
      deliveryPartner: id,
      status: 'DELIVERED',
      createdAt: { $gte: since },
      $expr: { $lte: ['$deliveredAt', '$estimatedDeliveryTime'] }
    });

    result.onTimeDeliveryPercentage = result.totalOrders ? (onTime / result.totalOrders) * 100 : 0;

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch performance stats' });
  }
};

module.exports = {
  getAllDeliveryPartners,
  getAvailableDeliveryPartners,
  getAssignedOrders,
  getCompletedOrders,
  updateAvailability,
  getPerformanceStats
};