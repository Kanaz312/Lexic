import React from "react";

function login(        ) {
  return (
    <div className="Login">
      <form>
        <p>
          <label>
            <pre>Name: </pre>
            <input type="text" name="name" />
          </label>
        </p>
        <p>
          <label>
            <pre>Password: </pre>
            <input type="text" name="pass" />
          </label>
        </p>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Login;
