import React, {useState} from 'react';

function Form(props) {
  const [person, setPerson] = useState(
     {
        username: "",
        coins: "",
        //id: "",
     }
  );
  function submitForm() {
    props.handleSubmit(person);
    setPerson({username: '', coins: ''});
  }
  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "coins")
      setPerson(
         {username: person['username'], coins: value}
      );
    else     
       setPerson(
         {username: value, coins: person['coins']}   
       );
  }
  return (
    <form>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        value={person.username}
        onChange={handleChange} />
      <label htmlFor="coins">Coins</label>
      <input
        type="text"
        name="coins"
        id="coins"
        value={person.coins}
        onChange={handleChange} />
        <input type="button" value="Submit" onClick={submitForm} />
    </form>
);
  
}
export default Form;