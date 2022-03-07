import React, {useState, useEffect} from 'react';
import './Game.css';
import axios from 'axios';
import './checkGuess';
import { handleGuess, unguessedLetter } from './checkGuess';
const dotenv = require("dotenv");
dotenv.config();

const colors = ['red', 'orange', 'green', 'burlywood'];
const defaultNumGuesses = 5;

function Word(props) {
  const letters = props.word.split('').map((letter, index) => {
    const letterStyle = {"backgroundColor": colors[props.guessState[index]]};
    return (
      <td key={index}>
        <div className='letter' style={letterStyle}>
          {letter}
        </div>
      </td>
    );
   }
  );
  return (
    letters
  );
}

function GuessHistory(props) {
  const rows = props.words.map((word, index) => {
    return (
      <tr key={index}>
        <Word word={word} guessState={props.guessStates[index]}/>
      </tr>
    );
   }
  );
  return (
    <tbody>
      {rows}
    </tbody>
  );
}

function Game(props) {
  const gameState = JSON.parse(localStorage.getItem('gameState')) || {
    words: Array(defaultNumGuesses).fill(' '.repeat(3)),
    bet: 0,
    numGuesses: defaultNumGuesses,
    guessIndex: 0,
    guessStates: Array(defaultNumGuesses).fill(Array(3).fill(unguessedLetter)),
    challenge: {},
  }

  const [guess, setGuess] = useState('');

  async function makePatchCall(body) {
    try {
      const response = await axios.patch(process.env.URL + '/users', body);
      return response;
    }
    catch(error) {
      console.log(error);
      return false;
    }
  }

  const updateChallenge = async () => {
    // only try to update the challenge if it has not been found already
    if (Object.keys(gameState.challenge).length === 0){
      const response = {"data":{"word" : "racket", "numGuesses" : 6, "bet" : 40, "from" : "Lexic", "to" : "all"}};
      const data = response.data;
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

  useEffect(() => {
    updateChallenge();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setGuess(value);
  }

  const validateWord = async (word) => {
    const response = await axios.get(process.env.URL + `/guess/${word}`);
    return response.data;
  }

  async function sendResults(userName, bet, win){
    const data = {user: {username: userName},
    result: {bet: bet, win: win},
   };
   const response = await makePatchCall(data);
  } 

  const guessWord = async() => {
    const index = gameState.guessIndex;
    gameState.words[index] = guess;
    if (gameState.challenge.word.length === guess.length
      && await validateWord(guess)){
      var guessState = handleGuess(guess, gameState.challenge.word);
      // game won
      if (guessState.reduce((previousState, state, index, array)=>{return previousState && (state === 2);}, true)){
        // hardcoded name
        await sendResults('Mitchell', gameState.challenge.bet, true);
        console.log('correct word');
        return;
      }
      gameState.guessStates[index] = guessState;
      gameState.guessIndex = index + 1;
      localStorage.setItem('gameState', JSON.stringify(gameState));
      // game lost
      if (gameState.guessIndex >= gameState.numGuesses) {
        // hardcoded name
        await sendResults('Mitchell', gameState.challenge.bet, false);
        gameState.challenge = {};
        localStorage.removeItem('gameState');
        console.log('ran out of guesses');
        window.location.reload();
      }
      setGuess('');
      return;
    }
    setGuess('');
    console.log('Invalid word');
  }

  function temp(){
    console.log("keydown");
  }

  const guessStyle = {'resize' : 'none'};

  if (Object.keys(gameState.challenge).length === 0)
    return(
      <>Loading Game...</>
    );
  else
    return(
      <>
      <div className='guesses'>
        <table>
          <GuessHistory words={gameState.words} guessStates={gameState.guessStates}/>
        </table>
      </div>
        <div className='guessInputContainer'>
          <form>
            <textarea style={guessStyle} className='guessInput' value={guess} onChange={handleChange} onSubmit={temp}/>
            <p/>
            <input type='button' value='Submit Guess' onClick={guessWord}/>
          </form>
        </div>
      </>
    );
}


export default Game;