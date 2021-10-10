import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import Popup from "./Components/popup";
import "./popup.css";
import SimpleReactValidator from "simple-react-validator";
import Table from "./Components/table";
import Form from "./Components/form";
import { FaUserPlus, FaUndo } from "react-icons/fa";

const userObj = { id: "", name: "", username: "", email: "", deleted: false };

function App() {
  // component state
  const simpleValidator = useRef(new SimpleReactValidator());
  const [users, setUsers] = useState(false);
  const [deletedIds, setDeletedIds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [, forceUpdate] = useState();
  const [mode, setMode] = useState("");

  // Get user's records using API call
  useEffect(() => {
    //Fetch records from external API
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((result) => {
        const updatedList = result.map((data) => {
          data.deleted = false;
          return {
            id: guidGenerator(),
            name: data.name,
            username: data.username,
            email: data.email,
            deleted: data.deleted
          };
        });
        setUsers(updatedList);
      });
  }, []);

  // Generate random number
  const guidGenerator = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  // Delete Row Function
  const deleteRecord = (id) => {
    if (window.confirm("Are you sure want to delete!")) {
      var userCollection = [...users];
      var updatedCollection = userCollection.filter((m) => m.id === id);
      if (updatedCollection) {
        // Update deleted flag to selected row item
        updatedCollection[0].deleted = true;
        setUsers((prev) => (prev = userCollection));

        // Add deleted record id to deleteId's collection
        var deletedRecords = deletedIds;
        deletedRecords.push(id);
        setDeletedIds(deletedRecords);
      }
    }
  };

  // Undo deleted record Function
  const undoDeletion = () => {
    if (deletedIds && deletedIds.length > 0) {
      var userCollection = [...users];
      var deletedIdsCollection = [...deletedIds];
      var deletedId = deletedIdsCollection.pop();
      var updatedCollection = userCollection.filter((m) => m.id === deletedId);

      // Reset delete flag to undo or not-deleted based on lastly deleted order
      if (updatedCollection) {
        updatedCollection[0].deleted = false;
        setUsers(userCollection);
      }
      setDeletedIds(deletedIdsCollection);
    } else {
      alert("No record found deleted.");
    }
  };

  // toggle Popup
  const togglePopup = (mode, data) => {
    if (!isOpen)
      if (mode === "update") setUser(data);
      else setUser(userObj);
    resetValidation();
    setIsOpen(!isOpen);
    setMode(mode);
  };

  // Dynamic value configuration for form control
  const onValueChange = (event) => {
    event.preventDefault();
    setUser((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  // Reset validation
  const resetValidation = () => {
    simpleValidator.current.hideMessages();
    forceUpdate(2);
  };

  // Submit Form
  const submitForm = () => {
    if (simpleValidator.current.allValid()) {
      if (mode === "add") addRecord();
      else updateRecord();
      togglePopup();
      setMode("");
    } else {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    }
  };

  // Add new record method
  const addRecord = () => {
    setUsers((prevArray) => [
      ...prevArray,
      {
        id: guidGenerator(),
        name: user.name,
        username: user.username,
        email: user.email,
        deleted: false
      }
    ]);
  };

  // Update existing record method
  const updateRecord = () => {
    setUsers(
      users.map((prevArray) =>
        prevArray.id === user.id
          ? {
              ...prevArray,
              name: user.name,
              username: user.username,
              email: user.email
            }
          : prevArray
      )
    );
  };

  return (
    <div>
      <h2>Code SandBox Example</h2>
      <button onClick={undoDeletion}>
        <FaUndo />
      </button>
      <button onClick={() => togglePopup("add")}>
        <FaUserPlus />
      </button>
      {isOpen && (
        <Popup
          content={
            <Form
              simpleValidator={simpleValidator}
              user={user}
              onValueChange={onValueChange}
              submitForm={submitForm}
              mode={mode}
            />
          }
          handleClose={togglePopup}
        />
      )}
      <Table
        users={users}
        togglePopup={togglePopup}
        deleteRecord={deleteRecord}
      />
    </div>
  );
}

export default App;
