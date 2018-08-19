const mongoose = require('mongoose');

const Invite = new mongoose.Schema({
  email: {
  	type: String,
  	unique: true
  },
  createdAt: {
  	type: Date,
  	default: Date.now
  }
});

module.exports = mongoose.model('invites', Invite);
