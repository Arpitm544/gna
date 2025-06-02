const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  customerName: {
    type: String,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  prepTime: {
    type: Number, // in minutes
    required: true,
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [120, 'Preparation time cannot exceed 120 minutes']
  },
  dispatchTime: {
    type: Date
  },
  eta: {
    type: Number, // in minutes
    default: 30 // default ETA of 30 minutes
  },
  status: {
    type: String,
    enum: ['PENDING', 'PREPARING', 'READY', 'ASSIGNED', 'PICKED_UP', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate orderId before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderId = `ORD${year}${month}${day}${random}`;
  }

  // Calculate dispatch time if prepTime and eta are available
  if (this.prepTime && this.eta) {
    const dispatchTime = new Date();
    dispatchTime.setMinutes(dispatchTime.getMinutes() + this.prepTime + this.eta);
    this.dispatchTime = dispatchTime;
  }

  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema); 