/* eslint-disable no-shadow */
/* eslint-disable new-cap */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userModel = require('./user');

dotenv.config();

// Uncomment the following to debug mongoose queries, etc.
// mongoose.set("debug", true);

mongoose
  .connect(
    `mongodb+srv://${
      process.env.MONGO_USER
    }:${
      process.env.MONGO_PWD
    }@ourcluster.mr5hf.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true&w=majority`,
    // "mongodb://localhost:27017/users",
    // "mongodb+srv://lexic:calpolylexic@ourcluster.mr5hf.mongodb.net/Lexic?retryWrites=true&w=majority",
    {
      useNewUrlParser: true, // useFindAndModify: false,
      useUnifiedTopology: true,
    },
  );
// .catch((error) => console.log(error));
async function findUserByUsername(username) {
  return userModel.find({ username });
}

async function findUserByUid(uid) {
  return userModel.findOne({ uid });
}

async function deleteUser(id) {
  return userModel.deleteByUsername(id);
}

async function setCoins(username, value) {
  return userModel.findOneAndUpdate({ username }, { coins: value });
}

async function updateCoins(username, value) {
  const temp = await userModel.find({ username });
  const newValue = temp[0].coins + value;
  return userModel.findOneAndUpdate({ username }, { coins: newValue });
}
async function getUsers(username) {
  let result;
  if (username === undefined) {
    result = await userModel.find();
  } else {
    result = await findUserByUsername(username);
  }
  return result;
}

async function findUserById(id) {
  return userModel.findById(id);
}

async function createUser(name, uid) {
  const user = {
    username: '',
    coins: '',
    // id: "",
  };
  // try {
  // default userModel
  const userToAdd = new userModel(user);
  // add all of the qualifications here
  // userToadd.coins = 500
  // adds to DB
  userToAdd.username = name;
  userToAdd.uid = uid;
  userToAdd.coins = 500;
  userToAdd.wins = 0;
  userToAdd.losses = 0;
  userToAdd.friends = [''];
  const savedUser = await userToAdd.save();
  return savedUser;
  // } catch (error) {
  // console.log(error);
  // return false;
  // }
}

// given a uid and a boolean win - updates the number of games won / lost
// as well as coins for a user with the uid
async function win(uid, win) {
  const value = 50;
  const temp = await findUserByUid(uid);
  // console.log("TEMP IS:", temp)
  let newCoins = temp.coins;
  let newWins = temp.wins;
  let newLosses = temp.losses;
  if (win) {
    newCoins += value;
    newWins += 1;
  } else {
    newCoins -= value;
    newLosses += 1;
  }
  await userModel.findOneAndUpdate({ uid }, { coins: newCoins });
  await userModel.findOneAndUpdate({ uid }, { wins: newWins });
  await userModel.findOneAndUpdate({ uid }, { losses: newLosses });
  return userModel.findOne({ uid });
}
exports.getUsers = getUsers;
exports.findUserById = findUserById;
exports.deleteUser = deleteUser;
exports.findUserByUsername = findUserByUsername;
exports.findUserByUid = findUserByUid;
exports.createUser = createUser;
exports.updateCoins = updateCoins;
exports.setCoins = setCoins;
exports.win = win;
