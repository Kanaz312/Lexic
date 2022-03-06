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
  const [words, setWords] = useState(Array(props.numGuesses).fill(' '.repeat(props.numLetters)));
  const [guessIndex, setGuessIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [guessStates, setGuessStates] = useState(Array(props.numGuesses).fill(Array(props.numLetters).fill(unguessedLetter)));
  const [challenge, setChallenge] = useState({});

  const updateChallenge = async () => {
    const response = {"data":{"word" : "loved", "bet" : 40, "from" : "Lexic", "to" : "all"}};//await axios().get();
    setChallenge(response.data);
  }

  useEffect(() => {
    updateChallenge();
  }, []);

  console.log(guessIndex);
  function handleChange(event) {
    const { name, value } = event.target;
    console.log(value);
    setGuess(value);
  }

  function GuessWord(){
    words[guessIndex] = guess;
    var guessState = handleGuess(guess, challenge.word);
    console.log(guessState);
    guessStates[guessIndex] = guessState;
    setGuessStates(guessStates);
    setGuessIndex(guessIndex + 1);
    setWords(words);
    setGuess('');
  }

  return(
    <>
    <div className='guesses'>
      <table>
        <GuessHistory words={words} guessStates={guessStates}/>
      </table>
    </div>
      <div className='guessInputContainer'>
        <form>
          <input className='guessInput' value={guess} onChange={handleChange}/>
          <p/>
          <input type='button' value='Submit Guess' onClick={GuessWord}/>
        </form>
      </div>
    </>
  );
}


export default Game;