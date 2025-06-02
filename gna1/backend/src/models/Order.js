const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
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
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  customerDetails: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'ON_ROUTE', 'DELIVERED'],
    default: 'PREPARING'
  },
  prepTime: {
    type: Number,
    required: true,
    min: 0
  },
  assignedDeliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedAt: {
    type: Date,
    default: null
  },
  estimatedDeliveryTime: {
    type: Date,
    default: null
  },
  actualDeliveryTime: {
    type: Date,
    default: null
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

// Update the updatedAt timestamp before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD${year}${month}${day}${random}`;
  }
  next();
});

// Validate status transitions
orderSchema.methods.updateStatus = function(newStatus) {
  const validTransitions = {
    'PREPARING': ['READY_FOR_PICKUP'],
    'READY_FOR_PICKUP': ['PICKED_UP'],
    'PICKED_UP': ['ON_ROUTE'],
    'ON_ROUTE': ['DELIVERED'],
    'DELIVERED': []
  };

  if (!validTransitions[this.status].includes(newStatus)) {
    throw new Error(`Invalid status transition from ${this.status} to ${newStatus}`);
  }

  this.status = newStatus;
  if (newStatus === 'DELIVERED') {
    this.actualDeliveryTime = new Date();
  }
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 