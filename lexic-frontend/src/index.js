import React, { useEffect, useState } from 'react';
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
import Game from './Game';
import {createAuthHeader, getUserName} from './UserFrontUtils';
<<<<<<< HEAD
 
=======
import {Grid, Typography} from '@material-ui/core';
import randomColor from 'randomcolor';
import Box from '@material-ui/core/Box';
import {
  makeStyles,
  createTheme,
  ThemeProvider
} from "@material-ui/core/styles";
import { blue, pink } from "@material-ui/core/colors";


const useStyles = makeStyles((theme) => ({
  margin: {
    "& > *": {
      margin: theme.spacing(4)
    }
  },
  spacer: {
    marginBottom: theme.spacing(10)
  }
}));

const defaultTheme = createTheme({
  palette: {
    primary: blue,
    secondary: pink
  }
});

>>>>>>> main
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
          {!Userfront.accessToken() && <Link to="/login">| Login | </Link>}
          {!Userfront.accessToken() && <Link to="/create-account">Create Account | </Link>}
          {!Userfront.accessToken() && <Link to="/reset-password">Reset Password | </Link>}
          {Userfront.accessToken() && (<Link to="/dashboard">| Dashboard |</Link>)}
          {Userfront.accessToken() && (<Link to="/game">| Game |</Link>)}
        </nav>
      </div>
    <Routes>
    <Route path="/" element={<PrivateRoutes />} >
      <Route path='dashboard' element={<Dashboard />} ></Route>
      <Route path='game' element={<Game />} ></Route>
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
  const [user, setUser] = useState('');

  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (!user) {
      getUser();
    }
  });

  const userData = JSON.stringify(Userfront.user, null, 2);
  const getUser = async () => {
    let config = await createAuthHeader();
    config.headers.name = await getUserName();
    console.log('GETTING USERDATA WITH ', config);
    const response = await axios.get('http://localhost:1000/user-profile', config);
    setUser(response.data);
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container spacing={3}
        alignItems="center"
        justifyContent="center"
        direction="column"
        style={{ border: "1px solid blue" }}>
        <Box>
          <Typography color="textSecondary" variant="h2" padding={10}>
            User Profile
          </Typography> 
        </Box>       
        <Box>
          <Typography style={{background:randomColor(), fontWeight: 600}}>
            Name: {user['username']}
          </Typography>
        </Box>
        <Box>
          <Typography style={{background:randomColor(), fontWeight: 600}}>
            Coins: {user['coins']}
          </Typography>
        </Box>
        <Box>
          <Typography style={{background:randomColor(), fontWeight: 600}}>
            Wins: {user['wins']}
          </Typography>
        </Box>
        <Box>
          <Typography style={{background:randomColor(), fontWeight: 600}}>
            Losses: {user['losses']}
          </Typography>
        </Box>
      <button onClick={Userfront.logout}>Logout</button>
      </Grid>
    </ThemeProvider>
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();