const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
  title: String,
  cards: [{
  	type: Schema.Types.ObjectId,
    ref: 'cards'
	}]
 });
