//import React from 'react';
import './App.css';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

function App() {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
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
  async function makePatchCall(body) {
    try {
      //console.log("trying it");
      const response = await axios.patch('http://localhost:1000/users',body);
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
      </nav>
    </div>
  );
}

export default App;
