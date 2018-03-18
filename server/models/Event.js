const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Event = new Schema({
    title: String,
    action: String,
    date: {
      type: Date,
      default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    card: {
        type: Schema.Types.ObjectId,
        ref: 'boards'
    }
 });

module.exports = mongoose.model('events', Event);
