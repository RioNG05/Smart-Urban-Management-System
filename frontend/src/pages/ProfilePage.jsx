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
      const roleName = acc?.role?.roleName?.toUpperCase();

      if (!acc) return;

      setAccount({
        id: acc.id,
        email: acc.email || "",
        username: acc.username || "",
        role: acc?.role || null,
        isActive: acc?.isActive ?? true,
      });

      if (roleName === "RESIDENT") {
        try {
          const profile = await getMyProfile();
          setResident(profile || null);
        } catch (profileErr) {
          console.error(profileErr);
          setResident(null);
        }
      } else {
        setResident(null);
      }
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
                resident={resident}
                setAccount={setAccount}
                setResident={setResident}
                loadAccount={loadAccount}
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
