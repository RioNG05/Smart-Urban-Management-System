export default function ProfileView({ user, setEditMode }) {
  return (
    <div className="profile-card">
      <h1>Profile</h1>

      <div className="profile-section">
        <h3>Account Information</h3>

        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Identify ID:</b> {user.identifyId}
        </p>
        <p>
          <b>Username:</b> {user.username}
        </p>
      </div>

      <div className="profile-section">
        <h3>Personal Information</h3>

        <p>
          <b>Full Name:</b> {user.fullName}
        </p>
        <p>
          <b>Birthdate:</b> {user.birthdate}
        </p>
        <p>
          <b>Gender:</b> {user.gender}
        </p>
      </div>

      <button className="btn-edit" onClick={() => setEditMode(true)}>
        Edit Profile
      </button>
    </div>
  );
}
