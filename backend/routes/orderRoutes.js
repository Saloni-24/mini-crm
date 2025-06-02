const express = require('express');
const router = express.Router();

// function relaterd to order
const { addNewOrder, showAllOrders } = require('../handlers/orderHandlers');

// function to check login
const { protect } = require('../middleware/authMiddleware');

// function to add new order
router.post('/', protect, addNewOrder);

// function to show all orders
router.get('/', protect, showAllOrders);

module.exports = router;
