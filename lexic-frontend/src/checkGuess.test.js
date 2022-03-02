/* eslint-disable no-undef */
const myFunctions = require('./checkGuess');

// test handleGuess
test('Match Test -- Success', () => {
  const target = [2, 2, 2, 2, 2];
  const userGuess = 'words';
  const challengeWord = 'words';
  const result = myFunctions.handleGuess(userGuess, challengeWord);
  console.log(result);
  expect(result).toStrictEqual(target);
});

test('MisMatch letter Words -- Success', () => {
  const target = [0, 2, 2, 2, 1];
  const userGuess = 'wordf';
  const challengeWord = 'fords';
  const result = myFunctions.handleGuess(userGuess, challengeWord);
  console.log(result);
  expect(result).toStrictEqual(target);
});

test('MisMatch, No Matching,Words -- Success', () => {
  const target = [0, 0, 0, 0, 0];
  const userGuess = 'words';
  const challengeWord = 'pkint';
  const result = myFunctions.handleGuess(userGuess, challengeWord);
  console.log(result);
  expect(result).toStrictEqual(target);
});

test('MisMatch, Double Letters,Words -- Success', () => {
  const target = [0, 2, 0, 0, 2];
  const userGuess = 'vivid';
  const challengeWord = 'Aided';
  const result = myFunctions.handleGuess(userGuess, challengeWord);
  console.log(result);
  expect(result).toStrictEqual(target);
});

test('MisMatch, Double Letters,Words -- Success', () => {
  const target = [0, 0, 0, 2, 2];
  const userGuess = 'vivid';
  const challengeWord = 'droid';
  const result = myFunctions.handleGuess(userGuess, challengeWord);
  console.log(result);
  expect(result).toStrictEqual(target);
});
