/* eslint-disable no-console */
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Visibility from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Input from '@material-ui/core/Input';
import { Button } from '@material-ui/core';

function Login() {
  const [values, setValues] = React.useState({
    password: '',
    username: '',
    showPassword: false,
  });

  const showPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const mouseDownPass = (event) => {
    event.preventDefault();
  };

  const formChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="Login">
      <form>
        <p>
          <InputLabel htmlFor="standard-adornment-uname">
            Enter Your Username
          </InputLabel>
          <Input
            type="text"
            onChange={formChange('username')}
            value={values.username}
          />
        </p>
        <p>
          <InputLabel htmlFor="standard-adornment-password">
            Enter Your Password
          </InputLabel>
          <Input
            type={values.showPassword ? 'text' : 'password'}
            onChange={formChange('password')}
            value={values.password}
            endAdornment={(
              <InputAdornment position="end">
                <IconButton
                  onClick={showPassword}
                  onMouseDown={mouseDownPass}
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )}
          />
        </p>
        <p>
          <Button
            variant="outlined"
            onClick={() => console.log('clicked')}
          >
            Submit
          </Button>
        </p>
      </form>
    </div>
  );
}

export default Login;
