const express = require('express');
const router = express.Router();
const customerHandlers = require('../handlers/customerHandlers');
const { protect } = require('../middleware/authMiddleware'); // Importing protect middleware

// Naye customer add karne ke liye
router.post('/', protect, customerHandlers.addCustomer);

// Sab customers laane ke liye
router.get('/', protect, customerHandlers.getCustomers);

module.exports = router;
