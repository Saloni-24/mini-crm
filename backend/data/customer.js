const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the customer name."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
