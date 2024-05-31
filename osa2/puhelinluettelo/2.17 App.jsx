import { useState, useEffect } from 'react';
import axios from 'axios';
import Person from './components/Person';
import Notification from './components/Notification';
import personService from './services/Persons';

const Filter = ({ findPerson }) => {
  return (
    <div>
      filter shown with <input onChange={findPerson} />
    </div>
  );
};

const PersonForm = ({
  addPerson,
  newName,
  handlePersonChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handlePersonChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ filteredPersons, removePerson }) => {
  return (
    <div>
      {filteredPersons.map((person) => (
        <Person key={person.id} person={person} removePerson={removePerson} />
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [classToCall, setClassToCall] = useState('notification');

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
      setFilteredPersons(initialPersons);
    });
  }, []);
  //console.log('render', persons.length, 'persons');

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    persons.find((element) => element.name === newName)
      ? confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
        ? personService
            .update(persons.find((x) => x.name === newName).id, personObject)
            .then((returnedPerson) => {
              const newNameArray = persons.filter(
                (element) => element.name !== returnedPerson.name
              );
              setPersons(newNameArray.concat(returnedPerson));
              setFilteredPersons(newNameArray.concat(returnedPerson));
              //Numero vaihdettu ilmoitus
              setClassToCall('notification');
              setNotificationMessage(
                `Replaced. New number: ${returnedPerson.number}`
              );
              setTimeout(() => {
                setNotificationMessage(null);
              }, 5000);
            })
            .catch((error) => {
              setClassToCall('error');
              setNotificationMessage(
                `Information of ${personObject.name} has already been removed from server`
              );
              setTimeout(() => {
                setNotificationMessage(null);
              }, 5000);
            })
        : console.log('replacement cancelled')
      : persons.find((element) => element.number === newNumber)
      ? confirm(
          `The phone number ${newNumber} is already added to phonebook, replace the old name with a new one?`
        )
        ? personService
            .update(
              persons.find((x) => x.number === newNumber).id,
              personObject
            )
            .then((returnedPerson) => {
              const newNumberArray = persons.filter(
                (element) => element.number !== returnedPerson.number
              );
              setPersons(newNumberArray.concat(returnedPerson));
              setFilteredPersons(newNumberArray.concat(returnedPerson));
              //Nimi vaihdettu ilmoitus
              setClassToCall('notification');
              setNotificationMessage(
                `Replaced. New name: ${returnedPerson.name}`
              );
              setTimeout(() => {
                setNotificationMessage(null);
              }, 5000);
            })
            .catch((error) => {
              setClassToCall('error');
              setNotificationMessage(
                `Information of ${personObject.name} has already been removed from server`
              );
              setTimeout(() => {
                setNotificationMessage(null);
              }, 5000);
            })
        : console.log('replacement cancelled')
      : personService
          .create(personObject)
          .then((returnedPerson) => {
            setPersons(persons.concat(returnedPerson));
            setFilteredPersons(persons.concat(returnedPerson));
            //Henkilo lisatty ilmoitus
            setClassToCall('notification');
            setNotificationMessage(`Added ${returnedPerson.name}`);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 3000);
          })
          .catch((error) => {
            setClassToCall('error');
            setNotificationMessage(
              `${personObject.name} could not be added to the server`
            );
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          });

    setNewName('');
    setNewNumber('');
  };

  const removePerson = (identifier) => {
    confirm(
      `Delete ${persons.find((element) => element.id === identifier).name} ?`
    )
      ? personService
          .remove(identifier)
          .then(() => {
            setFilteredPersons(
              persons.filter((person) => person.id !== identifier)
            );
            setPersons(persons.filter((person) => person.id !== identifier));
            //Poiston ilmoitus
            setClassToCall('notification');
            setNotificationMessage(
              `Removed: ${
                persons.find((element) => element.id === identifier).name
              }`
            );
            setTimeout(() => {
              setNotificationMessage(null);
            }, 3000);
          })
          .catch((error) => {
            setClassToCall('error');
            setNotificationMessage(
              `Information of ${
                persons.find((element) => element.id === identifier).name
              } has already been removed from server`
            );
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          })
      : console.log('Deletion cancelled');
  };

  const findPerson = (event) => {
    const updatePerson = persons.filter(
      (person) =>
        person.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
        person.number.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredPersons(updatePerson);
  };

  const handlePersonChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} classToCall={classToCall} />
      <Filter findPerson={findPerson} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} removePerson={removePerson} />
    </div>
  );
};

export default App;
