//import React from 'react';
import './App.css';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
<<<<<<< HEAD

const baseUrl = process.env.baseUrl
=======
import { Link } from 'react-router-dom';
>>>>>>> main

function App() {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
<<<<<<< HEAD
    fetchAll().then( result => {
       if (result)
          setCharacters(result);
     });
 }, [] );
  async function fetchAll(){
  try {
     const response = await axios.get('https://lexic-backend.herokuapp.com/users');
     return response.data.users_list;     
=======
    fetchAll().then(result => {
      if (result) setCharacters(result);
    });
  }, []);
  async function fetchAll() {
    try {
      const response = await axios.get("http://localhost:1000/users");
      return response.data.users_list;
    } catch (error) {
      //We're not handling errors. Just logging into the console.
      console.log(error);
      return false;
    }
>>>>>>> main
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
  
  // placeholder
  updateList();

  return (
    <div>
      <h1>Lexic</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/login">Login</Link> |{" "}
        <Link to="/create-account">Create Account</Link> |{" "}
        <Link to="/reset-password">Reset Password</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link> | {" "}
      </nav>
    </div>
  );
}

export default App;
