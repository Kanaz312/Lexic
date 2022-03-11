/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';

function Users(props) {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <table>
      <User characterData={props.characterData} />
    </table>
  );
}
function User(props) {
  const rows = props.characterData.map((row, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <tr key={index}>
      <td>{row.username}</td>
      <td>{row.coins}</td>
      <td>{row.id}</td>
      <td />
    </tr>
  ));
  return (
    <tbody>
      {rows}
    </tbody>
  );
}

export default Users;
