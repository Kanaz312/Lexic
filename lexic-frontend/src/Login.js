import React from "react";

function Login() {
  return (
    <div className="Login">
      <form>
        <p>
          <label>
            <br/>Name:
            <input type="text" name="name" />
          </label>
        </p>
        <p>
          <label>
            <br/>Password:
            <input type="text" name="pass" />
          </label>
        </p>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Login;
