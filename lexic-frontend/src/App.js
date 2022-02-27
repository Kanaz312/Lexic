//import React from 'react';
import './App.css';
import Login from './Login.js';
import Users from './Users.js';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import CreateAccount from './CreateAccount';



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
     const response = await axios.get('http://localhost:1000/users');
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
      <Login />
      <Users characterData={characters}  />
      <CreateAccount/>
    </div>
  );
}


export default App;
