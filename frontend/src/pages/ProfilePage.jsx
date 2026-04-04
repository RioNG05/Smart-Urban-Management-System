import { useState, useEffect } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import ProfileView from "../components/sections/profile/ProfileView";
import ProfileEdit from "../components/sections/profile/ProfileEdit";
import UserHouses from "../components/sections/profile/UserHouses";
import { getMyAccount, getMyProfile } from "../services/profileService";
import { getContractsByAccountId } from "../services/adminResidentService";
import { getUtilitiesInvoicesByApartmentId } from "../services/myHomeService";

import "../styles/profile.css";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB");

const formatDeadline = (value) => {
  if (!value) return "No contract deadline";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "No contract deadline";

  return dateFormatter.format(parsedDate);
};

const buildHouseSummary = (contract, invoices) => {
  const paidAmount = invoices
    .filter((invoice) => Number(invoice?.status) === 1)
    .reduce((sum, invoice) => sum + Number(invoice?.totalAmount || 0), 0);

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice?.totalAmount || 0),
    0
  );

  const unpaidAmount = Math.max(totalAmount - paidAmount, 0);
  const progress = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  return {
    id: contract?.id ?? contract?.apartment?.id,
    name: `Apartment ${contract?.apartment?.roomNumber ?? contract?.apartment?.id ?? "N/A"}`,
    totalCost: totalAmount,
    paidAmount,
    unpaidAmount,
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter((invoice) => Number(invoice?.status) === 1).length,
    deadline: formatDeadline(contract?.endDate),
    progress,
    floorNumber: contract?.apartment?.floorNumber ?? null,
  };
};

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [account, setAccount] = useState(null);
  const [resident, setResident] = useState(null);
  const [houses, setHouses] = useState([]);
  const [housesLoading, setHousesLoading] = useState(true);

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

      loadHouses(acc.id);

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

  const loadHouses = async (accountId) => {
    if (!accountId) {
      setHouses([]);
      setHousesLoading(false);
      return;
    }

    setHousesLoading(true);

    try {
      const contracts = await getContractsByAccountId(accountId);
      const uniqueContracts = contracts.reduce((acc, contract) => {
        const apartmentId = contract?.apartment?.id;

        if (!apartmentId) return acc;
        if (acc.some((item) => item?.apartment?.id === apartmentId)) return acc;

        acc.push(contract);
        return acc;
      }, []);

      const houseSummaries = await Promise.all(
        uniqueContracts.map(async (contract) => {
          const apartmentId = contract?.apartment?.id;
          const invoices = apartmentId
            ? await getUtilitiesInvoicesByApartmentId(apartmentId)
            : [];

          return buildHouseSummary(contract, invoices);
        })
      );

      setHouses(
        houseSummaries.map((house) => ({
          ...house,
          totalCostLabel: currencyFormatter.format(house.totalCost || 0),
          paidAmountLabel: currencyFormatter.format(house.paidAmount || 0),
          unpaidAmountLabel: currencyFormatter.format(house.unpaidAmount || 0),
        }))
      );
    } catch (error) {
      console.error(error);
      setHouses([]);
    } finally {
      setHousesLoading(false);
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
            <UserHouses houses={houses} loading={housesLoading} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
