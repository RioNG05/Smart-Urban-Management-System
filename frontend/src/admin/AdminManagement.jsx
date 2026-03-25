import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom"; // THÊM NÀY ĐỂ KẾT NỐI VỚI SIDEBAR
import "../styles/admin.css";
import { 
    FaUsers, FaUserPlus, FaSearch, FaTrashAlt, FaEdit, FaCheckCircle, FaLock, FaCalendarAlt,
    FaMoneyBillWave, FaSyncAlt, FaCreditCard, FaFilter, FaEye, FaPlus, FaTimes,
    FaBuilding, FaLayerGroup,
    FaWrench, // Thêm icon cho mục REPAIR
    FaStar // Icon cho mục EVALUATE
} from 'react-icons/fa';
import { FaFileContract, FaFileUpload, FaImage, FaChevronDown } from 'react-icons/fa';
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

// FIX LỖI IMPORT Ở ĐÂY: XÓA ThrottledContainer ĐI LÀ HẾT TRẮNG TRANG
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- ADMIN ROLE MANAGER (GIỮ NGUYÊN) ---
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

// --- ADMIN LOCK RESIDENT (PHIÊN BẢN CẬP NHẬT: THÊM PASSWORD & NGÀY CẤP) ---
const AdminLockResidentLegacy = () => {
    const [residents, setResidents] = useState([
        { id: 'RES001', name: 'Trần Hùng', dob: '1996-11-19', phone: '0912345678', password: '••••••••', hometown: 'Nam Định', current: 'Vinhomes Ocean Park', apartment: 'VH-101', dateAdded: '2026-03-13' }
    ]);
    const [formData, setFormData] = useState({ id: '', name: '', dob: '', phone: '', password: '', hometown: '', current: '', apartment: '', dateAdded: '' });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleAddOrUpdate = () => {
        if (!formData.id || !formData.name || !formData.apartment) {
            alert("Vui lòng nhập đầy đủ các trường bắt buộc (ID, Tên, Căn hộ)!"); return;
        }
        if (isEditMode) {
            setResidents(residents.map(res => (res.id === editingId ? { ...formData } : res)));
            setIsEditMode(false); setEditingId(null);
            alert("Đã cập nhật thông tin cư dân!");
        } else {
            if (residents.some(res => res.id === formData.id)) { alert("ID này đã tồn tại!"); return; }
            setResidents([...residents, { ...formData }]);
            alert("Đã thêm cư dân mới!");
        }
        setFormData({ id: '', name: '', dob: '', phone: '', password: '', hometown: '', current: '', apartment: '', dateAdded: '' });
    };

  const handleEditClick = (res) => {
    setFormData(res);
    setIsEditMode(true);
    setEditingId(res.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    const handleRemove = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa cư dân này?")) {
            setResidents(residents.filter(res => res.id !== id));
        }
    };

    return (
        <div className="admin-lock-resident-container">
            <div className="resident-stats-banner">
                <div className="stats-icon-box"><FaUsers /></div>
                <div className="stats-info">
                    <p>CƠ SỞ DỮ LIỆU CƯ DÂN (ADMIN CONTROL)</p>
                    <h3>{residents.length} <span>Residents</span></h3>
                </div>
            </div>

            <section className="resident-form-section">
                <div className="form-header" style={{ color: isEditMode ? '#ed8936' : '#3182ce' }}>
                    {isEditMode ? <FaEdit /> : <FaUserPlus />} 
                    <span>{isEditMode ? "Update Resident Info" : "Resident Registration"}</span>
                </div>
                <div className="resident-grid-form" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="form-group"><label>Resident ID</label><input type="text" value={formData.id} disabled={isEditMode} placeholder="E.g., RES001" onChange={(e) => setFormData({ ...formData, id: e.target.value })} /></div>
                    <div className="form-group"><label>Full Name</label><input type="text" value={formData.name} placeholder="Enter name..." onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                    <div className="form-group"><label>Password</label><input type="password" value={formData.password} placeholder="••••••••" onChange={(e) => setFormData({ ...formData, password: e.target.value })} /></div>
                    <div className="form-group"><label>Date of Birth</label><input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} /></div>
                    <div className="form-group"><label>Phone Number</label><input type="text" value={formData.phone} placeholder="09xxx..." onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                    <div className="form-group"><label>Ngày thêm (Date Added)</label><input type="date" value={formData.dateAdded} onChange={(e) => setFormData({ ...formData, dateAdded: e.target.value })} /></div>
                    <div className="form-group"><label>Hộ khẩu lưu trú</label><input type="text" value={formData.hometown} placeholder="Quê quán..." onChange={(e) => setFormData({ ...formData, hometown: e.target.value })} /></div>
                    <div className="form-group"><label>Nơi ở hiện tại</label><input type="text" value={formData.current} placeholder="Địa chỉ hiện tại..." onChange={(e) => setFormData({ ...formData, current: e.target.value })} /></div>
                    <div className="form-group"><label>Apartment No.</label><input type="text" value={formData.apartment} placeholder="E.g., VH-101" onChange={(e) => setFormData({ ...formData, apartment: e.target.value })} /></div>
                </div>
                <button className={`btn-add-resident ${isEditMode ? 'mode-edit' : ''}`} onClick={handleAddOrUpdate}>
                    {isEditMode ? "CONFIRM CHANGES" : "ADD TO SYSTEM"}
                </button>
            </section>

            <div className="resident-table-wrapper" style={{ marginTop: '30px' }}>
                <table className="admin-custom-table bordered">
                    <thead>
                        <tr>
                            <th>ID</th><th>Họ Tên</th><th>Password</th><th>Ngày sinh</th><th>Phone</th><th>Hộ khẩu</th><th>Nơi ở hiện tại</th><th>Căn hộ</th><th>Ngày cấp</th><th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {residents.map((res, index) => (
                            <tr key={res.id}>
                                <td><span className="res-id-badge">{String(index + 1).padStart(2, '0')}</span></td>
                                <td><strong>{res.name}</strong></td>
                                <td style={{color: '#94a3b8', fontSize: '12px'}}><FaLock size={10}/> {res.password ? '••••••••' : 'N/A'}</td>
                                <td>{res.dob}</td>
                                <td>{res.phone}</td>
                                <td>{res.hometown}</td>
                                <td>{res.current}</td>
                                <td><span className="apartment-tag">{res.apartment}</span></td>
                                <td style={{fontSize: '12px', color: '#64748b'}}><FaCalendarAlt size={10}/> {res.dateAdded}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div className="action-flex">
                                        <button className="btn-edit-small" onClick={() => handleEditClick(res)}><FaEdit /> Sửa</button>
                                        <button className="btn-remove-small" onClick={() => handleRemove(res.id)}><FaTrashAlt /> Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', paddingBottom: '40px' }}>
                <button className="btn-update-final" onClick={() => alert("Dữ liệu hệ thống đã được đồng bộ!")}>
                    <FaCheckCircle /> UPDATE SYSTEM
                </button>
            </div>
        </div>
    );
};

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
                message: error?.response?.data?.message || "Khong the tai danh sach resident tu backend.",
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
        });
        setIsEditMode(true);
        setFeedback({ type: "", message: "" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const validateForm = () => {
        if (!formData.fullName || !formData.dateOfBirth || !formData.identityId || !formData.email || !formData.username) {
            setFeedback({
                type: "error",
                message: "Vui long nhap day du ho ten, ngay sinh, CCCD, email va username.",
            });
            return false;
        }

        if (!isEditMode && !formData.password) {
            setFeedback({
                type: "error",
                message: "Tao moi resident can co password cho account.",
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

        try {
            if (isEditMode) {
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
                });

                setFeedback({
                    type: "success",
                    message: "Da cap nhat thong tin resident va account thanh cong.",
                });
            } else {
                const account = await createAccount({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    isActive: formData.isActive,
                });

                await createResident({
                    fullName: formData.fullName,
                    gender: formData.gender || null,
                    dateOfBirth: formData.dateOfBirth,
                    identityId: formData.identityId,
                    accountId: account.id,
                });

                setFeedback({
                    type: "success",
                    message: "Da tao resident moi va lien ket account thanh cong.",
                });
            }

            resetForm();
            await loadResidentData();
        } catch (error) {
            setFeedback({
                type: "error",
                message: error?.response?.data?.message || "Co loi xay ra khi luu du lieu resident.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemove = async (resident) => {
        if (!window.confirm(`Ban co chac chan muon xoa resident ${resident.fullName}?`)) {
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
                message: "Da xoa resident va account lien ket.",
            });

            if (formData.residentId === resident.residentId) {
                resetForm();
            }

            await loadResidentData();
        } catch (error) {
            setFeedback({
                type: "error",
                message: error?.response?.data?.message || "Khong the xoa resident nay.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleLock = async (resident) => {
        if (!resident.accountId) {
            setFeedback({
                type: "error",
                message: "Resident nay chua co account de lock/unlock.",
            });
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
            resident.email,
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
                        <label>Email</label>
                        <input type="email" value={formData.email} placeholder="resident@email.com" onChange={(e) => handleInputChange("email", e.target.value)} />
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
                            placeholder="Tim theo ten, email, username, CCCD, can ho..."
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
                                <th>Email</th>
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
                                        <td className="admin-cell-compact">{resident.email || "N/A"}</td>
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
        </div>
    );
};

// --- THAO TÁC 1: TẠO HỢP ĐỒNG (GIỮ NGUYÊN) ---
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
              Mua bán (Sale)
            </label>
          </div>
        </div>

        <div className="resident-grid-form">
          {/* Tầng */}
          <div className="form-group">
            <label>Tầng</label>
            <input
              type="number"
              placeholder="Nhập số tầng..."
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

          {/* Số phòng */}
          <div className="form-group">
            <label>Số phòng</label>
            <input
              type="number"
              placeholder="Nhập số phòng..."
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
                  alert("Không tìm thấy phòng!");
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
                ✔ Tìm thấy: <strong>{apartmentInfo.name}</strong> — Tầng{" "}
                {apartmentInfo.floorNumber}, Phòng {apartmentInfo.roomNumber}
              </p>
              <p style={{ color: "green", fontSize: "13px" }}>
                Apartment ID: {apartmentInfo.id}
              </p>
            </div>
          )}

          {/* Username → accountId */}
          <div className="form-group">
            <label>Tên tài khoản cư dân</label>
            <input
              type="text"
              placeholder="Nhập username..."
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
                    alert("Không tìm thấy tài khoản!");
                  }
                } catch {
                  alert("Lỗi khi tìm tài khoản!");
                }
              }}
            />
            {formData.accountId && (
              <small style={{ color: "green" }}>
                ✔ Account ID: {formData.accountId}
              </small>
            )}
          </div>

          {/* Ngày bắt đầu */}
          <div className="form-group">
            <label>Ngày bắt đầu hợp đồng</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>

          {/* Ngày kết thúc - chỉ hiện khi Rent */}
          {formData.contractType === "Rent" && (
            <div className="form-group">
              <label>Ngày kết thúc hợp đồng</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          )}

          {/* Tiền thuê hàng tháng - chỉ hiện khi Rent */}
          {formData.contractType === "Rent" && (
            <div className="form-group">
              <label>Tiền thuê hàng tháng (VNĐ)</label>
              <input
                type="number"
                placeholder="VD: 6000000"
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
            Thêm hợp đồng
          </button>
        </div>
      </section>
    </div>
  );
};

// --- THAO TÁC 2: XEM HỢP ĐỒNG (CARD) (GIỮ NGUYÊN) ---
export const AdminPropertyManager = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [properties, setProperties] = useState([
    {
      id: "VH-101",
      owner: "Trần Phu Thanh Hung",
      people: 4,
      type: "Sở hữu",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
    },
    {
      id: "VH-202",
      owner: "Nguyễn Thúy Hường",
      people: 2,
      type: "Thuê nhà",
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

  return (
    <div className="admin-reports-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 className="admin-page-title" style={{ margin: 0 }}>
          Danh sách Căn nhà & Hợp đồng
        </h2>
        <button
          className={`btn-edit-toggle ${isEditMode ? "active" : ""}`}
          onClick={() => {
            setIsEditMode(!isEditMode);
            setEditingId(null);
          }}
        >
          {isEditMode ? "Cancel Edit" : "Edit"}
        </button>
      </div>
      <div className="admin-visual-grid">
        {properties.map((item) => (
          <div
            key={item.id}
            className="house-card"
            style={{ backgroundImage: `url(${item.img})` }}
          >
            {isEditMode && (
              <div
                className="edit-overlay-tag"
                onClick={() => setEditingId(item.id)}
              >
                <div className="check-circle">✓</div>
                <span>Chỉnh sửa</span>
              </div>
            )}
            <div className="card-inner">
              <h3>Căn hộ: {item.id}</h3>
              <div className="card-details">
                {editingId === item.id ? (
                  <div className="edit-input-group">
                    <input
                      type="text"
                      value={item.owner}
                      onChange={(e) =>
                        handleInputChange(item.id, "owner", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      value={item.people}
                      onChange={(e) =>
                        handleInputChange(item.id, "people", e.target.value)
                      }
                    />
                    <select
                      value={item.type}
                      onChange={(e) =>
                        handleInputChange(item.id, "type", e.target.value)
                      }
                    >
                      <option value="Sở hữu">Sở hữu</option>
                      <option value="Thuê nhà">Thuê nhà</option>
                    </select>
                  </div>
                ) : (
                  <>
                    <p>
                      👤 Owner: <strong>{item.owner}</strong>
                    </p>
                    <p>👨‍👩‍👧‍👦 People: {item.people}</p>
                    <p>📄 Type: {item.type}</p>
                  </>
                )}
              </div>
              <div className="contract-toolbar">
                <div className="toolbar-left-icons">
                  <FaFileUpload onClick={() => triggerUpload(item.id, "doc")} />
                  <input
                    type="file"
                    id={`file-doc-${item.id}`}
                    style={{ display: "none" }}
                  />
                  <FaImage onClick={() => triggerUpload(item.id, "img")} />
                  <input
                    type="file"
                    id={`file-img-${item.id}`}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                </div>
                <button className="toolbar-add-btn">add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isEditMode && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <button
            className="btn-update-final"
            onClick={() => {
              alert("Updated!");
              setIsEditMode(false);
            }}
          >
            UPDATE SYSTEM
          </button>
        </div>
      )}
    </div>
  );
};

// --- 5. ADMIN PAYMENT MANAGER (GIỮ NGUYÊN) ---
export const AdminPaymentManager = () => {
    const [activeSubTab, setActiveSubTab] = useState('payments');
    const [counts] = useState({ payments: 17, vnpay: 5 });
    const [paymentList] = useState([
        { id: '#7', invoice: 'HD-202512-001', floor: '1001', name: 'Trần Phu Thanh Hung', amount: '2.940.000 VNĐ', method: 'VNPay', date: '30/11/2025' },
        { id: '#8', invoice: 'HD-202601-002', floor: '904', name: 'Lê Văn Tám', amount: '1.200.000 VNĐ', method: 'Tiền mặt', date: '01/01/2026' }
    ]);

    return (
        <div className="admin-pay-wrapper">
            <div className="pay-header-main">
                <div className="pay-title-left"><h2>Payment management</h2></div>
                <div className="pay-refresh-right">
                    <button className="btn-pay-refresh" onClick={() => window.location.reload()}>
                        <FaSyncAlt size={14} /> Refresh
                    </button>
                </div>
            </div>
            <div className="pay-tab-navigation">
                <button className={`pay-tab-btn ${activeSubTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveSubTab('payments')}>
                    Payments <span className="tab-count">({counts.payments})</span>
                </button>
                <button className={`pay-tab-btn ${activeSubTab === 'vnpay' ? 'active' : ''}`} onClick={() => setActiveSubTab('vnpay')}>
                    VNPay transactions <span className="tab-count">({counts.vnpay})</span>
                </button>
            </div>
            {activeSubTab === 'payments' && (
                <div className="payments-content-container">
                    <div className="payment-filter-card-raised">
                        <div className="filter-title"><FaFilter color="#f59e0b" /> <span>Filter</span></div>
                        <div className="resident-grid-form" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '15px' }}>
                            <div className="form-group"><label>Phòng</label><input type="text" placeholder="Tất cả" /></div>
                            <div className="form-group"><label>Người thuê</label><input type="text" placeholder="Tất cả" /></div>
                            <div className="form-group"><label>Từ ngày</label><input type="date" /></div>
                            <div className="form-group"><label>Đến ngày</label><input type="date" /></div>
                        </div>
                    </div>
                    <div className="resident-table-wrapper" style={{ marginTop: '25px', background: 'white', padding: '20px', borderRadius: '12px' }}>
                        <table className="admin-custom-table bordered">
                            <thead>
                                <tr>
                                    <th>Mã thanh toán</th><th>Hóa đơn</th><th>Floor (Phòng)</th><th>Name of Person</th><th>Amount</th><th>Method</th><th>Date</th><th style={{textAlign: 'center'}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentList.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.id}</td><td style={{color: '#3182ce', fontWeight: 'bold'}}>{item.invoice}</td>
                                        <td><span className="floor-badge">{item.floor}</span></td><td><strong>{item.name}</strong></td>
                                        <td style={{color: '#2f855a', fontWeight: 'bold'}}>{item.amount}</td><td>{item.method}</td><td>{item.date}</td>
                                        <td style={{textAlign: 'center'}}><FaEye style={{cursor: 'pointer', color: '#64748b'}} /></td>
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

// --- 6. ADMIN APARTMENT MANAGEMENT (GIỮ NGUYÊN) ---
export const AdminApartmentLayout = () => {
    const floors = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const rooms = [1, 2, 3, 4, 5, 6, 7];
    return (
        <div className="admin-apartment-layout-wrapper">
            <header className="layout-header"><h2>VinaHouse Building Layout (Apartments)</h2></header>
            <div className="building-grid-container">
                {floors.map(f => (
                    <div key={f} className="floor-row">
                        <div className="floor-label-box"><FaLayerGroup /> <span>Floor {f}</span></div>
                        <div className="rooms-container">
                            {rooms.map(r => {
                                const rNum = f * 100 + r;
                                return (
                                    <div key={rNum} className={`room-box`}>
                                        {rNum}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 7. ADMIN REPAIR MANAGER (GIỮ NGUYÊN) ---
export const AdminRepairManager = () => {
    const [repairList] = useState([
        { floor: '101', name: 'Nguyễn Văn A', type: 'Electricity', reg: 'Registered', date: '19/03/2026', status: 'Pending processing' },
        { floor: '504', name: 'Lê Thị B', type: 'Water', reg: 'Registered', date: '18/03/2026', status: 'Processed' }
    ]);
    const floors = [];
    for(let i=1; i<=10; i++) { for(let j=1; j<=7; j++) { floors.push(i*100 + j); } }
    return (
        <div className="admin-repair-wrapper">
            <div className="pay-header-main"><div className="pay-title-left"><h2>Repair management</h2></div><div className="pay-refresh-right"><button className="btn-pay-refresh" onClick={() => window.location.reload()}><FaSyncAlt size={14} /> Refresh</button></div></div>
            <div className="payment-filter-card-raised">
                <div className="filter-title"><FaFilter color="#f59e0b" /> <span>Filter</span></div>
                <div className="resident-grid-form" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '15px' }}>
                    <div className="form-group"><label>Status</label><select className="admin-contract-select"><option>All status</option><option>Processed</option><option>Pending processing</option></select></div>
                    <div className="form-group"><label>Incident Type</label><select className="admin-contract-select"><option>All types</option><option>Electricity</option><option>Water</option><option>Other equipment</option></select></div>
                    <div className="form-group"><label>Floor</label><select className="admin-contract-select"><option>All floors</option>{floors.map(f => <option key={f}>{f}</option>)}</select></div>
                </div>
            </div>
            <div className="resident-table-wrapper" style={{ marginTop: '25px', background: 'white', padding: '20px', borderRadius: '12px' }}>
                <table className="admin-custom-table bordered">
                    <thead><tr><th>Floor</th><th>Household name</th><th>Type of incident</th><th>Residence registration</th><th>Creation date</th><th>Status</th><th style={{textAlign: 'center'}}>Operation</th></tr></thead>
                    <tbody>{repairList.map((item, idx) => (
                        <tr key={idx}><td><span className="floor-badge">{item.floor}</span></td><td><strong>{item.name}</strong></td><td>{item.type}</td><td>{item.reg}</td><td>{item.date}</td><td><span className={`status-badge ${item.status === 'Processed' ? 'active' : 'locked'}`}>{item.status}</span></td><td style={{textAlign: 'center'}}><div className="action-flex"><FaEye className="icon-view-action" /><FaSyncAlt className="icon-edit-action" style={{color: '#f59e0b', cursor: 'pointer'}} /></div></td></tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
};

// --- 8. ADMIN MAINTENANCE MANAGER (ĐÃ CẬP NHẬT TRƯỜNG STATUS TRONG FORM) ---
export const AdminMaintenanceManager = () => {
    const context = useOutletContext();
    const setUpcomingCount = context ? context.setUpcomingCount : null;

    const [showModal, setShowModal] = useState(false);
    const [maintenanceList, setMaintenanceList] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        title: '', desc: '', type: 'Hallway lighting system', floor: 'All', start: '', end: '', status: 'upcoming'
    });

    useEffect(() => {
        if (setUpcomingCount) {
            const count = maintenanceList.filter(item => item.status === 'upcoming').length;
            setUpcomingCount(count);
        }
    }, [maintenanceList, setUpcomingCount]);

    const handleCreateOrUpdate = () => {
        if(!form.title) { alert("Title is mandatory!"); return; }
        if (isEditMode) {
            setMaintenanceList(maintenanceList.map(item => item.id === editId ? { ...form, id: editId } : item));
            setIsEditMode(false); setEditId(null);
        } else {
            const newItem = { ...form, id: Date.now() };
            setMaintenanceList([newItem, ...maintenanceList]);
        }
        setShowModal(false);
        setForm({ title: '', desc: '', type: 'Hallway lighting system', floor: 'All', start: '', end: '', status: 'upcoming' });
    };

    const handleEdit = (item) => {
        setForm(item);
        setIsEditMode(true);
        setEditId(item.id);
        setShowModal(true);
    };

    const handleRemove = (id) => {
        if(window.confirm("Are you sure to remove this schedule?")) setMaintenanceList(maintenanceList.filter(item => item.id !== id));
    };

    return (
        <div className="admin-maintenance-wrapper">
            <div className="pay-header-main">
                <div className="pay-title-left"><h2>Maintenance schedule</h2></div>
                <div className="pay-refresh-right">
                    <button className="btn-create-maintenance" onClick={() => { setIsEditMode(false); setShowModal(true); }}>
                        <FaPlus /> Create maintenance schedule
                    </button>
                </div>
            </div>

            <div className="payment-filter-card-raised">
                <div className="resident-grid-form" style={{ gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'flex-end' }}>
                    <div className="form-group"><label>Status</label><select className="admin-contract-select"><option>upcoming</option><option>under maintenance</option><option>maintenance completed</option></select></div>
                    <div className="form-group"><label>Maintenance Type</label><select className="admin-contract-select"><option>Corridor lighting system</option><option>elevators</option><option>fire protection system</option><option>window cleaning service</option><option>water tanks</option><option>waste treatment system</option><option>camera system</option><option>air conditioning system</option></select></div>
                    <div className="form-group"><button className="btn-pay-refresh" style={{width: '100%'}} onClick={() => window.location.reload()}><FaSyncAlt /> Refresh</button></div>
                </div>
            </div>

            <div className="resident-table-wrapper" style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '12px' }}>
                <table className="admin-custom-table bordered">
                    <thead>
                        <tr><th>Title</th><th>Description</th><th>Type</th><th>Start Date</th><th>End Date</th><th>Status</th><th style={{textAlign:'center'}}>Actions</th></tr>
                    </thead>
                    <tbody>
                        {maintenanceList.length === 0 ? (
                            <tr><td colSpan="7" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}>No maintenance schedule found.</td></tr>
                        ) : (
                            maintenanceList.map((item) => (
                                <tr key={item.id}>
                                    <td><strong>{item.title}</strong></td><td>{item.desc}</td><td><span className="floor-badge">{item.type}</span></td><td>{item.start}</td><td>{item.end}</td><td><span className="status-badge active">{item.status}</span></td>
                                    <td style={{textAlign:'center'}}><div className="action-flex" style={{justifyContent:'center'}}><FaEdit style={{color:'#f59e0b', cursor:'pointer'}} title="Edit" onClick={() => handleEdit(item)} /><FaTrashAlt style={{color:'#ef4444', cursor:'pointer'}} title="Remove" onClick={() => handleRemove(item.id)} /></div></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="invoice-modal-overlay">
                    <div className="invoice-modal-content" style={{width: '600px'}}>
                        <div className="modal-header"><h3>{isEditMode ? 'Edit Maintenance Schedule' : 'Create a new maintenance schedule'}</h3><FaTimes className="close-btn" onClick={() => setShowModal(false)} /></div>
                        <div className="modal-body-scroll">
                            <div className="form-group"><label>Title <span style={{color:'red'}}>*</span></label><input type="text" placeholder="Title..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
                            <div className="form-group" style={{marginTop:'15px'}}><label>Description</label><textarea rows="3" placeholder="Details..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} style={{width:'100%', borderRadius:'8px', padding:'10px', border:'1px solid #e2e8f0'}}></textarea></div>
                            <div className="staff-grid" style={{gridTemplateColumns:'1fr 1fr', gap:'15px', marginTop:'15px'}}>
                                <div className="form-group"><label>Type</label><select className="admin-contract-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option>Hallway lighting system</option><option>elevators</option><option>fire protection system</option><option>window cleaning service</option><option>water tanks</option><option>waste treatment system</option><option>camera system</option><option>air conditioning system</option></select></div>
                                <div className="form-group"><label>Floor</label><select className="admin-contract-select" value={form.floor} onChange={e => setForm({...form, floor: e.target.value})}><option>All</option><option>Basement B1</option>{[...Array(10)].map((_, i) => <option key={i+1}>Floor {i+1}</option>)}</select></div>
                            </div>
                            <div className="staff-grid" style={{gridTemplateColumns:'1fr 1fr', gap:'15px', marginTop:'15px'}}>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select className="admin-contract-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                                        <option value="upcoming">upcoming</option>
                                        <option value="under maintenance">under maintenance</option>
                                        <option value="maintenance completed">maintenance completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="staff-grid" style={{gridTemplateColumns:'1fr 1fr', gap:'15px', marginTop:'15px'}}><div className="form-group"><label>Start Date</label><input type="date" value={form.start} onChange={e => setForm({...form, start: e.target.value})} /></div><div className="form-group"><label>End Date</label><input type="date" value={form.end} onChange={(e) => setForm({...form, end: e.target.value})} /></div></div>
                        </div>
                        <div className="modal-footer"><button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button><button className="btn-gold" onClick={handleCreateOrUpdate}>{isEditMode ? 'Update schedule' : 'Create schedule'}</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 9. ADMIN EVALUATE MANAGER (MỤC MỚI) ---
export const AdminEvaluateManager = () => {
    const data = [
        { name: 'Mon', rating: 0 }, { name: 'Tue', rating: 0 }, { name: 'Wed', rating: 0 },
        { name: 'Thu', rating: 0 }, { name: 'Fri', rating: 0 }, { name: 'Sat', rating: 0 }, { name: 'Sun', rating: 0 },
    ];
    return (
        <div className="admin-evaluate-wrapper">
            <div className="pay-header-main"><div className="pay-title-left"><h2>Review management</h2></div><div className="pay-refresh-right"><button className="btn-pay-refresh" onClick={() => window.location.reload()}><FaSyncAlt size={14} /> Refresh</button></div></div>
            <div className="evaluate-stats-grid">
                <div className="evaluate-stat-card"><p>Overall Rating</p><h3>0</h3><span>Total reviews</span></div>
                <div className="evaluate-stat-card"><p>Average Score</p><h3>0.0 <FaStar style={{color: '#f59e0b', fontSize: '18px'}} /></h3><span>out of 5.0</span></div>
            </div>
            <div className="evaluate-chart-container">
                <h4>Resident Review Trends</h4>
                <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={[0, 5]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6, fill: '#f59e0b' }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
