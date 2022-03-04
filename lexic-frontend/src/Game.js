import React, {useState, useEffect} from 'react';
import './Game.css';


function Word(props) {
  const letters = props.word.split('').map((letter, index) => {
    return (
      <td key={index}>
        <div className='letter'>
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
        <Word word={word}/>
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
  console.log(guessIndex);
  function handleChange(event) {
    const { name, value } = event.target;
    console.log(value);
    setGuess(value);
  }

  function GuessWord(){
    words[guessIndex] = guess;
    setGuessIndex(guessIndex + 1);
    setWords(words);
    setGuess('');
  }

  return(
    <>
    <div className='guesses'>
      <table>
        <GuessHistory words={words}/>
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