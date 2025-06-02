const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true, // allow nulls for non-google users
  },
  email: {
    type: String,
    required: function() {
      return !this.googleId;  // required if no googleId
    },
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;  // required if no googleId (i.e. normal signup)
    },
  },
  name: String,
});

module.exports = mongoose.model('User', userSchema);
