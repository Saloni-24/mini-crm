const express = require('express');
const router = express.Router();

const { updateDeliveryStatus, sendTestDelivery } = require('../handlers/deliveryReceiptHandler');

router.post('/delivery-receipt', updateDeliveryStatus);
router.get('/test-delivery', sendTestDelivery);

module.exports = router;
