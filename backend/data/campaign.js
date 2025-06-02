const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  field: {
    type: String,
    enum: ['spend', 'visits'],
    required: true
  },
  operator: {
    type: String,
    enum: ['>', '<', '>=', '<=', '==', '!='],
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { _id: false }); // prevent automatic _id for rules

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rules: {
    type: [ruleSchema], // 👈 Now an array of rule objects
    required: true
  },
  logic: {
    type: String,
    enum: ['AND', 'OR'],
    default: 'AND'
  },
  message: { type: String, required: true },
  audienceSize: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['CREATED', 'PENDING', 'SENT'],
    default: 'PENDING'
  },
  sent: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  deliveredAt: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Campaign', campaignSchema);
