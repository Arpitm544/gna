const { body } = require('express-validator');

// Order validation
exports.validateOrder = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
  body('prepTime').isInt({ min: 0 }).withMessage('Prep time must be a positive number'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number')
];

// Auth validation
exports.validateRegistration = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('role').isIn(['RESTAURANT_MANAGER', 'DELIVERY_PARTNER', 'CUSTOMER']).withMessage('Invalid role')
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
]; 