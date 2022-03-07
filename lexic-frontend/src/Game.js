import React, {useState, useEffect} from 'react';
import './Game.css';
import axios from 'axios';
import './checkGuess';
import { handleGuess, unguessedLetter } from './checkGuess';

const colors = ['red', 'orange', 'green', 'burlywood']
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
    words: Array(props.numGuesses).fill(' '.repeat(3)),
    guessIndex: 0,
    guessStates: Array(props.numGuesses).fill(Array(3).fill(unguessedLetter)),
    challenge: {},
  }

  const [guess, setGuess] = useState('');

  const updateChallenge = async () => {
    // only try to update the challenge if it has not been found already
    if (Object.keys(gameState.challenge).length === 0){
      const response = {"data":{"word" : "lovelya", "bet" : 40, "from" : "Lexic", "to" : "all"}};//await axios().get();
      console.log("filling");
      gameState.words = Array(props.numGuesses).fill(' '.repeat(response.data.word.length));
      gameState.challenge = response.data;
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

  function GuessWord(){
    const index = gameState.guessIndex;
    gameState.words[index] = guess;
    var guessState = handleGuess(guess, gameState.challenge.word);
    console.log(guessState);
    gameState.guessStates[index] = guessState;
    gameState.guessIndex = index + 1;
    localStorage.setItem('gameState', JSON.stringify(gameState));
    if (gameState.guessIndex >= props.numGuesses) {
      gameState.challenge = {};
      localStorage.removeItem('gameState');
      window.location.reload();
    }
    setGuess('');
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
            <input type='button' value='Submit Guess' onClick={GuessWord}/>
          </form>
        </div>
      </>
    );
}


export default Game;