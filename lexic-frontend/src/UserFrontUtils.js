import Userfront from '@userfront/react';

// returns the authentication header we need to pass on EVERY api call
async function createAuthHeader() {
  return { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${Userfront.accessToken()}` } };
}

// returns the username of the current user to be put in the body of the call
async function getUserName() {
  return Userfront.user.name;
}

export { createAuthHeader, getUserName };
