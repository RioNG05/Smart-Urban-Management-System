import React, { useState, useEffect } from "react";
import { FaUsers, FaEdit, FaUserPlus, FaSearch, FaLock, FaUnlock, FaUserEdit } from "react-icons/fa";
import AdminPagination from "../../common/AdminPagination";
import {
  createAccount,
  createResident,
  deleteAccountById,
  deleteResidentById,
  getAccounts,
  getResidents,
  updateAccountById,
  updateResidentById,
} from "../../../services/adminResidentService";
import { getApartments } from "../../../services/apartmentService";
import {
  createStayAtHistory,
  getStayHistoryByResidentId,
  updateStayAtHistoryById,
} from "../../../services/adminService";
import { paginateItems } from "./utils";

const ResidentAccount = () => {
  const DEFAULT_MOVE_OUT_DATE = "2099-12-31";
  const emptyForm = {
    residentId: null,
    accountId: null,
    stayHistoryId: null,
    fullName: "",
    gender: "",
    dateOfBirth: "",
    identityId: "",
    phoneNumber: "",
    email: "",
    username: "",
    password: "",
    isActive: true,
    apartment: "",
    apartmentId: "",
    currentApartmentId: "",
  };

  const [residents, setResidents] = useState([]);
  const [apartmentOptions, setApartmentOptions] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const pageSize = 8;

  const resetForm = () => {
    setFormData(emptyForm);
    setIsEditMode(false);
    setShowCreateForm(false);
  };

  const getApartmentLabel = (apartment) => {
    if (!apartment) {
      return "Unassigned apartment";
    }

    const roomNumber = apartment?.roomNumber ?? apartment?.id ?? "N/A";
    const floorNumber = apartment?.floorNumber;

    return floorNumber !== null && floorNumber !== undefined
      ? `Room ${roomNumber} - Floor ${floorNumber}`
      : `Room ${roomNumber}`;
  };

  const getPrimaryApartmentAssignment = (apartments = []) =>
    apartments.find((item) => {
      if (!item?.moveOut) {
        return true;
      }

      return new Date(item.moveOut).getTime() >= Date.now();
    }) ??
    [...apartments].sort(
      (a, b) => new Date(b?.moveIn || 0).getTime() - new Date(a?.moveIn || 0).getTime(),
    )[0] ??
    null;

  const normalizeResidentRecord = (resident, accountMap, stayHistoryMap) => {
    const accountId = resident?.account?.id ?? resident?.accountId ?? null;
    const account = accountMap.get(accountId) ?? resident?.account ?? null;
    const stayHistory = stayHistoryMap.get(resident?.id ?? null) ?? [];

    return {
      residentId: resident?.id ?? null,
      accountId,
      fullName: resident?.fullName ?? "",
      gender: resident?.gender ?? "",
      dateOfBirth: resident?.dateOfBirth ?? "",
      identityId: resident?.identityId ?? "",
      phoneNumber: resident?.phoneNumber ?? "",
      email: account?.email ?? "",
      username: account?.username ?? "",
      roleName: account?.role?.roleName ?? "RESIDENT",
      isActive: account?.isActive ?? false,
      apartments: stayHistory.map((entry) => ({
        stayHistoryId: entry?.id ?? null,
        apartmentId: entry?.apartment?.id ?? entry?.apartmentId ?? null,
        roomNumber:
          entry?.apartment?.roomNumber ?? entry?.apartmentId ?? "N/A",
        floorNumber: entry?.apartment?.floorNumber ?? null,
        moveIn: entry?.moveIn ?? null,
        moveOut: entry?.moveOut ?? null,
      })),
    };
  };

  const loadResidentData = async () => {
    setIsLoading(true);

    try {
      const [residentList, accountList, apartmentList] = await Promise.all([
        getResidents(),
        getAccounts(),
        getApartments(),
      ]);
      const accountMap = new Map(
        accountList.map((account) => [account.id, account]),
      );

      const stayHistoryResponses = await Promise.all(
        residentList.map(async (resident) => {
          const residentId = resident?.id;

          if (!residentId) {
            return [null, []];
          }

          try {
            const stayHistory = await getStayHistoryByResidentId(residentId);
            return [residentId, stayHistory];
          } catch (error) {
            return [residentId, []];
          }
        }),
      );

      const stayHistoryMap = new Map(
        stayHistoryResponses.filter(([residentId]) => residentId !== null),
      );

      setApartmentOptions(
        apartmentList.map((apartment) => ({
          id: apartment.id,
          label: getApartmentLabel(apartment),
        })),
      );
      setResidents(
        residentList
          .map((resident) =>
            normalizeResidentRecord(resident, accountMap, stayHistoryMap),
          )
          .sort((a, b) => Number(b.residentId ?? 0) - Number(a.residentId ?? 0)),
      );
      setFeedback({ type: "", message: "" });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Could not load resident list from backend.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResidentData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (resident) => {
    const primaryApartment = getPrimaryApartmentAssignment(resident.apartments);

    setFormData({
      residentId: resident.residentId,
      accountId: resident.accountId,
      stayHistoryId: primaryApartment?.stayHistoryId ?? null,
      fullName: resident.fullName,
      gender: resident.gender,
      dateOfBirth: resident.dateOfBirth,
      identityId: resident.identityId,
      phoneNumber: resident.phoneNumber,
      email: resident.email,
      username: resident.username,
      password: "",
      isActive: resident.isActive,
      apartment: primaryApartment?.roomNumber
        ? String(primaryApartment.roomNumber)
        : "",
      apartmentId:
        primaryApartment?.apartmentId !== null &&
        primaryApartment?.apartmentId !== undefined
          ? String(primaryApartment.apartmentId)
          : "",
      currentApartmentId:
        primaryApartment?.apartmentId !== null &&
        primaryApartment?.apartmentId !== undefined
          ? String(primaryApartment.apartmentId)
          : "",
    });
    setIsEditMode(true);
    setShowCreateForm(true);
    setFeedback({ type: "", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateForm = () => {
    if (
      !formData.fullName ||
      !formData.dateOfBirth ||
      !formData.identityId ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.username
    ) {
      setFeedback({
        type: "error",
        message:
          "Please enter full name, DOB, ID card, phone number, email and username.",
      });
      return false;
    }

    if (!isEditMode && !formData.password) {
      setFeedback({
        type: "error",
        message: "Creating a new resident requires an account password.",
      });
      return false;
    }

    if (!isEditMode && formData.password.length < 8) {
      setFeedback({
        type: "error",
        message: "Password must be at least 8 characters.",
      });
      return false;
    }

    if (
      !isEditMode &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).+$/.test(
        formData.password,
      )
    ) {
      setFeedback({
        type: "error",
        message:
          "Password must include uppercase, lowercase, number and special character.",
      });
      return false;
    }

    return true;
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    let createdAccountId = null;
    let createdResidentId = null;

    try {
      if (isEditMode) {
        const apartmentChanged =
          String(formData.apartmentId || "") !==
          String(formData.currentApartmentId || "");

        const accountPayload = {
          email: formData.email,
          username: formData.username,
          isActive: formData.isActive,
        };

        if (formData.password) {
          accountPayload.password = formData.password;
        }

        await updateAccountById(formData.accountId, accountPayload);
        await updateResidentById(formData.residentId, {
          fullName: formData.fullName,
          gender: formData.gender || null,
          dateOfBirth: formData.dateOfBirth,
          identityId: formData.identityId,
          phoneNumber: formData.phoneNumber,
        });

        if (apartmentChanged) {
          if (!formData.apartmentId) {
            throw new Error("Please select an apartment assignment.");
          }

          if (formData.stayHistoryId) {
            await updateStayAtHistoryById(formData.stayHistoryId, {
              apartmentId: Number(formData.apartmentId),
            });
          } else {
            await createStayAtHistory({
              residentId: formData.residentId,
              apartmentId: Number(formData.apartmentId),
              moveIn: new Date().toISOString().slice(0, 10),
              moveOut: DEFAULT_MOVE_OUT_DATE,
            });
          }
        }

        setFeedback({
          type: "success",
          message: apartmentChanged
            ? "Resident, account, and apartment assignment updated successfully."
            : "Resident and account information updated successfully.",
        });
      } else {
        const account = await createAccount({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          isActive: formData.isActive,
        });
        createdAccountId = account.id;

        const resident = await createResident({
          fullName: formData.fullName,
          gender: formData.gender || null,
          dateOfBirth: formData.dateOfBirth,
          identityId: formData.identityId,
          phoneNumber: formData.phoneNumber,
          accountId: account.id,
        });
        createdResidentId = resident.id;

        if (formData.apartmentId) {
          await createStayAtHistory({
            residentId: resident.id,
            apartmentId: Number(formData.apartmentId),
            moveIn: new Date().toISOString().slice(0, 10),
            moveOut: DEFAULT_MOVE_OUT_DATE,
          });
        }

        setFeedback({
          type: "success",
          message: formData.apartmentId
            ? "New resident created and apartment assigned successfully."
            : "New resident created and account linked successfully.",
        });
      }

      resetForm();
      await loadResidentData();
    } catch (error) {
      if (!isEditMode && createdResidentId) {
        try {
          await deleteResidentById(createdResidentId);
        } catch (rollbackError) {
          console.error("Rollback resident creation failed:", rollbackError);
        }
      }

      if (!isEditMode && createdAccountId) {
        try {
          await deleteAccountById(createdAccountId);
        } catch (rollbackError) {
          console.error("Rollback account creation failed:", rollbackError);
        }
      }

      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while saving resident data.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (resident) => {
    if (
      !window.confirm(
        `Are you sure you want to delete resident ${resident.fullName}?`,
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      await deleteResidentById(resident.residentId);

      if (resident.accountId) {
        await deleteAccountById(resident.accountId);
      }

      setFeedback({
        type: "success",
        message: "Resident and linked account deleted.",
      });

      if (formData.residentId === resident.residentId) {
        resetForm();
      }

      await loadResidentData();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message || "Could not delete this resident.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLock = async (resident) => {
    if (!resident.accountId) {
      setFeedback({
        type: "error",
        message: "This resident does not have an account to lock/unlock.",
      });
      return;
    }

    const action = resident.isActive ? "Lock" : "Unlock";
    if (
      !window.confirm(
        `Are you sure you want to ${action} the account for resident ${resident.fullName}?`,
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      await updateAccountById(resident.accountId, {
        email: resident.email,
        username: resident.username,
        isActive: !resident.isActive,
      });

      setFeedback({
        type: "success",
        message: resident.isActive
          ? "Resident account locked."
          : "Resident account unlocked.",
      });

      await loadResidentData();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message || "Could not change account status.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredResidents = residents.filter((resident) => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    // Explicitly collect all searchable strings from the resident record
    const searchableFields = [
      resident.fullName,
      resident.email,
      resident.username,
      resident.identityId,
      resident.phoneNumber,
    ];

    // Add all apartment-related numbers/names
    resident.apartments.forEach(apt => {
      if (apt.roomNumber) searchableFields.push(String(apt.roomNumber));
      if (apt.floorNumber) searchableFields.push(String(apt.floorNumber));
    });

    return searchableFields
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, residents.length]);

  const paginatedResidents = paginateItems(
    filteredResidents,
    currentPage,
    pageSize,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredResidents.length / pageSize),
  );

  return (
    <div className="admin-lock-resident-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>

      {/* NEW MODERN COMPACT BANNER WITH SEARCH */}
      <div className="account-banner-container" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div className="account-banner-icon-box">
            <FaUsers />
          </div>
          <div className="account-banner-info-group">
            <p>RESIDENT DATABASE MANAGEMENT</p>
            <h3 style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              {residents.length} <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>Residents in system database</span>
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="account-banner-search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search username, residents, ID Card, apartment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            className={`admin-btn-add ${showCreateForm ? 'active' : ''}`}
            onClick={() => {
              if (showCreateForm) resetForm();
              else setShowCreateForm(true);
            }}
            style={{
              width: 'auto',
              padding: '0 18px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '700',
              background: showCreateForm ? '#ef4444' : 'var(--admin-primary)',
              borderRadius: '10px'
            }}
          >
            {showCreateForm ? 'CLOSE FORM' : 'ADD NEW RESIDENT'}
          </button>
        </div>
      </div>

      {/* FORM SECTION - ISSUING NEW ACCOUNT */}
      {(showCreateForm || isEditMode) && 
        <section className="staff-form-container" style={{
          padding: '45px',
          borderRadius: '28px',
          marginBottom: '40px',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
          background: 'white'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
          <div style={{
            width: '45px',
            height: '45px',
            background: 'var(--admin-primary-light)',
            color: 'var(--admin-primary)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            {isEditMode ? <FaUserEdit /> : <FaUserPlus />}
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '20px', color: 'var(--admin-text-main)' }}>
              {isEditMode ? "Update Resident Detailed Record" : "Official Resident Identity Registration"}
            </h4>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
              {isEditMode
                ? "Modifying existing resident data and system access privileges."
                : "Establishing a new legal resident record in the building's central database."}
            </p>
          </div>
        </div>

        {feedback.message && (
          <div className={`admin-feedback ${feedback.type === "error" ? "error" : "success"}`} style={{ padding: '15px 25px', borderRadius: '16px', marginBottom: '30px' }}>
            {feedback.message}
          </div>
        )}

        {/* Section 1: Personal Information */}
        <div className="form-section-title">
          <FaUnlock style={{ fontSize: '12px' }} /> PERSONAL IDENTITY DETAILS
        </div>
        <div className="resident-grid-form" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px 35px', marginBottom: '40px' }}>
          <div className="form-group">
            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>FULL LEGAL NAME</label>
            <input
              className="professional-form-input"
              type="text"
              value={formData.fullName}
              placeholder="Enter full name..."
              onChange={(e) => handleInputChange("fullName", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>ID CARD / PASSPORT NO.</label>
            <input
              className="professional-form-input"
              type="text"
              value={formData.identityId}
              placeholder="12-digit number..."
              onChange={(e) => handleInputChange("identityId", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>DATE OF BIRTH</label>
            <input
              className="professional-form-input"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>GENDER</label>
            <select
              className="professional-form-input"
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="form-section-title">
          <FaSearch style={{ fontSize: '12px' }} /> CONTACT & RESIDENCY INFORMATION
        </div>
        <div className="resident-grid-form" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px 35px', marginBottom: '40px' }}>
          <div className="form-group">
            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>PRIMARY EMAIL</label>
            <input
              className="professional-form-input"
              type="email"
              value={formData.email}
              placeholder="example@domain.com"
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>MOBILE NUMBER</label>
            <input
              className="professional-form-input"
              type="text"
              value={formData.phoneNumber}
              placeholder="+84..."
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>APARTMENT ASSIGNMENT</label>
            <select
              className="professional-form-input"
              value={formData.apartmentId}
              onChange={(e) => {
                const selectedOption = apartmentOptions.find(
                  (option) => String(option.id) === e.target.value,
                );

                setFormData((prev) => ({
                  ...prev,
                  apartmentId: e.target.value,
                  apartment: selectedOption?.label ?? "",
                }));
              }}
            >
              <option value="">
                Select apartment
              </option>
              {apartmentOptions.map((option) => (
                <option key={option.id} value={String(option.id)}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 3: System Access */}
        <div className="form-section-title">
          <FaLock style={{ fontSize: '12px' }} /> SYSTEM ACCOUNT CREDENTIALS
        </div>
        <div className="resident-grid-form" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px 35px' }}>
          <div className="form-group">
            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>SYSTEM USERNAME</label>
            <input
              className="professional-form-input"
              type="text"
              value={formData.username}
              placeholder="Choose unique username..."
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
              {isEditMode ? "RESET PASSWORD (OPTIONAL)" : "ACCOUNT PASSWORD"}
            </label>
            <input
              className="professional-form-input"
              type="password"
              value={formData.password}
              placeholder="Secure access key..."
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '45px', borderTop: '1px solid var(--admin-border-soft)', paddingTop: '30px', gap: '15px' }}>
          {isEditMode && (
            <button
              className="btn-cancel-resident"
              style={{
                padding: '0 35px',
                height: '52px',
                borderRadius: '16px',
                fontWeight: 700
              }}
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              ABORT CHANGES
            </button>
          )}
          <button
            className="admin-btn-add"
            style={{
              width: 'auto',
              padding: '0 50px',
              height: '52px',
              fontSize: '15px',
              fontWeight: 800,
              borderRadius: '16px',
              letterSpacing: '0.5px'
            }}
            onClick={handleAddOrUpdate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "PROCESSING..." : isEditMode ? "UPDATE DATA" : "REGISTER RESIDENT"}
          </button>
        </div>
      </section>
      }

      {/* LIST SECTION - ISSUED ACCOUNTS */}
      <section className="admin-table-wrapper" style={{ borderLeft: '6px solid #c98b3c' }}>
        <div className="resident-list-header">
          <h4 style={{ margin: 0, fontWeight: 800, fontSize: '18px' }}>Resident Detailed Records</h4>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-custom-table bordered">
            <thead>
              <tr>
                <th style={{ width: '12%' }}>USERNAME</th>
                <th style={{ width: '18%' }}>OWNER</th>
                <th style={{ width: '15%' }}>PHONE</th>
                <th style={{ width: '10%' }}>APARTMENT</th>
                <th style={{ width: '9%' }}>GENDER</th>
                <th style={{ width: '13%' }}>ID CARD</th>
                <th style={{ width: '10%', textAlign: 'center' }}>STATUS</th>
                <th style={{ width: '13%', textAlign: "center" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="8" style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>Loading resident data...</td></tr>
              ) : filteredResidents.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>No matching residents found.</td></tr>
              ) : (
                paginatedResidents.map((resident) => (
                  <tr key={resident.residentId} style={{ opacity: resident.isActive ? 1 : 0.65 }}>
                    <td><span style={{ fontWeight: 800, fontSize: '14px' }}>{resident.username}</span></td>
                    <td><span style={{ color: 'var(--admin-text-main)', fontSize: '14px' }}>{resident.fullName}</span></td>
                    <td><span style={{ fontSize: '13px', color: '#64748b' }}>{resident.phoneNumber || "N/A"}</span></td>
                    <td>
                      {resident.apartments.length > 0 ? (
                        <span className="apartment-tag-orange">
                          {resident.apartments[0].roomNumber}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>N/A</span>
                      )}
                    </td>
                    <td>{resident.gender || "Other"}</td>
                    <td><span style={{ fontSize: '13px', color: '#64748b' }}>{resident.identityId || "N/A"}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-badge ${resident.isActive ? 'approved' : 'denied'}`} style={{ fontSize: '10px', padding: '4px 10px' }}>
                        {resident.isActive ? "ACTIVE" : "LOCKED"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          className="action-btn-styled"
                          onClick={() => handleEditClick(resident)}
                          disabled={isSubmitting}
                          title="Edit Resident"
                        >
                          <FaUserEdit style={{ color: '#64748b' }} />
                        </button>
                        <button
                          className="action-btn-styled"
                          style={{ color: resident.isActive ? 'var(--admin-danger)' : 'var(--admin-success)' }}
                          onClick={() => handleToggleLock(resident)}
                          disabled={isSubmitting}
                          title={resident.isActive ? "Lock Account" : "Unlock Account"}
                        >
                          {resident.isActive ? <FaUnlock /> : <FaLock />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredResidents.length)} of {filteredResidents.length} residents
          </div>
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredResidents.length}
            pageSize={pageSize}
            itemLabel="residents"
          />
        </div>
      </section>
    </div>
  );
};

export default ResidentAccount;
