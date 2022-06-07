import { useState, useEffect } from "react";
import personService from "./services/persons.service";
const Header = ({ title }) => (
  <>
    <h1>{title}</h1>
  </>
);
const NotificationDialog = ({ message }) => {
  if (message.text === "") {
    return <></>;
  }
  let color = "";
  switch (message.intent) {
    case "success": color = "green";
      break;
    case "error": color = "red";
      break;
    default: color = "black";
  }
  console.log(message.text);
  const notificationStyle = {
    color: color,
    background: "lightgrey",
    borderStyle: "solid",
    borderRadius: "5 px",
    padding: "10 px",
  }
  return (
    <>
      <h2 style={notificationStyle}>{message.text}</h2>
    </>
  );
};
const Phonebook = ({ persons, filter, onDeletePerson }) => {
  const filteredPersons = persons.filter((person) => {
    return person.name.toLowerCase().includes(filter.toLowerCase());
  });
  return filteredPersons.map((person) => {
    return (
      <p key={person.name}>
        {" "}
        {person.name}: {person.number}{" "}
        <button
          id={person.id}
          onClick={onDeletePerson}
        >
          Delete
        </button>
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
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState({
    text: "",
    intent: null,
  });

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((newPersons) => setPersons(newPersons));
    // axios.get("http://localhost:3001/persons").then(response => {
    //   setPersons(response.data);
    //   console.log("response data", response.data);
    // });
  }, []);

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
      if (isFullInfoOnPhonebook(newName, newNumber)) {
        return alert(`${newName} is already in Phonebook`);
      }
      if (
        window.confirm(
          `${newName} is already added to Phonebook, replace old number with the new one?`
        )
      ) {
        const updateNumberId = persons.find(
          (person) => person.name === newName
        ).id;
        return personService
          .update(updateNumberId, { name: newName, number: newNumber })
          .then((returnedPerson) => {
            const newListOfPersons = persons.map((person) => {
              return person.id !== updateNumberId ? person : returnedPerson;
            });
            setNotificationMessage({
              text: `${newName} number has been updated`,
              intent: "success",
            });
            return setPersons(newListOfPersons);
          }).catch((error) => {
            setNotificationMessage({
              text: `this Person is not in our database`,
              intent: "error",
            });
          });
      }
    } else {
      personService
        .create({ name: newName, number: newNumber })
        .then((newPerson) => {
          setPersons(persons.concat(newPerson));
          setNewName("");
          setNewNumber("");
          setNotificationMessage({
            text: `${newName} has been successfully added`,
            intent: "success",
          });
        });
    }
  };
  const isFullInfoOnPhonebook = (name, number) => {
    const personToFind = persons.find((person) => person.name === name);
    if (!personToFind) return false;
    if (personToFind.number === number) return true;
    return false;
  };
  const onDeletePerson = (event) => {
    personService
      .getAtId(event.target.id)
      .then((person) => {
        if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
          personService.remove(event.target.id).then(() => {
            setPersons(
              persons.filter((person) => {
                return person.id !== Number(event.target.id);
              })
            );
          });
        }
        return;
      })
      .catch((error) => {
        setNotificationMessage({
          text: `this Person is not in our database`,
          intent: "error",
        });
      });
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
      <NotificationDialog message={notificationMessage} />
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
        onDeletePerson={onDeletePerson}
      />
    </div>
  );
};

export default App;
