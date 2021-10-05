import React, { useState, useEffect } from "react";
import "./styles.css";
import Popup from "./Components/popup";
import "./popup.css";

const userObj = { name: "", username: "", email: "" };

function App() {
  const [users, setUsers] = useState(false);
  const [deletedIds, setDeletedIds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(userObj);

  useEffect(() => {
    //Fetch records from external API
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((result) => {
        const updatedList = result.map((data) => {
          data.deleted = false;
          return {
            id: data.id,
            name: data.name,
            username: data.username,
            email: data.email,
            deleted: data.deleted
          };
        });
        setUsers(updatedList);
      });
  }, []);

  // Delete Row Function
  const DeleteRow = (id) => {
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
  const UndoDeletion = () => {
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

  const togglePopup = () => {
    setUser(userObj);
    setIsOpen(!isOpen);
  };

  const onValueChange = (event) => {
    event.preventDefault();
    setUser((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const submitForm = () => {};

  return (
    <div>
      <button className="btnUndo" onClick={UndoDeletion}>
        Undo Deletion
      </button>
      <button className="btnPopup" onClick={togglePopup}>
        Click to Open Popup
      </button>
      {isOpen && (
        <Popup
          content={
            <>
              <b>Add New User</b>
              <p>
                <label>Name: </label>
                <input
                  onChange={(e) => onValueChange(e)}
                  value={user.name}
                  type="text"
                  name="name"
                />
              </p>
              <p>
                <label>UserName: </label>
                <input
                  onChange={(e) => onValueChange(e)}
                  value={user.username}
                  type="text"
                  name="username"
                />
              </p>
              <p>
                <label>Email: </label>
                <input
                  onChange={(e) => onValueChange(e)}
                  value={user.email}
                  type="text"
                  name="email"
                />
              </p>
              <button onSubmit={submitForm}>Submit</button>
            </>
          }
          handleClose={togglePopup}
        />
      )}
      <table id="users">
        <thead>
          <tr>
            <td>ID</td>
            <td>Name</td>
            <td>User Name</td>
            <td>Email</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map(
              (data, index) =>
                !data.deleted && (
                  <tr key={index}>
                    <td>{data.id}</td>
                    <td>{data.name}</td>
                    <td>{data.username}</td>
                    <td>{data.email}</td>
                    <td>
                      <button
                        className="btnDelete"
                        onClick={() => DeleteRow(data.id)}
                      >
                        Delete Row
                      </button>
                    </td>
                  </tr>
                )
            )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
