import { useEffect, useState } from "react";
import { isNameValid, getLocations } from "./mock-api/apis";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [nameAlert, setNameAlert] = useState(0);
  const [entries, setEntries] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validatingString, setValidatingString] = useState("");

  const getErrorMessage = (value) => {
    switch (value) {
      case 1:
        return "invalid name";
      case 2:
        return "this name has already been taken";
      case 3:
        return "name is required";
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleClear = () => {
    setName("");
    setEntries([]);
    setNameAlert(0);
    setValidatingString("");
    setSelectedLocation(location[0]);
  };

  const handleAdd = () => {
    if (!nameAlert && !isValidating && selectedLocation) {
      if (entries.findIndex(item => item.name === name) > -1) {
        setNameAlert(2);
      }
      else if (name === "") {
        setNameAlert(3);
      } else {
        setEntries((prev) => {
          return [...prev, { name, location: selectedLocation }];
        });
      }
    }
  };

  useEffect(() => {
    getLocations()
      .then((list) => {
        setLocation(list);
        setSelectedLocation(list[0]);
      })
      .catch((e) => console.error("handleGetLocations: ", e));
  }, []);

  useEffect(() => {
    if (!isValidating && validatingString !== name) {
      setIsValidating(true);
      setValidatingString(name);
      isNameValid(name)
        .then((isValid) => {
          setIsValidating(false);
          if (isValid) {
            setNameAlert(0);
          } else {
            setNameAlert(1);
          }
        })
        .catch((e) => {
          console.error("handleNameChange: ", e);
        });
    }
  }, [name, validatingString, isValidating]);

  return (
    <div className="App">
      <div className="input-row">
        <p>Name</p>
        <input type="text" value={name} onChange={handleNameChange} />
      </div>
      {nameAlert !== 0 && <p className="alert">{getErrorMessage(nameAlert)}</p>}
      <div className="input-row">
        <p>Location</p>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          {location.map((item, index) => (
            <option value={item} key={index}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="last-row">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleAdd}>Add</button>
      </div>
      <table className="entry-table">
        <thead>
          <tr>
            <th width="40%">Name</th>
            <th width="60%">Location</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry?.name}</td>
              <td>{entry?.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
