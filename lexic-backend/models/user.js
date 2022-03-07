const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true,
    },
    uid : {
      type: String,
      required: false,
      trim: false
    password: {
      type: String,
      required: true,
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
    }
  
  }, {collection : 'users'});
  
  UserSchema.statics.deleteById = function(_id) {
    return this.deleteOne({ _id: _id })
  };
  UserSchema.statics.deleteByUsername = function(username) {
    return this.deleteOne({ username: username })
  };
const User = mongoose.model("User", UserSchema);



module.exports = User;