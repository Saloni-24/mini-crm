const DeliveryLog = require('../data/deliveryLog');

const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryLogId, status, timestamp } = req.body;

    const deliveryLog = await DeliveryLog.findById(deliveryLogId);
    if (!deliveryLog) return res.status(404).json({ msg: 'Delivery log not found' });

    deliveryLog.status = status;
    deliveryLog.deliveredAt = timestamp;
    await deliveryLog.save();

    res.status(200).json({ msg: 'Delivery status updated' });
  } catch (error) {
    console.error('updateDeliveryStatus error:', error.message);
    res.status(500).json({ msg: 'Server error updating delivery status' });
  }
};

const sendTestDelivery = (req, res) => {
  res.status(200).json({ msg: 'Test delivery endpoint working!' });
};

module.exports = { updateDeliveryStatus, sendTestDelivery };
