const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  role: {
    type: String,
    enum: ['admin','common'],
    default: 'common'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
});
