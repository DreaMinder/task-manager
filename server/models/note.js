const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Note = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  content: String,
  date: {
    type: Date,
    default: Date.now
  }
});

Note.add({
  comments: [Note]
}) 

module.exports = Note;
