export default function ProfileView({ account, resident, setEditMode }) {
  if (!account) return null;

  const rawRoleName = account?.role?.roleName || "USER";
  const roleName = rawRoleName.toUpperCase();
  const isResident = roleName === "RESIDENT";

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
          <b>Role:</b> {rawRoleName}
        </p>
      </div>

      {isResident && resident && (
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
            <b>Identity ID:</b> {resident.identityId}
          </p>
        </div>
      )}

      {!isResident && (
        <div className="profile-section profile-note">
          <h3>Personal Information</h3>
          <p>
            Your account information is available above. A dedicated personal
            profile for the role <b>{rawRoleName}</b> has not been provided by the
            backend yet.
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
