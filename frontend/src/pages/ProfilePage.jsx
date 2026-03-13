import { useState, useEffect } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import ProfileView from "../components/sections/profile/ProfileView";
import ProfileEdit from "../components/sections/profile/ProfileEdit";
import UserHouses from "../components/sections/profile/UserHouses";
import { getMyAccount, getMyProfile } from "../services/profileService";

import "../styles/profile.css";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [account, setAccount] = useState(null);

  const [resident, setResident] = useState(null);

  const houses = [
    { id: 1, name: "Green Villa", totalCost: 120000, deadline: "2026-12-01" },
  ];

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      const acc = await getMyAccount();
      const profile = await getMyProfile();

      if (!acc) return;

      setAccount({
        email: acc.email || "",
        username: acc.username || "",
        role: acc?.role?.roleName || "USER",
      });

      setResident(profile || null);
    } catch (err) {
      console.error(err);
    }
  };

  if (!account)
    return <div className="profile-loading">Loading profile...</div>;

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <div className="profile-layout">
          <div className="profile-left">
            {!editMode ? (
              <ProfileView
                account={account}
                resident={resident}
                setEditMode={setEditMode}
              />
            ) : (
              <ProfileEdit
                account={account}
                setAccount={setAccount}
                setEditMode={setEditMode}
              />
            )}
          </div>

          <div className="profile-right">
            <UserHouses houses={houses} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
