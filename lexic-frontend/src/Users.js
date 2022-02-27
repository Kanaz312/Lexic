import React from "react";
function Users(props) {

    return (
    <table>
        <User characterData={props.characterData} />
    </table>
  );
}
function User(props)
{
    const rows = props.characterData.map((row, index) => {
        return (
          <tr key={index}>
            <td>{row.username}</td>
            <td>{row.coins}</td>
            <td>{row.id}</td>
          <td>
      </td>
    </tr>
        );
       }
      );
      return (
          <tbody>
            {rows}
           </tbody>
       );
}

export default Users;