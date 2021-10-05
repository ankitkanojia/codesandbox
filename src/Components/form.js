export default function UserForm({
  simpleValidator,
  user,
  onValueChange,
  submitForm
}) {
  return (
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
        <span className="errorMessage">
          {simpleValidator.current.message("user.name", user.name, "required")}
        </span>
      </p>
      <p>
        <label>UserName: </label>
        <input
          onChange={(e) => onValueChange(e)}
          value={user.username}
          type="text"
          name="username"
        />
        <span className="errorMessage">
          {simpleValidator.current.message(
            "user.username",
            user.username,
            "required"
          )}
        </span>
      </p>
      <p>
        <label>Email: </label>
        <input
          onChange={(e) => onValueChange(e)}
          value={user.email}
          type="text"
          name="email"
        />
        <span className="errorMessage">
          {simpleValidator.current.message(
            "user.email",
            user.email,
            "required"
          )}
        </span>
      </p>
      <button type="button" onClick={submitForm}>
        Submit
      </button>
    </>
  );
}
