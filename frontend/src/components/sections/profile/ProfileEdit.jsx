import { useState } from "react";

export default function ProfileEdit({ user, setEditMode }) {
  const [form, setForm] = useState({
    ...user,
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (form.password !== form.confirmPassword) {
      alert("Password confirmation does not match!");
      return;
    }

    console.log("SAVE PROFILE:", form);

    setEditMode(false);
  };

  return (
    <div className="profile-card">
      <h1>Edit Profile</h1>

      <div className="profile-section">
        <h3>Account Information</h3>

        <input value={form.email} disabled />
        <input value={form.identifyId} disabled />
        <input value={form.username} disabled />
      </div>

      <div className="profile-section">
        <h3>Personal Information</h3>

        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
        />

        <input
          type="date"
          name="birthdate"
          value={form.birthdate}
          onChange={handleChange}
        />

        <select name="gender" value={form.gender} onChange={handleChange}>
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>

      <div className="profile-section">
        <h3>Change Password</h3>

        <input
          type="password"
          name="password"
          placeholder="New password"
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          onChange={handleChange}
        />
      </div>

      <div className="profile-buttons">
        <button className="btn-save" onClick={handleSave}>
          Save Changes
        </button>

        <button className="btn-cancel" onClick={() => setEditMode(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
