const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rules: { type: Object, required: true },  
  message: { type: String, required: true },
  audienceSize: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['PENDING', 'SENT'], 
    default: 'PENDING' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Campaign', campaignSchema);
