const mongoose = require('mongoose');
const Users = require('./users.js')
const Groups = require('./groups.js')
const Schema = mongoose.Schema;

const Board = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    index: {
      unique: true
    }
  },
  tags: [{
    title: String,
    color: {
      type: String,
      default: '#ccc'
    }
  }],
  descr: String,
  image: String,
  users: [Users],
  groups: [Groups]
});

Board.methods.findRole = function(userId) {
  let user = this.users.find(u => {
    if(u.user)
      return (u.user._id || u.user).toString() === userId.toString();
  })
  if(user)
    this.set('userRole', user.role, { strict: false });
  else
    throw new Error('Forbidden')
}

module.exports = mongoose.model('boards', Board);
