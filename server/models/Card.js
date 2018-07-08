const mongoose = require('mongoose');
const Users = require('./users.js');
const Notes = require('./note.js');
const Schema = mongoose.Schema;

const Card = new Schema({
  title: String,
  board: {
    type: Schema.Types.ObjectId,
    ref: 'boards'
  },
  tables: [{
    type: Schema.Types.ObjectId,
    ref: 'tables'
  }],
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'lists'
  }],
  notes: [Notes],
  tags: [{
    _id: Schema.Types.ObjectId
  }],
  users: [Users],
  updatedAt: {
    type: Date,
    default: Date.now
  }
 });

 Card.methods.findRole = function(userId) {
   let user = this.users.find(u => {
     if(u.user)
       return (u.user._id || u.user).toString() === userId.toString();
   })
   if (user)
     this.set('userRole', user.role, { strict: false });
   else
     throw new Error('Forbidden')
 }

module.exports = mongoose.model('cards', Card);
