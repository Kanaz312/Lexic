// Integers that represents status of a letter
// 0 : Letter is not in the word/ Initial State
const notInWordLetter = 0;
const letterNotUsed = 0;
// 1 : Letter is in the word, not in right index
const misMatchLetter = 1;
const letterUsed = 1;
// 2 : Letter is in the word, correct index
const matchLetter = 2;

// return a intial dictionary
function createInitDict(userGuess, challengeWord) {
  const lstUser = new Array(challengeWord.length);
  const lstChal = new Array(challengeWord.length);
  for (let i = 0; i < lstUser.length; i += 1) {
    lstUser[i] = notInWordLetter;
    lstChal[i] = letterNotUsed;
  }
  const dict = {
    user: userGuess,
    challenge: challengeWord,
    listStatus: lstUser,
    challengeStatus: lstChal,
  };
  return dict;
}

// helper -- inserts '_' when letter is used
function insertLetter(str, i) {
  return `${str.substring(0, i)}_${str.substring(i + 1)}`;
}

// returns a list of integers that represents
// match letters in the user's guess
function handleGuessMatch(dict) {
  const newDict = dict;
  for (let i = 0; i < dict.user.length; i += 1) {
    if (dict.user[i] === dict.challenge[i]) {
      newDict.listStatus.splice(i, 1, matchLetter);
      newDict.challengeStatus.splice(i, 1, letterUsed);
      newDict.user = insertLetter(newDict.user, i);
      console.log(newDict);
    }
  }
  return newDict;
}

// returns a list of integers that represents
// mismatch letters in the user's guess
function handleGuessMismatch(dict) {
  const newDict = dict;
  for (let i = 0; i < dict.user.length; i += 1) {
    for (let j = 0; j < dict.challenge.length; j += 1) {
      if ((dict.user[i] === dict.challenge[j]) && (dict.listStatus[i] === notInWordLetter)
        && (dict.challengeStatus[j] === letterNotUsed)) {
        newDict.listStatus.splice(i, 1, misMatchLetter);
        newDict.challengeStatus.splice(j, 1, letterUsed);
        newDict.user = insertLetter(newDict.user, i);
        console.log(newDict);
      }
    }
  }
  return newDict;
}

// returns a list of integers that represents
// letters in the user's guess
function handleGuess(userGuess, challengeWord) {
  let dict = createInitDict(userGuess, challengeWord);
  dict = handleGuessMismatch(handleGuessMatch(dict));
  return dict.listStatus;
}

exports.handleGuess = handleGuess;
