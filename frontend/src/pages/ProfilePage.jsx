import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import ProfileView from "../components/sections/profile/ProfileView";
import ProfileEdit from "../components/sections/profile/ProfileEdit";

import "../styles/profile.css";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);

  const user = {
    email: "admin@tems.com",
    identifyId: "ID123456",
    username: "admin",
    fullName: "Dung Dang Duc",
    birthdate: "2004-06-21",
    gender: "Male",
  };

  return (
    <>
      <Navbar />

      <div className="profile-page">
        {!editMode ? (
          <ProfileView user={user} setEditMode={setEditMode} />
        ) : (
          <ProfileEdit user={user} setEditMode={setEditMode} />
        )}
      </div>

      <Footer />
    </>
  );
}
