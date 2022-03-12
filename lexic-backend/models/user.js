const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  uid: {
    type: String,
    required: false,
    trim: false,
  },
  password: {
    type: String,
    required: false,
    trim: true,
  },
  coins: {
    type: Number,
    required: false,
  },
  wins: {
    type: Number,
    required: false,
  },
  losses: {
    type: Number,
    required: false,
  },
  friends: {
    type: [String],
    default: undefined,
    required: false,
  },

}, { collection: 'users' });

UserSchema.statics.deleteByUsername = function deleteByUsername(username) {
  return this.deleteOne({ username });
};
const User = mongoose.model('User', UserSchema);

module.exports = User;
