const Order = require('../models/Order');

const generateOrderId = () => {
  const d = new Date();
  return `ORD${d.getFullYear().toString().slice(-2)}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}${d.getHours().toString().padStart(2, '0')}${d.getMinutes().toString().padStart(2, '0')}${d.getSeconds().toString().padStart(2, '0')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
};

exports.createOrder = async (req, res) => {
  try {
    const { customerName, deliveryAddress, prepTime, items, totalAmount } = req.body;

    if (!customerName || !deliveryAddress || !prepTime || !items || !totalAmount || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    for (const item of items) {
      if (!item.name || !item.quantity || !item.price || item.quantity < 1 || item.price < 0) {
        return res.status(400).json({ message: 'Invalid item data' });
      }
    }

    const order = new Order({
      orderId: generateOrderId(),
      customerName,
      deliveryAddress,
      prepTime,
      items,
      totalAmount,
      status: 'PENDING'
    });

    const savedOrder = await order.save();
    req.app.get('io').emit('newOrder', savedOrder);
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Create order error:', err);
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    if (err.code === 11000) return res.status(400).json({ message: 'Order ID already exists. Please try again.' });
    res.status(500).json({ message: 'Error creating order' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Fetch order error:', err);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status;
    await order.save();

    req.app.get('io').emit('orderStatusUpdated', order);
    res.json(order);
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

exports.assignDeliveryPartner = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.deliveryPartner = req.body.deliveryPartnerId;
    order.status = 'ASSIGNED';
    await order.save();

    req.app.get('io').emit('orderAssigned', order);
    res.json(order);
  } catch (err) {
    console.error('Assign delivery error:', err);
    res.status(500).json({ message: 'Error assigning delivery partner' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only allow deletion of completed orders
    if (order.status !== 'DELIVERED') {
      return res.status(400).json({ message: 'Only completed orders can be deleted' });
    }

    await Order.findByIdAndDelete(req.params.orderId);
    req.app.get('io').emit('orderDeleted', { orderId: req.params.orderId });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ message: 'Error deleting order' });
  }
};