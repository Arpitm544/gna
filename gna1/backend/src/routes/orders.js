const express = require('express')
const router = express.Router()
const { auth } = require('../middleware/auth')
const { validateOrder } = require('../middleware/validation')
const orderController = require('../controllers/orderController')

router.post('/', auth, validateOrder, orderController.createOrder)
router.get('/', auth, orderController.getOrders)
router.get('/:orderId', auth, orderController.getOrderById)
router.patch('/:orderId/status', auth, orderController.updateOrderStatus)
router.patch('/:orderId/assign', auth, orderController.assignDeliveryPartner)
router.delete('/:orderId', auth, orderController.deleteOrder)

module.exports = router 