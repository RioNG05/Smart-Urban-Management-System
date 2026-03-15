import { useState } from "react";
import {
  updateAccount,
  updateResident,
} from "../../../services/profileService";

export default function ProfileEdit({ account, resident, setEditMode }) {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",

    fullName: resident?.fullName || "",
    gender: resident?.gender || "",
    dateOfBirth: resident?.dateOfBirth || "",
    phone: resident?.phone || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Password confirmation does not match");
      return;
    }

    try {
      const accountPayload = {
        username: account.username,
        email: account.email,
        roleId: account.role.id,
        isActive: true,
      };

      if (form.password) {
        accountPayload.password = form.password;
      }
      await updateAccount(account.id, accountPayload);

      if (account.role.roleName === "RESIDENT") {
        const residentPayload = {
          fullName: form.fullName,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
          phone: form.phone,
        };

        await updateResident(resident.id, residentPayload);
      }

      alert("Profile updated successfully");

      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="profile-card">
      <h1>Edit Profile</h1>

      <div className="profile-section">
        <h3>Account Information</h3>

        <label>Email</label>
        <input value={account.email} disabled />

        <label>Username</label>
        <input value={account.username} disabled />

        <label>New Password</label>
        <input type="password" name="password" onChange={handleChange} />

        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" onChange={handleChange} />
      </div>

      {account.role.roleName === "RESIDENT" && (
        <div className="profile-section">
          <h3>Personal Information</h3>

          <label>Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />

          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
          </select>

          <label>Birthdate</label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
          />

          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} />

          <label>Identity ID</label>
          <input value={form.identityId} disabled />
        </div>
      )}

      <div className="profile-buttons">
        <button className="btn-save" onClick={handleSave}>
          Save
        </button>

        <button className="btn-cancel" onClick={() => setEditMode(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
