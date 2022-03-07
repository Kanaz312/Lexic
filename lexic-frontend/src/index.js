import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';


import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  Link
} from "react-router-dom";

import Userfront from '@userfront/react';
import axios from 'axios';
//const dotenv = require("dotenv");

//dotenv.config();

Userfront.init("jb7pw8rn");

const SignupForm = Userfront.build({
  toolId: "rlldok"
});

const LoginForm = Userfront.build({
  toolId: "bllkrl"
});

const PasswordResetForm = Userfront.build({
  toolId: "krrbnl"
});

const PrivateRoutes = () => {
  let location = useLocation();
  console.log('location is: ', location);
  return (!Userfront.accessToken()) 
    ? <Navigate to="/login" replace state={{ from: location }} />
    : <Outlet />;
}


const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
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
          {Userfront.accessToken() && (<Link to="/dashboard">Dashboard</Link>)}
        </nav>
      </div>
    <Routes>
    <Route path="/" element={<PrivateRoutes />} >
      <Route path='dashboard' element={<Dashboard />} ></Route>
    </Route>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/reset-password" element={<PasswordResetForm />} />
      <Route path="/create-account" element={<SignupForm />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);

//       <Route path="/" element={<App />} />


function Dashboard() {
  const userData = JSON.stringify(Userfront.user, null, 2);
  return (
    <div>
      <h2>Dashboard</h2>
      <pre>{userData}</pre>
      <button onClick={Userfront.logout}>Logout</button>
      <button onClick={makePostCall}>TEST</button>
    </div>
  );
}

// sample post call utilizing authentication bearer header
async function makePostCall() {
  try {
    // config will always be the same
    let config = await createAuthHeader();
    // body will contain whatever data you want to submit to backend
    let body = {
      TestData: "THIS IS TEST DATA FROM FRONTEND IN BODY",
      Name: await getUserName()
    }
    // make the post call with the body and config
    const response = await axios.post('https://lexic-backend.herokuapp.com/test',  body, config);
    console.log("RESPONSE: ", response);
    return response;
  }
  catch(error) {
    console.log(error);
    return false;
  }
}

// returns the authentication header we need to pass on EVERY api call
async function createAuthHeader() {
  return { headers: { "Content-Type": "application/json", Authorization: `Bearer ${Userfront.accessToken()}`} }
}

// returns the username of the current user to be put in the body of the call
async function getUserName() {
  return Userfront.user['name'];
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();