const mongoose = require('mongoose');

const deliveryLogSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failure'],
    default: 'pending',
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  deliveredAt: {
    type: Date,
  },
});

module.exports = mongoose.model('DeliveryLog', deliveryLogSchema);
