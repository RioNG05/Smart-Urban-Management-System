import { useState } from "react";
import {
  updateAccount,
  updateResident,
} from "../../../services/profileService";

export default function ProfileEdit({
  account,
  resident,
  setAccount,
  setResident,
  loadAccount,
  setEditMode,
}) {
  const rawRoleName = account?.role?.roleName || "USER";
  const roleName = rawRoleName.toUpperCase();
  const isResident = roleName === "RESIDENT";

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
    fullName: resident?.fullName || "",
    gender: resident?.gender || "Male",
    dateOfBirth: resident?.dateOfBirth || "",
    identityId: resident?.identityId || "",
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
        roleId: account?.role?.id,
        isActive: account?.isActive ?? true,
      };

      if (form.password) {
        accountPayload.password = form.password;
      }

      await updateAccount(account.id, accountPayload);

      if (isResident && resident?.id) {
        const residentPayload = {
          fullName: form.fullName,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
          identityId: form.identityId,
        };

        await updateResident(resident.id, residentPayload);
      }

      if (typeof loadAccount === "function") {
        await loadAccount();
      } else {
        setAccount((prev) => ({
          ...prev,
        }));

        if (typeof setResident === "function") {
          setResident((prev) => ({
            ...prev,
            fullName: form.fullName,
            gender: form.gender,
            dateOfBirth: form.dateOfBirth,
            identityId: form.identityId,
          }));
        }
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
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </div>

      {isResident && (
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
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <label>Birthdate</label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
          />

          <label>Identity ID</label>
          <input
            name="identityId"
            value={form.identityId}
            onChange={handleChange}
          />
        </div>
      )}

      {!isResident && (
        <div className="profile-section profile-note">
          <h3>Personal Information</h3>
          <p>
            This role can only update account credentials for now. A personal
            profile form for <b>{rawRoleName}</b> is not available because the
            backend has not exposed that data yet.
          </p>
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
