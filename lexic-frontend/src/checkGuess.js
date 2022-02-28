// List of Statuses
// 0 : Letter is not in the word/ Initial State
// 1 : Letter is in the word, not in right index
// 2 : Letter is in the word, correct index

// return a intial dictionary
function createInitDict(userGuess, challengeWord) {
  const dict = {
    user: userGuess,
    challenge: challengeWord,
    listStatus: [-1, -1, -1, -1, -1],
    challengeStatus: [-1, -1, -1, -1, -1],
  };
  return dict;
}

// helper -- inserts '_' when letter is used
function insertLetter(str, i) {
  return `${str.substring(0, i)}_${str.substring(i + 1)}`;
}

// returns a list of status, reals, on status of correct letters
function handleGuessMatch(dict) {
  const newDict = dict;
  for (let i = 0; i < dict.user.length; i += 1) {
    if (dict.user[i] === dict.challenge[i]) {
      newDict.listStatus.splice(i, 1, 2);
      newDict.challengeStatus.splice(i, 1, 1);
      newDict.user = insertLetter(newDict.user, i);
      console.log(newDict);
    }
  }
  return newDict;
}

// return a list of status,
// reals, on status of letters in word but mismatch indexes
function handleGuessMismatch(dict) {
  const newDict = dict;
  for (let i = 0; i < dict.user.length; i += 1) {
    for (let j = 0; j < dict.challenge.length; j += 1) {
      if ((dict.user[i] === dict.challenge[j]) && (dict.listStatus[i] === -1)
        && (dict.challengeStatus[j] === -1)) {
        newDict.listStatus.splice(i, 1, 1);
        newDict.challengeStatus.splice(i, 1, 1);
        newDict.user = insertLetter(newDict.user, i);
      }
    }
  }
  return newDict;
}

// returns a list of status , reals, on the status of a guess
function handleGuess(userGuess, challengeWord) {
  let dict = createInitDict(userGuess, challengeWord);
  dict = handleGuessMismatch(handleGuessMatch(dict));
  return dict.listStatus;
}

exports.handleGuess = handleGuess;
