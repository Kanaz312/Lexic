//import React from 'react';
import './App.css';
import Login from './Login.js';
import Users from './Users.js';
import Form from './Form.js';
import axios from 'axios';
import React, {useState, useEffect} from 'react';



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
  async function makePostCall(person) {
    try {
      //console.log("trying it");
      const response = await axios.post('http://localhost:1000/users',person);
      return response;
    }
    catch(error) {
      console.log(error);
      return false;
    }
  }
  function updateList(person) {
    makePostCall(person).then(result => {
      if(result && result.status === 201)
      {
        person.id = result.data.id;
        setCharacters([...characters,person]);
      }
    });
  }
  return (
    <div className="App">
      <Login />
      <Users characterData={characters}  />
      <Form handleSubmit={updateList}/>
    </div>
  );
}


export default App;
