const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const List = new Schema({
  title: String,
  card: {
    type: Schema.Types.ObjectId,
    ref: 'cards'
  },
  tasks: [{
  	title: String,
  	done: Boolean
  }]
 });

 List.pre('findOneAndUpdate', function(next) {
   this.update({}, { $inc: { __v: 1 } });
   next()
 });

module.exports = mongoose.model('lists', List);
