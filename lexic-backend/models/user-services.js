const mongoose = require("mongoose");
const userModel = require("./user");
const dotenv = require("dotenv");

dotenv.config();

// Uncomment the following to debug mongoose queries, etc.
// mongoose.set("debug", true);

mongoose
  .connect(
    "mongodb+srv://" +
     process.env.MONGO_USER +
     ":" +
     process.env.MONGO_PWD +
     "@ourcluster.mr5hf.mongodb.net/" +
     process.env.MONGO_DB +
      "?retryWrites=true&w=majority",
    // "mongodb://localhost:27017/users",
    //"mongodb+srv://lexic:calpolylexic@ourcluster.mr5hf.mongodb.net/Lexic?retryWrites=true&w=majority",
    {
      useNewUrlParser: true, //useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .catch((error) => console.log(error));

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
  try {
    return await userModel.findById(id);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addUser(user) {
  try {
    const userToAdd = new userModel(user);
    userToAdd.coins = 500;
    userToAdd.winLossRatio = 0;
    userToAdd.friends = [""];
    const savedUser = await userToAdd.save();
    return savedUser;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function findUserByUsername(username) {
  return await userModel.find({ username: username });
}

async function deleteUser(id) {
  return await userModel.deleteByUsername(id);
}

exports.getUsers = getUsers;
exports.findUserById = findUserById;
exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.findUserByUsername = findUserByUsername;