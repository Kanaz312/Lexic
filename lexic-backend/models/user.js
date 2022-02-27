const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true,
    },
    coins: {
      type: Number,
      required: true,
    },
    winLossRatio: {
      type: Number,
      required: true,
    },
    friends: {
        type: [UserSchema],
        default: undefined,
    },
  
  }, {collection : 'users'});
  

const User = mongoose.model("User", UserSchema);

module.exports = User;