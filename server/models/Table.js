const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Table = new Schema({
  title: String,
  card: {
    type: Schema.Types.ObjectId,
    ref: 'cards'
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'tasks'
  }]
});

Table.pre('findOneAndUpdate', function(next) {
  this.update({}, { $inc: { __v: 1 } });
  next()
});

module.exports = mongoose.model('tables', Table);
