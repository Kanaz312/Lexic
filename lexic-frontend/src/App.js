import logo from './logo.svg';
<<<<<<< Updated upstream
import './App.css';
=======
//import React from 'react';
import './App.css';
import Login from './Login.js';
import Users from './Users.js';
import axios from 'axios';
import React, {useState, useEffect} from 'react';


>>>>>>> Stashed changes

function App() {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    fetchAll().then( result => {
       if (result)
          setCharacters(result);
     });
 }, [] );
  async function fetchAll(){
  try {
     const response = await axios.get('http://localhost:5000/users');
     return response.data.users_list;     
  }
  catch (error){
     //We're not handling errors. Just logging into the console.
     console.log(error); 
     return false;         
  }
  }
  return (
    <div className="App">
<<<<<<< Updated upstream
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
=======
      <Login />
      <Users characterData={characters}  />
>>>>>>> Stashed changes
    </div>
  );
}


export default App;
