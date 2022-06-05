import { useState } from "react";

const Header = ({ title }) => (
  <>
    <h1>{title}</h1>
  </>
);
const Phonebook = ({ persons, filter }) => {
  const filteredPersons = persons.filter((person) => {
    return person.name.toLowerCase().includes(filter.toLowerCase());
  });
  return filteredPersons.map((person) => {
    return (
      <p key={person.name}>
        {" "}
        {person.name}: {person.number}
      </p>
    );
  });
};
const Filter = ({ filter, onChange }) => (
  <>
    <h2>Numbers: </h2>
    filter shown with:{" "}
    <input
      value={filter}
      onChange={onChange}
    />
  </>
);

const AddNameSection = ({
  currentName,
  currentNumber,
  onChangeName,
  onChangeNumber,
  onSubmitPerson,
}) => (
  <>
  <h2>Add new person:</h2>
    <form onSubmit={onSubmitPerson}>
      <div>
        name:{" "}
        <input
          value={currentName}
          onChange={onChangeName}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={currentNumber}
          onChange={onChangeNumber}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </>
);
const App = () => {
  // states
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const onChangeInputName = (event) => {
    setNewName(event.target.value);
  };

  const onChangeInputNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const onChangeInputFilter = (event) => {
    setNameFilter(event.target.value);
  };

  const onSubmitNewPerson = (event) => {
    event.preventDefault();
    if (isNameOnPhonebook(newName)) {
      alert(`${newName} is already in Phonebook`);
    } else {
      setPersons(persons.concat({ name: newName, number: newNumber }));
      setNewName("");
      setNewNumber("");
    }
  };

  const isNameOnPhonebook = (name) => {
    const isOnPhonebook = persons.findIndex((person) => {
      return person.name === name;
    });
    return isOnPhonebook !== -1 ? true : false;
  };
  return (
    <div>
      <Header title="Phonebook" />
      <Filter
        filter={nameFilter}
        onChange={onChangeInputFilter}
      />
      <AddNameSection
        currentName={newName}
        currentNumber={newNumber}
        onChangeName={onChangeInputName}
        onChangeNumber={onChangeInputNumber}
        onSubmitPerson={onSubmitNewPerson}
      />
      <Phonebook
        persons={persons}
        filter={nameFilter}
      />
    </div>
  );
};

export default App;
