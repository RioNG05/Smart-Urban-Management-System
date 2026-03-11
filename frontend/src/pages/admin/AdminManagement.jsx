import React, { useState } from "react";
import "../../styles/admin.css";
import { FaUsers, FaUserPlus, FaSearch, FaTrashAlt } from 'react-icons/fa';

// --- NGUYÊN VĂN ADMIN ROLE MANAGER ---
export const AdminRoleManager = () => {
    const [roles, setRoles] = useState([
        { id: 1, name: "ADMIN", permissions: ["READ", "CREATE", "UPDATE", "DELETE"], status: "Active" },
        { id: 2, name: "USER", permissions: ["READ"], status: "Active" },
        { id: 3, name: "MANAGER", permissions: ["READ", "CREATE", "UPDATE"], status: "Active" }
    ]);

    const [newRoleName, setNewRoleName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [error, setError] = useState("");

    const permissionOptions = ["READ", "CREATE", "UPDATE", "DELETE"];

    const handleCreateRole = () => {
        const isExist = roles.some(role => role.name.toUpperCase() === newRoleName.toUpperCase());
        if (isExist) {
            setError("This Role name already exists!");
            return;
        }
        if (!newRoleName) return;
        const newRole = {
            id: Date.now(),
            name: newRoleName.toUpperCase(),
            permissions: selectedPermissions,
            status: "Active"
        };
        setRoles([...roles, newRole]);
        setNewRoleName("");
        setSelectedPermissions([]);
        setError("");
    };

    const toggleLockRole = (id) => {
        setRoles(roles.map(role => 
            role.id === id 
            ? { ...role, status: role.status === "Active" ? "Locked" : "Active" } 
            : role
        ));
    };

    const handleDeleteRole = (id) => {
        if(window.confirm("Are you sure you want to delete this role?")) {
            setRoles(roles.filter(role => role.id !== id));
        }
    };

    const togglePermission = (perm) => {
        setSelectedPermissions(prev =>
            prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
        );
    };

    return (
        <div className="role-manager-container">
            <section className="create-role-section" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=1000')" }}>
                <div className="create-role-content">
                    <h3>System Role Configuration (RBAC)</h3>
                    <div className="role-input-group">
                        <label>Role Name:</label>
                        <input
                            type="text"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            placeholder="E.g., MANAGER, EDITOR, STAFF"
                            className={`role-name-input ${error ? "input-error" : ""}`}
                        />
                        {error && <p style={{ color: '#feb2b2', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
                    </div>
                    <div className="permission-checkbox-list">
                        <label>Assign Permissions:</label>
                        <div className="checkbox-group">
                            {permissionOptions.map(perm => (
                                <button
                                    key={perm}
                                    type="button"
                                    className={`btn-perm ${selectedPermissions.includes(perm) ? "active" : ""}`}
                                    onClick={() => togglePermission(perm)}
                                >
                                    {perm}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="btn-submit-role" onClick={handleCreateRole}>
                        Create New Role
                    </button>
                </div>
            </section>
            <section className="role-list-section">
                <h4>Role & Permissions Matrix</h4>
                <div className="admin-table-wrapper">
                    <table className="admin-custom-table">
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Permissions</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map(role => (
                                <tr key={role.id}>
                                    <td><strong>{role.name}</strong></td>
                                    <td>
                                        <div className="permission-tags">
                                            {role.permissions.map(p => (
                                                <span key={p} className={`badge badge-${p.toLowerCase()}`}>{p}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${role.status === "Active" ? "active" : "locked"}`}>
                                            {role.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-table-lock" 
                                                onClick={() => toggleLockRole(role.id)}
                                                title={role.status === "Active" ? "Lock Role" : "Unlock Role"}
                                            >
                                                {role.status === "Active" ? "🔒 Lock" : "🔓 Unlock"}
                                            </button>
                                            <button 
                                                className="btn-table-delete" 
                                                onClick={() => handleDeleteRole(role.id)}
                                                title="Delete Role"
                                            >
                                                🗑️ Del
                                            </button>
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

// --- NGUYÊN VĂN ADMIN LOCK RESIDENT ---
export const AdminLockResident = () => {
    const [residents, setResidents] = useState([]);
    const [formData, setFormData] = useState({ id: '', name: '', dob: '', apartment: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddResident = () => {
        if (!formData.id || !formData.name || !formData.apartment) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        setResidents([...residents, { ...formData }]);
        setFormData({ id: '', name: '', dob: '', apartment: '' });
    };

    const handleRemove = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa cư dân này?")) {
            setResidents(residents.filter(res => res.id !== id));
        }
    };

    const filteredResidents = residents.filter(res =>
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.apartment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-lock-resident-container">
            <div className="resident-stats-banner">
                <div className="stats-icon-box"><FaUsers /></div>
                <div className="stats-info">
                    <p>Total Community Population</p>
                    <h3>{residents.length} <span>Residents</span></h3>
                </div>
            </div>
            <section className="resident-form-section">
                <div className="form-header"><FaUserPlus /> <span>Resident Registration</span></div>
                <div className="resident-grid-form">
                    <div className="form-group">
                        <label>Resident ID</label>
                        <input type="text" value={formData.id} placeholder="E.g., RES001"
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={formData.name} placeholder="Enter name..."
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Apartment Number</label>
                        <input type="text" value={formData.apartment} placeholder="E.g., A1-102"
                            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })} />
                    </div>
                </div>
                <button className="btn-add-resident" onClick={handleAddResident}>Add to System</button>
            </section>
            <div className="table-action-header">
                <div className="search-box">
                    <FaSearch />
                    <input type="text" placeholder="Search by name or apartment..."
                        onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            <div className="resident-table-wrapper">
                <table className="admin-custom-table bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Date of Birth</th>
                            <th>Apartment</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResidents.map((res) => (
                            <tr key={res.id}>
                                <td><span className="res-id-badge">{res.id}</span></td>
                                <td><strong>{res.name}</strong></td>
                                <td>{res.dob || 'N/A'}</td>
                                <td>{res.apartment}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button className="btn-delete-action" onClick={() => handleRemove(res.id)}>
                                        <FaTrashAlt /> Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredResidents.length === 0 && <p className="no-data">Chưa có cư dân nào hoặc không tìm thấy kết quả.</p>}
            </div>
        </div>
    );
};