/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import './Game.css';
import axios from 'axios';
import Userfront from '@userfront/react';
import { handleGuess, unguessedLetter } from './checkGuess';

import { createAuthHeader, getUserName } from './UserFrontUtils';

const colors = ['red', 'orange', 'green', 'burlywood'];
const defaultNumGuesses = 5;
const guessMessages = ['Guess Wrong Length', 'Guess Was Not a Word'];

function Word(props) {
  const letters = props.word.split('').map((letter, index) => {
    const letterStyle = { backgroundColor: colors[props.guessState[index]] };
    return (
      // eslint-disable-next-line react/no-array-index-key
      <td key={index}>
        <div className="letter" style={letterStyle}>
          {letter}
        </div>
      </td>
    );
  });
  return (
    letters
  );
}

function GuessHistory(props) {
  const rows = props.words.map((word, index) => (
    <tr key={index}>
      <Word word={word} guessState={props.guessStates[index]} />
    </tr>
  ));
  return (
    <tbody>
      {rows}
    </tbody>
  );
}

function Game() {
  const gameState = JSON.parse(localStorage.getItem('gameState')) || {
    words: Array(defaultNumGuesses).fill(' '.repeat(3)),
    bet: 0,
    numGuesses: defaultNumGuesses,
    guessIndex: 0,
    guessStates: Array(defaultNumGuesses).fill(Array(3).fill(unguessedLetter)),
    challenge: {},
  };

  const [guess, setGuess] = useState('');
  const [guessValidity, setGuessValidity] = useState(0);

  async function makePatchCall(body) {
    try {
      const config = await createAuthHeader();
      const newBody = body;
      newBody.Name = Userfront.user.name;
      const response = await axios.patch('http://localhost:1000/users', body, config);
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async function getRandomWord() {
    const config = await createAuthHeader();
    config.headers.name = await getUserName();
    const response = await axios.get('http://localhost:1000/word', config);
    console.log('random word is:', response.data);
    return response.data;
  }

  useEffect(() => {
    async function updateChallenge() {
    // only try to update the challenge if it has not been found already
      if (Object.keys(gameState.challenge).length === 0) {
        const newWord = await getRandomWord();
        const response = {
          data: {
            word: newWord, numGuesses: 6, bet: 40, from: 'Lexic', to: 'all',
          },
        };
        const { data } = response;
        gameState.numGuesses = data.numGuesses;
        gameState.bet = data.bet;
        const wordLen = data.word.length;
        gameState.words = Array(gameState.numGuesses).fill(' '.repeat(wordLen));
        gameState.challenge = data;
        gameState.guessStates = Array(data.numGuesses).fill(Array(wordLen).fill(unguessedLetter));
        localStorage.setItem('gameState', JSON.stringify(gameState));
        window.location.reload();
      }
    }
    updateChallenge();
  }, []);

  function handleChange(event) {
    const { value } = event.target;
    setGuess(value);
  }

  async function validateWord(word) {
    const config = await createAuthHeader();
    console.log('config in guess is:', config);
    const name = await getUserName();
    const response = await axios.get(`http://localhost:1000/guess/${word}/${name}`, config);
    return response.data;
  }

  async function sendResults(win) {
    const data = { win };
    const response = await makePatchCall(data);
    console.log(response);
  }

  const guessWord = async () => {
    const index = gameState.guessIndex;
    gameState.words[index] = guess;
    if (gameState.challenge.word.length === guess.length
      && await validateWord(guess)) {
      const guessState = handleGuess(guess, gameState.challenge.word);
      // game won
      console.log('word is:', gameState.challenge.word);
      if (guessState.reduce((previousState, state, index, array) => previousState
      && (state === 2), true)) {
        // hardcoded name
        await sendResults(true);
        gameState.challenge = {};
        localStorage.removeItem('gameState');
        window.location.reload();
        return;
      }
      gameState.guessStates[index] = guessState;
      gameState.guessIndex = index + 1;
      localStorage.setItem('gameState', JSON.stringify(gameState));
      // game lost
      if (gameState.guessIndex >= gameState.numGuesses) {
        await sendResults(false);
        gameState.challenge = {};
        localStorage.removeItem('gameState');
        console.log('ran out of guesses');
        window.location.reload();
      }
      setGuess('');

      setGuessValidity(0);
      return;
    }

    setGuess('');
    if (gameState.challenge.word.length === guess.length) {
      setGuessValidity(2);
    } else { setGuessValidity(1); }
    console.log('Invalid word');
  };

  function temp() {
    console.log('keydown');
  }

  if (Object.keys(gameState.challenge).length === 0) {
    return (
      <>Loading Game...</>
    );
  }
  return (
    <>
      <div className="guesses">
        <table>
          <GuessHistory words={gameState.words} guessStates={gameState.guessStates} />
        </table>
      </div>
      <div className="invalidWordText">
        {guessValidity !== 0 && <h2>{guessMessages[guessValidity - 1]}</h2>}
      </div>
      <div className="guessInputContainer">
        <form>
          <textarea
            style={{ resize: 'none' }}
            className="guessInput"
            value={guess}
            onKeyPress={(e) => { if (e.key === 'Enter') { guessWord(); e.preventDefault(); } }}
            onChange={handleChange}
            onSubmit={temp}
          />
          <p />
          <input type="button" value="Submit Guess" onClick={guessWord} />
        </form>
      </div>
    </>
  );
}

export default Game;
