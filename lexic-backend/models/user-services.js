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
    // default userModel
    const userToAdd = new userModel(user);
    // add all of the qualifications here
    // userToadd.coins = 500
    // adds to DB
    const savedUser = await userToAdd.save();
    return savedUser;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function createUser(name, uid) {
  user = {
    username: "",
    coins: "",
    //id: "",
 };
  try {
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


async function findUserByUid(uid) {
  return await userModel.findOne({ uid: uid });
}

async function findUserByJob(job) {
  return await userModel.find({ job: job });
}
async function deleteUser(id) {
  return await userModel.deleteByUsername(id);

}

async function setCoins(username,value) {
  return await userModel.findOneAndUpdate({username: username},{coins: value});
}

async function updateCoins(username,value) {
  const temp = await userModel.find({ username: username });
  const newValue = temp[0].coins + value;
  return await userModel.findOneAndUpdate({username: username},{coins: newValue});
}

// given a uid and a boolean win - updates the number of games won / lost as well as coins for a user with the uid
async function win(uid, win) {
  const value = 50;
  const temp = await findUserByUid(uid);
  console.log("TEMP IS:", temp)
  var newCoins = temp.coins;
  var newWins = temp.wins;
  var newLosses = temp.losses;
  if(win)
  {
    newCoins += value;
    newWins++;
  }
  else
  {
    newCoins -= value;
    newLosses++;
  }
  await userModel.findOneAndUpdate({uid : uid},{coins: newCoins});
  await userModel.findOneAndUpdate({uid: uid},{wins: newWins});
  await userModel.findOneAndUpdate({uid: uid},{losses: newLosses});
  return await userModel.findOne({ uid: uid });
}
exports.getUsers = getUsers;
exports.findUserById = findUserById;
exports.add = addUser;
exports.deleteUser = deleteUser;
exports.findUserByUsername = findUserByUsername;
exports.findUserByUid = findUserByUid;
exports.createUser = createUser;
exports.updateCoins = updateCoins;
exports.setCoins = setCoins;
exports.win = win;
