const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var fs = require("fs");
const jwt = require('jsonwebtoken');

// read in allowlist
const allowedWords = fs.readFileSync('./allowed_words.txt', 'utf-8');
const textByLine = allowedWords.split('\n');
// create a reference object where every element in allowlist is placed in object allow_ref with a value of 1
// allow_ref['abacus'] = 1
// allow_ref['not_int_list'] = undefined
const allow_ref = textByLine.reduce(function(obj, v) {
  obj[v.trim()] = 1;
  return obj;
}, {});

async function isValidWord(word) {
  return allow_ref[word] == 1;
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

var randomProperty = function (obj) {
  var keys = Object.keys(obj);
  return keys[ keys.length * Math.random() << 0];
};

async function getRandomWord() {
  while(true) {
    let cand = randomProperty(allow_ref);
    console.log(cand)
    if (cand.length < 7 && cand.length > 3) {
      return cand;
    }
  }
}

app.get("/word", async (req, res) => {
  const userInfo = await authAndCheckExistence(req);
  if (!userInfo) res.status(403).send('Auth Header is either missing or invalid!');
  res.send(await getRandomWord());
});

// AUTHENTICATION HERE
app.get("/guess/:word/:name", async (req, res) => {
  console.log('initial req body', req.body);
  console.log('initial headers', req.headers);
  console.log('params', req.params);
  const userInfo = await authAndCheckExistence(req);
  if (!userInfo) res.status(403).send('Auth Header is either missing or invalid!');
  // uuid
  const uuid = userInfo['userUuid'];
  const word = req.params["word"];
  const userName = req.params['name'];
  let result = await isValidWord(word);
  console.log('userinfo:', userInfo);
  console.log('guess received with word, uuid, userName, and result:', word, uuid, userName, result);
  res.send(result);
});

app.get("/users", async (req, res) => {
  //res.send(users); //HTTP code 200 is set by default. See an alternative below
  //res.status(200).send(users);
  const username = req.query["username"];
  if (username === undefined) {
    try {
      const users_from_db = await userServices.getUsers();
      console.log(users_from_db);
      res.send({ users_list: users_from_db });
    } catch (error) {
      console.log("Mongoose error: " + error);
      res.status(500).send("An error ocurred in the server.");
    }
  } else {
    let result = await userServices.findUserByUsername(username);
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

async function findUserByUid(uid) {
    return await userServices.findUserByUid(uid);
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
  //parse user to get username and password (once password is implemented)
  //check username is unique
  //check password is valid (future backlog issue)
  if (await userServices.addUser(user)) res.status(201).end();
  else res.status(500).end();
});

async function addNewUser(name, uid) {
  await userServices.createUser(name, uid);
}

app.patch("/users/:id", async (req, res) => {
  const id = req.params["id"];
  const updatedUser = req.body;
  const result = await updateUser(id, updatedUser);
  if (result === 204) res.status(204).end();
  else if (result === 404) res.status(404).send("Resource not found.");
  else if (result === 500)
    res.status(500).send("An error ocurred in the server.");
});

// PATCH
app.patch("/users", async (req, res) => {
  const userInfo = await authAndCheckExistence(req);
  if (!userInfo) res.status(403).send('Auth Header is either missing or invalid!'); 
  const body = req.body;
  // username
  const userName = body['Name'];
  // uuid
  const uuid = userInfo['userUuid'];
  const user = body.user;
  const gameResult = body['win'];
  console.log('patch request received with uuid and userName and result', uuid, userName, gameResult);
  //user.uuid verification
  // win should probably use the uuid and not the username
  const userFound = await userServices.win(uuid, gameResult);
  if (userFound.username === undefined)res.status(404).send("Resource not found."); 
  else res.status(204).end();
});

// authenticates and checks if accounts exists
async function authAndCheckExistence(req) {
  auth = await authenticateToken(req);
  if(!auth) {
    return false;
  }
  await checkAccExists(req.body['Name'], auth['userUuid']);
  return auth;
}

// creates new account if one doesn't exist
async function checkAccExists(name, uid) {
  const accExists = await findUserByUid(uid);
  if (!accExists) {
    console.log('adding new user with name and id', name, uid);
    await addNewUser(name, uid);
    // console.log('added new user');
  }
  // console.log('verified successfully');
}

// given a request, returns the decrypted authentication token
async function authenticateToken(req) {
  const authHeader = req.headers['authorization'];
  // console.log('authentication header is:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  // console.log('token is:', token);
  if (token == null) return false;
  // console.log('\n\nUSERFRONT PUB KEY:', process.env.USERFRONT_PUBLIC_KEY);
  return jwt.verify(token, process.env.USERFRONT_PUBLIC_KEY, (err, auth) => {
    console.log('\nauth is:', auth);
    console.log('error: ', err);    
    if (err) return false;
    return auth;
  });
}

// EXAMPLE
app.post('/test', async (req, res) => {
  // console.log('hit test endpoint');
  const userInfo = await authAndCheckExistence(req);
  // console.log('userID query: ', await findUserByUid('asdl;fkjsldkfjsldkjfs'));
  // console.log('userinfo is: ', userInfo);
  if (!userInfo) {
    res.status(403).send('Auth Header is either missing or invalid!').end();
    return;
  }
  const body = req.body;
  // console.log(userInfo);
  //console.log("FIELD: ", userInfo['name']);
  // console.log("FIELD: ", userInfo['userUuid']);
  // console.log('BODY: ', body);
  res.status(200).send('valid stuff received');
});

app.get('/user-profile', async (req, res) => {
  const userInfo = await authAndCheckExistence(req);
  if (!userInfo) {
    res.status(403).send('Auth Header is either missing or invalid!').end();
    return;
  }
  const uuid = userInfo['userUuid'];
  const user = await findUserByUid(uuid);
  res.status(200).send(user);
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
