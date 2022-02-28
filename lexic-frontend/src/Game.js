import React, {useState, useEffect} from 'react';
import './Game.css';

function Word(props) {
  const letters = props.word.split('').map((letter, index) => {
    return (
      <td key={index}>
        <div class="letter">
          {letter}
        </div>
      </td>
    );
   }
  );
  return (
    <div class="word">
      {letters}
    </div>
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
    <div class="guesses">
      <tbody>
        {rows}
      </tbody>
    </div>
  );
}

function Game() {
  const words = ['yoink', 'zowie', 'words', '     ', '     ']
  const upperWords = words.map((word) => {return word.toUpperCase()})
  return(
    <div>
      <GuessHistory words={upperWords}/>
      <div class="guessInputContainer">
        <form>
          <input class="guessInput"></input>
          <p/>
          <input type="submit" value="Submit Guess" />
        </form>
      </div>
    </div>
  );
}


export default Game;