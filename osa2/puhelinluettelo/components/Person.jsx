const Person = ({ person, removePerson }) => {
    return (
      <div>
        {person.name} {person.number}
        <button onClick={() => removePerson(person.id)}>delete</button>
      </div>
    );
  };
  
  export default Person;
  