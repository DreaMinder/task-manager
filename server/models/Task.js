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
    //timeCreated: {type: Date, default: Date.now},
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
  },{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

module.exports = mongoose.model('tasks', Task);
