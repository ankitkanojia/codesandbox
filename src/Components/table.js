import { FaTrash, FaEdit } from "react-icons/fa";

export default function Table({ users, togglePopup, deleteRecord }) {
  return (
    <table id="users">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>User Name</th>
          <th>Email</th>
          <th>Action</th>
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
                    <button onClick={() => deleteRecord(data.id)}>
                      <FaTrash />
                    </button>
                    <button onClick={() => togglePopup("update", data)}>
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              )
          )}
      </tbody>
    </table>
  );
}
