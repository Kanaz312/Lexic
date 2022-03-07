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
    },
    coins: {
      type: Number,
      required: false,
    },
    winLossRatio: {
      type: Number,
      required: false,
    },
    friends: {
        type: [String],
        default: undefined,
        required: false,
    }
  
  }, {collection : 'users'});
  

const User = mongoose.model("User", UserSchema);

module.exports = User;