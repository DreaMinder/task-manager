const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Task = new Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['', 'snooze','working','done','not_done','waiting']
  },
  table: {
    type: Schema.Types.ObjectId,
    ref: 'table'
  },
  descr: String,
  start: Date,
  finish: Date,
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  subscribers: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
});

module.exports = mongoose.model('tasks', Task);
