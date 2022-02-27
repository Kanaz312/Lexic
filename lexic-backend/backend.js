const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var fs = require("fs");

// read in allowlist
const allowedWords = fs.readFileSync('./allowed_words.txt', 'utf-8');
const textByLine = allowedWords.split('\n');
// create a reference object where every element in allowlist is placed in object allow_ref with a value of 1
// allow_ref['abacus'] = 1
// allow_ref['not_int_list'] = undefined
const allow_ref = textByLine.reduce(function(obj, v) {
  obj[v] = 1;
  return obj;
}, {});

async function isValidWord(word) {
  return allow_ref[word] === 1;
}

// Add mongdb user services
const userServices = require("./models/user-services");

const app = express();
const port = 1000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/guess/:word", async (req, res) => {
  const word = req.params["word"];
  let result = await isValidWord(word);
    result = { wordValidity: result };
    res.send(result);
});

app.get("/users", async (req, res) => {
  //res.send(users); //HTTP code 200 is set by default. See an alternative below
  //res.status(200).send(users);
  const name = req.query["name"];
  const job = req.query["job"];
  if (name === undefined && job === undefined) {
    try {
      const users_from_db = await userServices.getUsers();
      console.log(users_from_db);
      res.send({ users_list: users_from_db });
    } catch (error) {
      console.log("Mongoose error: " + error);
      res.status(500).send("An error ocurred in the server.");
    }
  } else if (name && job === undefined) {
    console.log("in name");
    let result = await userServices.findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else if (job && name === undefined) {
    let result = await userServices.findUserByJob(job);
    result = { users_list: result };
    res.send(result);
  } else {
    let result = await userServices.findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  }
});

// async function findUserByName(name) {
//   return await userModel.find({ name: name });
// }

// async function findUserByJob(job) {
//   return await userModel.find({ job: job });
// }

// async function findUserByNameAndJob(name, job) {
//   return await userModel.find({ name: name, job: job });
// }

app.get("/users/:id", async (req, res) => {
  const id = req.params["id"];
  let result = await userServices.findUserById(id);
  if (result === undefined || result === null)
    res.status(404).send("Resource not found.");
  else {
    result = { users_list: result };
    res.send(result);
  }
});

async function findUserById(id) {
  try {
    return await userModel.findById(id);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

app.delete("/users/:id", async (req, res) => {
  const id = req.params["id"];
  if (deleteUserById(id)) res.status(204).end();
  else res.status(404).send("Resource not found.");
});

async function deleteUserById(id) {
  try {
    if (await userServices.deleteUser(id)) return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

app.post("/users", async (req, res) => {
  const user = req.body;
  if (await userServices.addUser(user)) res.status(201).end();
  else res.status(500).end();
});

app.patch("/users/:id", async (req, res) => {
  const id = req.params["id"];
  const updatedUser = req.body;
  const result = await updateUser(id, updatedUser);
  if (result === 204) res.status(204).end();
  else if (result === 404) res.status(404).send("Resource not found.");
  else if (result === 500)
    res.status(500).send("An error ocurred in the server.");
});

async function updateUser(id, updatedUser) {
  try {
    const result = await userModel.findByIdAndUpdate(id, updatedUser);
    if (result) return 204;
    else return 404;
  } catch (error) {
    console.log(error);
    return 500;
  }
}

app.listen(process.env.PORT || port, () => {
    console.log("REST API is listening.");
  });
