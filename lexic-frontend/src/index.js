import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Userfront from '@userfront/react';

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


const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="reset-password" element={<PasswordResetForm />} />
      <Route path="create-account" element={<SignupForm />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
