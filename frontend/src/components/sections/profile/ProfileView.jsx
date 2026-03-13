export default function ProfileView({ account, resident, setEditMode }) {
  if (!account) return null;

  return (
    <div className="profile-card">
      <h1>Profile</h1>

      <div className="profile-section">
        <h3>Account Information</h3>

        <p>
          <b>Email:</b> {account.email}
        </p>
        <p>
          <b>Username:</b> {account.username}
        </p>
        <p>
          <b>Role:</b> {account.role.roleName}
        </p>
      </div>

      {account.role.roleName === "RESIDENT" && resident && (
        <div className="profile-section">
          <h3>Personal Information</h3>

          <p>
            <b>Full Name:</b> {resident.fullName}
          </p>
          <p>
            <b>Gender:</b> {resident.gender}
          </p>
          <p>
            <b>Birthdate:</b> {resident.dateOfBirth}
          </p>
          <p>
            <b>Phone:</b> {resident.phone}
          </p>
          <p>
            <b>Identity ID:</b> {resident.identityId}
          </p>
        </div>
      )}

      <div className="profile-buttons">
        <button className="btn-edit" onClick={() => setEditMode(true)}>
          Edit Profile
        </button>
      </div>
    </div>
  );
}
