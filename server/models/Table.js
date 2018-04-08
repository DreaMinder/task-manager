const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Table = new Schema({
  title: String,
  card: {
      type: ObjectId,
      ref: 'cards'
  },
  tasks: [{
      type: ObjectId,
      ref: 'tasks'
  }]
});

Table.pre('findOneAndUpdate', function(next) {
 this.update({}, { $inc: { __v: 1 } });
 next()
});

module.exports = mongoose.model('tables', Table);
