/* eslint-disable no-console */
/* eslint-disable new-cap */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const challengeModel = require('./challenge');

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
  )
  .catch((error) => console.log(error));

async function findChallengeByUsernameTo(name) {
  return challengeModel.find({ to: name });
}

async function getChallenges(usernameTo) {
  let result;
  if (usernameTo === undefined) {
    result = await challengeModel.find();
  } else {
    result = await findChallengeByUsernameTo(usernameTo);
  }
  return result;
}

async function findChallengeById(id) {
  try {
    return await challengeModel.findById(id);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addChallenge(challenge) {
  try {
    const challengeToAdd = new challengeModel(challenge);
    const savedChallenge = await challengeToAdd.save();
    return savedChallenge;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// async function findUserByJob(job) {
//   return await userModel.find({ job: job });
// }

// async function findUserByNameAndJob(name, job) {
//   return await userModel.find({ name: name, job: job });
// }

// async function deleteUser(id) {
//   return await userModel.deleteById(id);
// }

exports.getChallenges = getChallenges;
exports.findChallengeById = findChallengeById;
exports.addChallenge = addChallenge;
// exports.deleteUser = deleteUser;
exports.findChallengeByUsernameTo = findChallengeByUsernameTo;
