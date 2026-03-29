import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom"; // THÊM NÀY ĐỂ KẾT NỐI VỚI SIDEBAR
import StaffServiceMainContent from '../staff/StaffServiceMainContent';
import StaffSecurityMainContent from '../staff/StaffSecurityMainContent';
import "../styles/admin.css";
import {
  FaUsers, FaUserPlus, FaSearch, FaTrashAlt, FaEdit, FaCheckCircle, FaLock, FaCalendarAlt,
  FaMoneyBillWave, FaSyncAlt, FaCreditCard, FaFilter, FaEye, FaPlus, FaTimes,
  FaBuilding, FaLayerGroup,
  FaWrench,
  FaStar
} from 'react-icons/fa';
import { FaFileContract, FaFileUpload, FaImage, FaChevronDown, FaUnlock, FaUserEdit } from 'react-icons/fa';
import {
  createAccount,
  createResident,
  deleteAccountById,
  deleteResidentById,
  getAccounts,
  getContractsByAccountId,
  getResidents,
  updateAccountById,
  updateResidentById,
} from "../services/adminResidentService";
import api from "../services/api";
import { useAuth } from "../components/sections/auth/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- ADMIN ROLE MANAGER ---
export const AdminRoleManager = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "ADMIN",
      permissions: ["READ", "CREATE", "UPDATE", "DELETE"],
      status: "Active",
    },
    { id: 2, name: "USER", permissions: ["READ"], status: "Active" },
    {
      id: 3,
      name: "MANAGER",
      permissions: ["READ", "CREATE", "UPDATE"],
      status: "Active",
    },
  ]);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [error, setError] = useState("");
  const permissionOptions = ["READ", "CREATE", "UPDATE", "DELETE"];

  const handleCreateRole = () => {
    const isExist = roles.some(role => role.name.toUpperCase() === newRoleName.toUpperCase());
    if (isExist) { setError("This Role name already exists!"); return; }
    if (!newRoleName) return;
    const newRole = { id: Date.now(), name: newRoleName.toUpperCase(), permissions: selectedPermissions, status: "Active" };
    setRoles([...roles, newRole]);
    setNewRoleName(""); setSelectedPermissions([]); setError("");
  };

  const toggleLockRole = (id) => {
    setRoles(roles.map(role => role.id === id ? { ...role, status: role.status === "Active" ? "Locked" : "Active" } : role));
  };

  const handleDeleteRole = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };

  const togglePermission = (perm) => {
    setSelectedPermissions(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
  };

  return (
    <div className="role-manager-container">
      <section className="create-role-section" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=1000')" }}>
        <div className="create-role-content">
          <h3>System Role Configuration (RBAC)</h3>
          <div className="role-input-group">
            <label>Role Name:</label>
            <input type="text" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="E.g., MANAGER, EDITOR, STAFF" className={`role-name-input ${error ? "input-error" : ""}`} />
            {error && <p style={{ color: '#feb2b2', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
          </div>
          <div className="permission-checkbox-list">
            <label>Assign Permissions:</label>
            <div className="checkbox-group">
              {permissionOptions.map(perm => (
                <button key={perm} type="button" className={`btn-perm ${selectedPermissions.includes(perm) ? "active" : ""}`} onClick={() => togglePermission(perm)}>{perm}</button>
              ))}
            </div>
          </div>
          <button className="btn-submit-role" onClick={handleCreateRole}>Create New Role</button>
        </div>
      </section>
      <section className="role-list-section">
        <h4>Role & Permissions Matrix</h4>
        <div className="admin-table-wrapper">
          <table className="admin-custom-table">
            <thead>
              <tr><th>Role</th><th>Permissions</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id}>
                  <td><strong>{role.name}</strong></td>
                  <td>
                    <div className="permission-tags">
                      {role.permissions.map(p => (<span key={p} className={`badge badge-${p.toLowerCase()}`}>{p}</span>))}
                    </div>
                  </td>
                  <td><span className={`status-badge ${role.status === "Active" ? "active" : "locked"}`}>{role.status}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-table-lock" onClick={() => toggleLockRole(role.id)}>{role.status === "Active" ? "🔒 Lock" : "🔓 Unlock"}</button>
                      <button className="btn-table-delete" onClick={() => handleDeleteRole(role.id)}>🗑️ Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// --- ADMIN LOCK RESIDENT ---
export const AdminLockResident = () => {
  const emptyForm = {
    residentId: null,
    accountId: null,
    fullName: "",
    gender: "",
    dateOfBirth: "",
    identityId: "",
    email: "",
    username: "",
    password: "",
    isActive: true,
    apartment: "",
  };

  const [residents, setResidents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const resetForm = () => {
    setFormData(emptyForm);
    setIsEditMode(false);
  };

  const normalizeResidentRecord = (resident, accountMap, contractsMap) => {
    const accountId = resident?.account?.id ?? resident?.accountId ?? null;
    const account = accountMap.get(accountId) ?? resident?.account ?? null;
    const contracts = contractsMap.get(accountId) ?? [];

    return {
      residentId: resident?.id ?? null,
      accountId,
      fullName: resident?.fullName ?? "",
      gender: resident?.gender ?? "",
      dateOfBirth: resident?.dateOfBirth ?? "",
      identityId: resident?.identityId ?? "",
      email: account?.email ?? "",
      username: account?.username ?? "",
      roleName: account?.role?.roleName ?? "RESIDENT",
      isActive: account?.isActive ?? false,
      apartments: contracts.map((contract) => ({
        contractId: contract?.id,
        roomNumber: contract?.apartment?.roomNumber ?? contract?.apartmentId ?? "N/A",
        floorNumber: contract?.apartment?.floorNumber ?? null,
        contractType: contract?.contractType ?? "Unknown",
        status: contract?.status,
      })),
    };
  };

  const loadResidentData = async () => {
    setIsLoading(true);

    try {
      const [residentList, accountList] = await Promise.all([getResidents(), getAccounts()]);
      const accountMap = new Map(accountList.map((account) => [account.id, account]));

      const contractResponses = await Promise.all(
        residentList.map(async (resident) => {
          const accountId = resident?.account?.id ?? resident?.accountId;

          if (!accountId) {
            return [null, []];
          }

          try {
            const contracts = await getContractsByAccountId(accountId);
            return [accountId, contracts];
          } catch (error) {
            return [accountId, []];
          }
        })
      );

      const contractsMap = new Map(
        contractResponses.filter(([accountId]) => accountId !== null)
      );

      setResidents(
        residentList.map((resident) =>
          normalizeResidentRecord(resident, accountMap, contractsMap)
        )
      );
      setFeedback({ type: "", message: "" });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.response?.data?.message || "Could not load resident list from backend.",
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
    setFormData({
      residentId: resident.residentId,
      accountId: resident.accountId,
      fullName: resident.fullName,
      gender: resident.gender,
      dateOfBirth: resident.dateOfBirth,
      identityId: resident.identityId,
      email: resident.email,
      username: resident.username,
      password: "",
      isActive: resident.isActive,
      apartment: resident.apartments.length > 0 ? resident.apartments[0].roomNumber : "",
    });
    setIsEditMode(true);
    setFeedback({ type: "", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.dateOfBirth || !formData.identityId || !formData.email || !formData.username) {
      setFeedback({
        type: "error",
        message: "Please enter full name, DOB, ID card, email and username.",
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

    return true;
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

<<<<<<< HEAD
export const AdminLockResident = () => {
    const emptyForm = {
        residentId: null,
        accountId: null,
        fullName: "",
        gender: "",
        dateOfBirth: "",
        identityId: "",
        phone: "",
        username: "",
        password: "",
        isActive: true,
    };

    const [residents, setResidents] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    const resetForm = () => {
        setFormData(emptyForm);
        setIsEditMode(false);
    };

    const normalizeResidentRecord = (resident, accountMap, contractsMap) => {
        const accountId = resident?.account?.id ?? resident?.accountId ?? null;
        const account = accountMap.get(accountId) ?? resident?.account ?? null;
        const contracts = contractsMap.get(accountId) ?? [];

        return {
            residentId: resident?.id ?? null,
            accountId,
            fullName: resident?.fullName ?? "",
            gender: resident?.gender ?? "",
            dateOfBirth: resident?.dateOfBirth ?? "",
            identityId: resident?.identityId ?? "",
            phone: account?.phone ?? account?.email ?? "",
            username: account?.username ?? "",
            roleName: account?.role?.roleName ?? "RESIDENT",
            isActive: account?.isActive ?? false,
            apartments: contracts.map((contract) => ({
                contractId: contract?.id,
                roomNumber: contract?.apartment?.roomNumber ?? contract?.apartmentId ?? "N/A",
                floorNumber: contract?.apartment?.floorNumber ?? null,
                contractType: contract?.contractType ?? "Unknown",
                status: contract?.status,
            })),
=======
    try {
      if (isEditMode) {
        const accountPayload = {
          email: formData.email,
          username: formData.username,
          isActive: formData.isActive,
>>>>>>> dev
        };

        if (formData.password) {
          accountPayload.password = formData.password;
        }

<<<<<<< HEAD
    useEffect(() => {
        loadResidentData();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditClick = (resident) => {
        setFormData({
            residentId: resident.residentId,
            accountId: resident.accountId,
            fullName: resident.fullName,
            gender: resident.gender,
            dateOfBirth: resident.dateOfBirth,
            identityId: resident.identityId,
            phone: resident.phone,
            username: resident.username,
            password: "",
            isActive: resident.isActive,
=======
        await updateAccountById(formData.accountId, accountPayload);
        await updateResidentById(formData.residentId, {
          fullName: formData.fullName,
          gender: formData.gender || null,
          dateOfBirth: formData.dateOfBirth,
          identityId: formData.identityId,
>>>>>>> dev
        });

<<<<<<< HEAD
    const validateForm = () => {
        if (!formData.fullName || !formData.dateOfBirth || !formData.identityId || !formData.phone || !formData.username) {
            setFeedback({
                type: "error",
                message: "Vui long nhap day du ho ten, ngay sinh, CCCD, so dien thoai va username.",
            });
            return false;
        }
=======
        setFeedback({
          type: "success",
          message: "Resident and account information updated successfully.",
        });
      } else {
        const account = await createAccount({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          isActive: formData.isActive,
        });
>>>>>>> dev

        await createResident({
          fullName: formData.fullName,
          gender: formData.gender || null,
          dateOfBirth: formData.dateOfBirth,
          identityId: formData.identityId,
          accountId: account.id,
        });

        setFeedback({
          type: "success",
          message: "New resident created and account linked successfully.",
        });
      }

      resetForm();
      await loadResidentData();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.response?.data?.message || "An error occurred while saving resident data.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (resident) => {
    if (!window.confirm(`Are you sure you want to delete resident ${resident.fullName}?`)) {
      return;
    }

<<<<<<< HEAD
        try {
            if (isEditMode) {
                const accountPayload = {
                    email: formData.phone,
                    phone: formData.phone,
                    username: formData.username,
                    isActive: formData.isActive,
                };
=======
    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });
>>>>>>> dev

    try {
      await deleteResidentById(resident.residentId);

      if (resident.accountId) {
        await deleteAccountById(resident.accountId);
      }

<<<<<<< HEAD
                setFeedback({
                    type: "success",
                    message: "Da cap nhat thong tin resident va account thanh cong.",
                });
            } else {
                const account = await createAccount({
                    email: formData.phone,
                    phone: formData.phone,
                    username: formData.username,
                    password: formData.password,
                    isActive: formData.isActive,
                });
=======
      setFeedback({
        type: "success",
        message: "Resident and linked account deleted.",
      });
>>>>>>> dev

      if (formData.residentId === resident.residentId) {
        resetForm();
      }

      await loadResidentData();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.response?.data?.message || "Could not delete this resident.",
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
    if (!window.confirm(`Are you sure you want to ${action} the account for resident ${resident.fullName}?`)) {
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
        message: error?.response?.data?.message || "Could not change account status.",
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

    return [
      resident.fullName,
      resident.email,
      resident.username,
      resident.identityId,
      ...resident.apartments.map((apartment) => String(apartment.roomNumber)),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });

<<<<<<< HEAD
        setIsSubmitting(true);
        setFeedback({ type: "", message: "" });

        try {
            await updateAccountById(resident.accountId, {
                email: resident.phone,
                phone: resident.phone,
                username: resident.username,
                isActive: !resident.isActive,
            });

            setFeedback({
                type: "success",
                message: resident.isActive
                    ? "Da khoa account cua resident."
                    : "Da mo khoa account cua resident.",
            });

            await loadResidentData();
        } catch (error) {
            setFeedback({
                type: "error",
                message: error?.response?.data?.message || "Khong the doi trang thai account.",
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

        return [
            resident.fullName,
            resident.phone,
            resident.username,
            resident.identityId,
            ...resident.apartments.map((apartment) => String(apartment.roomNumber)),
        ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword));
    });

    return (
        <div className="admin-lock-resident-container">
            <div className="resident-stats-banner">
                <div className="stats-icon-box"><FaUsers /></div>
                <div className="stats-info">
                    <p>Resident access control</p>
                    <h3>{residents.length} <span>Residents from backend API</span></h3>
                </div>
            </div>

            <section className="resident-form-section">
                <div className="admin-lock-header-row">
                    <div className="form-header admin-lock-form-title" style={{ color: isEditMode ? '#ed8936' : '#3182ce', marginBottom: 0 }}>
                        {isEditMode ? <FaEdit /> : <FaUserPlus />}
                        <span>{isEditMode ? "Edit Resident" : "Create Resident"}</span>
                    </div>
                    <button className="btn-pay-refresh" type="button" onClick={loadResidentData} disabled={isLoading || isSubmitting}>
                        <FaSyncAlt size={14} /> Refresh data
                    </button>
                </div>

                {feedback.message && (
                    <div className={`admin-feedback ${feedback.type === "error" ? "error" : "success"}`}>
                        {feedback.message}
                    </div>
                )}

                <div className="resident-grid-form admin-lock-form-grid">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={formData.fullName} placeholder="Nhap ho ten..." onChange={(e) => handleInputChange("fullName", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select value={formData.gender} onChange={(e) => handleInputChange("gender", e.target.value)}>
                            <option value="">Chon gioi tinh</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Identity ID</label>
                        <input type="text" value={formData.identityId} placeholder="CCCD / Passport" onChange={(e) => handleInputChange("identityId", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" value={formData.phone} placeholder="09xxxxxxxx" onChange={(e) => handleInputChange("phone", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={formData.username} placeholder="username" onChange={(e) => handleInputChange("username", e.target.value)} />
                    </div>
                    {!isEditMode && (
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" value={formData.password} placeholder="Mat khau" onChange={(e) => handleInputChange("password", e.target.value)} />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Account Status</label>
                        <select value={String(formData.isActive)} onChange={(e) => handleInputChange("isActive", e.target.value === "true")}>
                            <option value="true">Active</option>
                            <option value="false">Locked</option>
                        </select>
                    </div>
                </div>

                <div className="admin-lock-actions">
                    <button className={`admin-btn-add ${isEditMode ? 'mode-edit' : ''}`} onClick={handleAddOrUpdate} disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : isEditMode ? "Save Changes" : "Create Resident"}
                    </button>
                    {isEditMode && (
                        <button className="btn-table-delete" type="button" onClick={resetForm} disabled={isSubmitting}>
                            Cancel edit
                        </button>
                    )}
                </div>
            </section>

            <section className="admin-table-wrapper">
                <div className="admin-lock-header-row admin-lock-list-header">
                    <h3 className="admin-lock-section-title">Resident Directory</h3>
                    <div className="admin-lock-search">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Tim theo ten, so dien thoai, username, CCCD, can ho..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="admin-table-scroll">
                    <table className="admin-custom-table bordered">
                        <thead>
                            <tr>
                                <th>Resident</th>
                                <th>Gender</th>
                                <th>Date of Birth</th>
                                <th>Identity ID</th>
                                <th>Phone</th>
                                <th>Username</th>
                                <th>Owned Apartments</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="9" className="admin-table-empty">Dang tai du lieu tu backend...</td>
                                </tr>
                            ) : filteredResidents.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="admin-table-empty">Khong tim thay resident phu hop.</td>
                                </tr>
                            ) : (
                                filteredResidents.map((resident, index) => (
                                    <tr key={resident.residentId}>
                                        <td>
                                            <div className="admin-resident-stack">
                                                <strong>{resident.fullName}</strong>
                                                <span>Resident ID: {resident.residentId}</span>
                                            </div>
                                        </td>
                                        <td className="admin-cell-compact">{resident.gender || "N/A"}</td>
                                        <td className="admin-cell-compact">{resident.dateOfBirth || "N/A"}</td>
                                        <td className="admin-cell-compact">{resident.identityId || "N/A"}</td>
                                        <td className="admin-cell-compact">{resident.phone || "N/A"}</td>
                                        <td className="admin-cell-compact">{resident.username || "N/A"}</td>
                                        <td>
                                            {resident.apartments.length > 0 ? (
                                                <div className="admin-apartment-list">
                                                    {resident.apartments.map((apartment) => (
                                                        <div key={`${resident.residentId}-${apartment.contractId}`} className="admin-apartment-detail">
                                                            <span className="apartment-tag">
                                                                {apartment.roomNumber}
                                                                {apartment.floorNumber ? ` / Floor ${apartment.floorNumber}` : ""}
                                                            </span>
                                                            <span className="admin-apartment-meta">
                                                                {apartment.contractType} | status: {apartment.status ?? "N/A"}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="admin-subtle-text">Chua co can ho lien ket</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${resident.isActive ? "active" : "locked"}`}>
                                                {resident.isActive ? "Active" : "Locked"}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div className="action-flex admin-lock-table-actions">
                                                <button
                                                    className="admin-icon-btn edit"
                                                    onClick={() => handleEditClick(resident)}
                                                    disabled={isSubmitting}
                                                    title="Edit"
                                                    aria-label={`Edit ${resident.fullName}`}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="admin-icon-btn lock"
                                                    onClick={() => handleToggleLock(resident)}
                                                    disabled={isSubmitting}
                                                    title={resident.isActive ? "Lock" : "Unlock"}
                                                    aria-label={`${resident.isActive ? "Lock" : "Unlock"} ${resident.fullName}`}
                                                >
                                                    <FaLock />
                                                </button>
                                                <button
                                                    className="admin-icon-btn delete"
                                                    onClick={() => handleRemove(resident)}
                                                    disabled={isSubmitting}
                                                    title="Delete"
                                                    aria-label={`Delete ${resident.fullName}`}
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
=======
  return (
    <div className="admin-lock-resident-container">
      <div className="resident-stats-banner">
        <div className="stats-icon-box"><FaUsers /></div>
        <div className="stats-info">
          <p>Resident access control</p>
          <h3>{residents.length} <span>Residents from backend API</span></h3>
>>>>>>> dev
        </div>
      </div>

      <section className="resident-form-section">
        <div className="form-header">
          {isEditMode ? <FaEdit /> : <FaUserPlus />}
          <span>{isEditMode ? "Update Resident Account" : "Issue New Resident Account"}</span>
        </div>

        {feedback.message && (
          <div className={`admin-feedback ${feedback.type === "error" ? "error" : "success"}`}>
            {feedback.message}
          </div>
        )}

        <div className="resident-grid-form">
          <div className="form-group">
            <label>OWNER NAME</label>
            <input type="text" value={formData.fullName} placeholder="Enter owner name" onChange={(e) => handleInputChange("fullName", e.target.value)} />
          </div>
          <div className="form-group">
            <label>ID CARD / PASSPORT</label>
            <input type="text" value={formData.identityId} placeholder="Enter 12-digit ID number" onChange={(e) => handleInputChange("identityId", e.target.value)} />
          </div>
          <div className="form-group">
            <label>USERNAME</label>
            <input type="text" value={formData.username} placeholder="Enter username" onChange={(e) => handleInputChange("username", e.target.value)} />
          </div>
          <div className="form-group">
            <label>GENDER</label>
            <select value={formData.gender} onChange={(e) => handleInputChange("gender", e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>DATE OF BIRTH</label>
            <input type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} />
          </div>
          <div className="form-group">
            <label>APARTMENT NO.</label>
            <input type="text" value={formData.apartment} placeholder="Enter apartment number" onChange={(e) => handleInputChange("apartment", e.target.value)} />
          </div>
        </div>

        <div className="admin-lock-actions" style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-add-resident" onClick={handleAddOrUpdate} disabled={isSubmitting}>
            {isSubmitting ? "PROCESSING..." : isEditMode ? "CONFIRM UPDATE" : "ISSUE ACCOUNT"}
          </button>
          {isEditMode && (
            <button className="btn-cancel-resident" type="button" onClick={resetForm} disabled={isSubmitting}>
              CANCEL
            </button>
          )}
        </div>
      </section>

      <section className="admin-table-wrapper">
        <div className="admin-lock-header-row">
          <h3 className="admin-lock-section-title">Issued Accounts List</h3>
          <div className="admin-lock-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-custom-table bordered">
            <thead>
              <tr>
                <th>USERNAME</th>
                <th>OWNER</th>
                <th>APARTMENT</th>
                <th>GENDER</th>
                <th>DOB</th>
                <th>ID CARD</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'center' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Loading data from server...</td>
                </tr>
              ) : filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No matching residents found.</td>
                </tr>
              ) : (
                filteredResidents.map((resident) => (
                  <tr key={resident.residentId} style={{ opacity: resident.isActive ? 1 : 0.7, backgroundColor: resident.isActive ? 'transparent' : '#f8fafc' }}>
                    <td><strong>{resident.username}</strong></td>
                    <td>{resident.fullName}</td>
                    <td>
                      {resident.apartments.length > 0 ? (
                        <span className="apartment-tag">{resident.apartments[0].roomNumber}</span>
                      ) : (
                        <span className="admin-subtle-text">N/A</span>
                      )}
                    </td>
                    <td>{resident.gender || "Other"}</td>
                    <td>{resident.dateOfBirth || "N/A"}</td>
                    <td>{resident.identityId || "N/A"}</td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        background: resident.isActive ? '#dcfce7' : '#fee2e2',
                        color: resident.isActive ? '#10b981' : '#ef4444'
                      }}>
                        {resident.isActive ? "Active" : "Locked"}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-flex">
                        <button
                          className="btn-table-edit"
                          onClick={() => handleEditClick(resident)}
                          disabled={isSubmitting}
                          title="Edit Account"
                        >
                          <FaUserEdit />
                        </button>
                        <button
                          className={resident.isActive ? "btn-reject-mini" : "btn-approve-mini"}
                          onClick={() => handleToggleLock(resident)}
                          disabled={isSubmitting}
                          title={resident.isActive ? "Lock Account" : "Unlock Account"}
                        >
                          {resident.isActive ? <FaLock /> : <FaUnlock />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// --- TẠO HỢP ĐỒNG ---
export const AdminCreateContract = () => {
  const { user } = useAuth();

  const [apartmentInfo, setApartmentInfo] = useState(null);
  const [formData, setFormData] = useState({
    floorNumber: "",
    roomNumber: "",
    apartmentName: "",
    apartmentId: null,
    username: "",
    accountId: null,
    contractType: "Rent",
    startDate: "",
    endDate: "",
    monthlyRent: "",
  });

  const handleAddContract = async () => {

    console.log(user)
    const payload = {
      apartmentId: formData.apartmentId,
      accountId: formData.accountId,
      contractType: formData.contractType,
      startDate: formData.startDate,
      ...(formData.contractType === "Rent" && {
        endDate: formData.endDate,
        monthlyRent: Number(formData.monthlyRent),
      }),
      createdById: user.id,
      status: 1,
    };

    try {
      await api.post("/api/contracts", payload);
      alert("Thêm hợp đồng thành công!");
    } catch {
      alert("Lỗi khi thêm hợp đồng!");
    }
  };

  return (
    <div className="admin-lock-resident-container">
      <div
        className="resident-stats-banner"
        style={{
          background: "linear-gradient(135deg, #1a202c 0%, #4a5568 100%)",
        }}
      >
        <div className="stats-icon-box">
          <FaFileContract />
        </div>
        <div className="stats-info">
          <p>Hệ thống Quản lý Đô thị</p>
          <h3>Khởi tạo Hợp đồng Mới</h3>
        </div>
      </div>
      <section className="resident-form-section">
        <div className="form-header">
          <FaPlus /> <span>Biểu mẫu hợp đồng pháp lý</span>
        </div>

        {/* Contract Type - Radio */}
        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label>Loại hợp đồng</label>
          <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="contractType"
                value="Rent"
                checked={formData.contractType === "Rent"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contractType: e.target.value,
                    endDate: "",
                  })
                }
              />
              Cho thuê (Rent)
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="contractType"
                value="Sale"
                checked={formData.contractType === "Sale"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contractType: e.target.value,
                    endDate: "",
                  })
                }
              />
              Sale Purchase (Sale)
            </label>
          </div>
        </div>

        <div className="resident-grid-form">
          {/* Floor */}
          <div className="form-group">
            <label>Floor</label>
            <input
              type="number"
              placeholder="Enter floor number..."
              value={formData.floorNumber}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  floorNumber: e.target.value,
                  roomNumber: "",
                  apartmentId: null,
                });
                setApartmentInfo(null);
              }}
            />
          </div>

          {/* Room Number */}
          <div className="form-group">
            <label>Room Number</label>
            <input
              type="number"
              placeholder="Enter room number..."
              value={formData.roomNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roomNumber: e.target.value,
                  apartmentId: null,
                })
              }
              onBlur={async () => {
                if (!formData.floorNumber || !formData.roomNumber) return;
                try {
                  const res = await api.post("/apartments/search-by-number", {
                    roomNumber: formData.roomNumber,
                    floorNumber: formData.floorNumber,
                  });
                  console.log(res);
                  setFormData((prev) => ({
                    ...prev,
                    apartmentId: res.data.result.id,
                  }));
                  setApartmentInfo(res.data.result);
                } catch {
                  alert("Room not found!");
                  setApartmentInfo(null);
                }
              }}
            />
          </div>

          {apartmentInfo && (
            <div
              className="apartment-info-card"
              style={{ gridColumn: "1 / -1" }}
            >
              <p>
                ✔ Found: <strong>{apartmentInfo.name}</strong> — Floor{" "}
                {apartmentInfo.floorNumber}, Room {apartmentInfo.roomNumber}
              </p>
              <p style={{ color: "green", fontSize: "13px" }}>
                Apartment ID: {apartmentInfo.id}
              </p>
            </div>
          )}

          {/* Username → accountId */}
          <div className="form-group">
            <label>Resident Username</label>
            <input
              type="text"
              placeholder="Enter username..."
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              onBlur={async () => {
                if (!formData.username) return;
                try {
                  const res = await api.get(
                    `/accounts/search-by-username/${formData.username}`,
                  );
                  console.log(res);
                  if (res?.data.result.id) {
                    setFormData((prev) => ({
                      ...prev,
                      accountId: res.data.result.id,
                    }));
                  } else {
                    alert("Account not found!");
                  }
                } catch {
                  alert("Error finding account!");
                }
              }}
            />
            {formData.accountId && (
              <small style={{ color: "green" }}>
                ✔ Account ID: {formData.accountId}
              </small>
            )}
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label>Contract Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>

          {/* End Date - only if Rent */}
          {formData.contractType === "Rent" && (
            <div className="form-group">
              <label>Contract End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          )}

          {/* Monthly Rent - only if Rent */}
          {formData.contractType === "Rent" && (
            <div className="form-group">
              <label>Monthly Rent (VND)</label>
              <input
                type="number"
                placeholder="E.g., 6000000"
                value={formData.monthlyRent}
                onChange={(e) =>
                  setFormData({ ...formData, monthlyRent: e.target.value })
                }
              />
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button
            className="btn-add-resident"
            style={{ width: "200px" }}
            onClick={handleAddContract}
          >
            Create Contract
          </button>
        </div>
      </section>
    </div>
  );
};

// --- XEM HỢP ĐỒNG (CARD) ---
export const AdminPropertyManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [properties, setProperties] = useState([
    {
      id: "VH-101",
      owner: "Trần Phu Thanh Hung",
      people: 4,
      type: "Ownership",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
    },
    {
      id: "VH-202",
      owner: "Nguyễn Thúy Hường",
      people: 2,
      type: "Rental",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000",
    },
  ]);

  const triggerUpload = (id, type) => {
    document.getElementById(`file-${type}-${id}`).click();
  };

  const handleInputChange = (id, field, value) => {
    setProperties(
      properties.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleSave = (id) => {
    alert(`Contract for apartment ${id} has been updated successfully!`);
    setEditingId(null);
  };

  const filteredProperties = properties.filter((p) =>
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-reports-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "15px"
        }}
      >
        <h2 className="admin-page-title" style={{ margin: 0 }}>
          Apartment & Contract List
        </h2>
        
        <div className="admin-lock-search" style={{ margin: 0, minWidth: '320px' }}>
          <FaSearch style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by Apartment (e.g. VH-101)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '10px' }}
          />
        </div>
      </div>

      <div className="admin-visual-grid">
        {filteredProperties.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '15px' }}>No contracts found matching "{searchTerm}".</p>
        ) : (
          filteredProperties.map((item) => (
            <div
              key={item.id}
              className="house-card hover-lift"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className="card-inner">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Apt: {item.id}</h3>
                    {editingId !== item.id && (
                    <button
                      onClick={() => setEditingId(item.id)}
                      style={{
                        background: '#c89b3c',
                        border: 'none',
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: '700',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 6px rgba(200, 155, 60, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#b08630';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 6px 12px rgba(176, 134, 48, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#c89b3c';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 6px rgba(200, 155, 60, 0.2)';
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                  )}
                </div>

                <div className="card-details">
                  {editingId === item.id ? (
                    <div className="edit-input-group" style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <label style={{ display: 'block', color: '#cbd5e1', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>OWNER / TENANT NAME</label>
                      <input
                        type="text"
                        value={item.owner}
                        style={{ width: '100%', marginBottom: '15px', padding: '10px', borderRadius: '6px', border: 'none', background: 'white', color: '#0f172a' }}
                        onChange={(e) => handleInputChange(item.id, "owner", e.target.value)}
                      />
                      
                      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', color: '#cbd5e1', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>RESIDENTS</label>
                          <input
                            type="number"
                            value={item.people}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: 'white', color: '#0f172a' }}
                            onChange={(e) => handleInputChange(item.id, "people", e.target.value)}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', color: '#cbd5e1', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>TYPE</label>
                          <select
                            value={item.type}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: 'white', color: '#0f172a' }}
                            onChange={(e) => handleInputChange(item.id, "type", e.target.value)}
                          >
                            <option value="Ownership">Ownership</option>
                            <option value="Rental">Rental</option>
                          </select>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => setEditingId(null)} 
                          style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleSave(item.id)} 
                          style={{ padding: '8px 16px', background: '#c89b3c', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: '800', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.target.style.background = '#b08630'}
                          onMouseLeave={(e) => e.target.style.background = '#c89b3c'}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p style={{ color: 'white', marginBottom: '10px', fontSize: '15px' }}>
                        👤 Owner: <strong>{item.owner}</strong>
                      </p>
                      <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>👨‍👩‍👧‍👦 Residents: {item.people} people</p>
                      <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>
                        📄 Type: <span style={{ padding: '4px 10px', background: item.type === 'Ownership' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(200, 155, 60, 0.2)', color: item.type === 'Ownership' ? '#93c5fd' : '#fde047', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>{item.type}</span>
                      </p>
                    </>
                  )}
                </div>

                {editingId !== item.id && (
                  <div className="contract-toolbar" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                    <div className="toolbar-left-icons">
                      <FaFileUpload title="Upload Contract Document" style={{ cursor: 'pointer', color: '#cbd5e1', fontSize: '18px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color='white'} onMouseLeave={(e) => e.target.style.color='#cbd5e1'} onClick={() => triggerUpload(item.id, "doc")} />
                      <input
                        type="file"
                        id={`file-doc-${item.id}`}
                        style={{ display: "none" }}
                      />
                      <FaImage title="Upload Related Images" style={{ cursor: 'pointer', color: '#cbd5e1', fontSize: '18px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color='white'} onMouseLeave={(e) => e.target.style.color='#cbd5e1'} onClick={() => triggerUpload(item.id, "img")} />
                      <input
                        type="file"
                        id={`file-img-${item.id}`}
                        style={{ display: "none" }}
                        accept="image/*"
                      />
                    </div>
                    <button className="toolbar-add-btn" style={{ background: 'white', color: '#0f172a', fontWeight: '800', padding: '6px 16px', borderRadius: '6px' }}>View Details</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- SERVICE & SECURITY MODULES (Reused from Staff) ---
export const AdminBookingManager = () => <div className="admin-reports-container"><StaffServiceMainContent activeTab="bookings" /></div>;
export const AdminServiceFeeStats = () => <div className="admin-reports-container"><StaffServiceMainContent activeTab="fees" /></div>;
export const AdminVisitorManager = () => <div className="admin-reports-container"><StaffSecurityMainContent activeTab="visitors" /></div>;

// --- ADMIN APARTMENT MANAGEMENT ---
export const AdminApartmentLayout = () => {
  const [selectedApartment, setSelectedApartment] = useState(null);
  const floors = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const apartmentsPerFloor = 7;

  // Mock data matching staff implementation
  const mockAptDetail = {
    room: selectedApartment,
    floor: selectedApartment ? Math.floor(parseInt(selectedApartment) / 100) : '',
    owner: (selectedApartment % 100 === 1 || selectedApartment === 1001) ? `Nguyen Van A` : null,
    residentCount: (selectedApartment % 100 === 1 || selectedApartment === 1001) ? 3 : 0,
    currentMonthStatus: "Unpaid",
    services: [
      { name: "Electricity", unitPrice: 3500, quantity: 150 },
      { name: "Water", unitPrice: 15000, quantity: 10 },
      { name: "Management Fee", unitPrice: 12000, quantity: (selectedApartment % 100 === 1 || selectedApartment === 1001) ? 3 : 0 }
    ],
    payerName: "---",
    history: [
      { id: 1, month: "02/2026", payer: "Robert Miller", total: "656,000", status: "Paid" },
      { id: 2, month: "01/2026", payer: "Linda Wilson", total: "706,000", status: "Paid" }
    ]
  };

  const hasOwner = !!mockAptDetail.owner;

  return (
    <div className="admin-apartment-layout-wrapper">
      {!selectedApartment ? (
        <div className="staff-form-container building-container">
          <h3 style={{ marginBottom: '25px', fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>
            VinaHouse Building Layout (Apartments)
          </h3>
          
          <div className="building-grid">
            {floors.map(floor => (
              <div key={floor} className="floor-row">
                <div className="floor-label">Floor {floor}</div>
                <div className="apartment-grid">
                  {Array.from({ length: apartmentsPerFloor }).map((_, idx) => {
                    const aptNumber = floor * 100 + idx + 1;
                    const isSelected = selectedApartment === aptNumber;
                    return (
                      <div 
                        key={aptNumber} 
                        className={`apartment-box ${isSelected ? 'selected' : ''}`} 
                        onClick={() => setSelectedApartment(aptNumber)}
                      >
                        {aptNumber}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="staff-form-container apartment-detail-view" style={{ minHeight: '80vh' }}>
          <button onClick={() => setSelectedApartment(null)} className="btn-back">← Back to Layout</button>
          
          <div className="admin-lock-header-row" style={{ marginTop: '15px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#c89b3c' }}>
              Apartment Details: {mockAptDetail.room}
            </h3>
          </div>

          <div className="apt-info-grid" style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', marginTop: '20px' }}>
            <p><strong>Floor:</strong> {mockAptDetail.floor}</p>
            <p>
              <strong>Owner:</strong> {hasOwner ? (
                <span style={{ color: '#1e293b', fontWeight: '700' }}>{mockAptDetail.owner}</span>
              ) : (
                <span style={{ color: '#ef4444', fontStyle: 'italic', fontWeight: 'bold' }}>No Owner</span>
              )}
            </p>
            <p><strong>Current Residents:</strong> {mockAptDetail.residentCount} people</p>
          </div>

          {hasOwner ? (
            <>
              <h4 style={{ marginTop: '35px', marginBottom: '20px', fontWeight: '800', color: '#1e293b' }}>Current Month Services Table</h4>
              <div className="admin-table-wrapper" style={{ padding: 0, border: 'none', boxShadow: 'none' }}>
                <table className="admin-custom-table bordered">
                  <thead>
                    <tr>
                      <th>SERVICE</th>
                      <th>UNIT PRICE (VND)</th>
                      <th>QUANTITY</th>
                      <th>TOTAL (VND)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAptDetail.services.map((svc, idx) => {
                      const totalAmount = svc.unitPrice * svc.quantity;
                      return (
                        <tr key={idx}>
                          <td>{svc.name}</td>
                          <td>{svc.unitPrice.toLocaleString()}</td>
                          <td>{svc.quantity} {svc.name === "Management Fee" ? "(People)" : ""}</td>
                          <td style={{ fontWeight: 'bold', color: '#1e293b' }}>{totalAmount.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: '2px solid #f1f5f9' }}>
                      <td colSpan="3" style={{ textAlign: 'right', fontWeight: '800', fontSize: '14px', color: '#1e293b' }}>GRAND TOTAL THIS MONTH:</td>
                      <td style={{ fontWeight: '900', color: '#ef4444', fontSize: '18px' }}>
                        {mockAptDetail.services.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'right', fontWeight: '700', color: '#1e293b' }}>PAYER:</td>
                      <td style={{ fontWeight: '600', color: '#64748b' }}>{mockAptDetail.payerName}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'right', fontWeight: '700', color: '#1e293b' }}>STATUS:</td>
                      <td style={{ fontWeight: '700', color: '#ef4444' }}>Unpaid</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            <>
              <h4 style={{ marginTop: '35px', marginBottom: '20px', fontWeight: '800', color: '#1e293b' }}>Current Month Services Table</h4>
              <div style={{ padding: '25px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                Apartment is currently empty - No current service data available.
              </div>
            </>
          )}

          <h4 style={{ marginTop: '45px', marginBottom: '20px', fontWeight: '800', color: '#1e293b' }}>Service Transaction History</h4>
          <div className="admin-table-wrapper" style={{ padding: 0, border: 'none', boxShadow: 'none' }}>
            <table className="admin-custom-table bordered">
              <thead>
                <tr>
                  <th>MONTH</th>
                  <th>PAYER</th>
                  <th>TOTAL (VND)</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {mockAptDetail.history.map((h) => (
                  <tr key={h.id}>
                    <td>{h.month}</td>
                    <td>{h.payer}</td>
                    <td style={{ fontWeight: 'bold' }}>{h.total}</td>
                    <td>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>{h.status}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-view-details">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


