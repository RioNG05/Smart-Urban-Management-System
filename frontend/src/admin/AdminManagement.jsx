import React, { useState } from "react";
import "../styles/admin.css";
import { FaUsers, FaUserPlus, FaSearch, FaTrashAlt, FaEdit, FaCheckCircle } from 'react-icons/fa';
import { FaFileContract, FaPlus, FaFileUpload, FaImage, FaChevronDown } from 'react-icons/fa';

// --- ADMIN ROLE MANAGER ---
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
                        {error && <p style={{ color: 'var(--admin-danger)', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
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
    const [residents, setResidents] = useState([
        { id: 'RES001', name: 'Trần Hùng', dob: '1996-11-19', phone: '0912345678', address: 'Hà Nội', hometown: 'Nam Định', current: 'Vinhomes Ocean Park', apartment: 'VH-101' }
    ]);
    const [formData, setFormData] = useState({ id: '', name: '', dob: '', phone: '', address: '', hometown: '', current: '', apartment: '' });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleAddOrUpdate = () => {
        if (!formData.id || !formData.name || !formData.apartment) {
            alert("Please enter all required fields (ID, Name, Apartment)!"); return;
        }
        if (isEditMode) {
            setResidents(residents.map(res => (res.id === editingId ? { ...formData } : res)));
            setIsEditMode(false); setEditingId(null);
            alert("Resident information updated!");
        } else {
            if (residents.some(res => res.id === formData.id)) { alert("This ID already exists!"); return; }
            setResidents([...residents, { ...formData }]);
            alert("New resident added!");
        }
        setFormData({ id: '', name: '', dob: '', phone: '', address: '', hometown: '', current: '', apartment: '' });
    };

    const handleEditClick = (res) => {
        setFormData(res); setIsEditMode(true); setEditingId(res.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRemove = (id) => {
        if (window.confirm("Are you sure you want to delete this resident?")) {
            setResidents(residents.filter(res => res.id !== id));
        }
    };

    return (
        <div className="admin-lock-resident-container">
            <div className="resident-stats-banner">
                <div className="stats-icon-box"><FaUsers /></div>
                <div className="stats-info">
                    <p>RESIDENT DATABASE</p>
                    <h3>{residents.length} <span>Residents</span></h3>
                </div>
            </div>

            <section className="resident-form-section">
                <div className="form-header">
                    {isEditMode ? <FaEdit style={{ color: 'var(--admin-warning)' }} /> : <FaUserPlus style={{ color: 'var(--admin-primary)' }} />}
                    <span>{isEditMode ? "Update Resident Info" : "Resident Registration"}</span>
                </div>
                <div className="resident-grid-form">
                    <div className="form-group"><label>ID</label><input type="text" value={formData.id} disabled={isEditMode} onChange={(e) => setFormData({ ...formData, id: e.target.value })} /></div>
                    <div className="form-group"><label>Full Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                    <div className="form-group"><label>DOB</label><input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} /></div>
                    <div className="form-group"><label>Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                    <div className="form-group"><label>Address</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
                    <div className="form-group"><label>Hometown</label><input type="text" value={formData.hometown} onChange={(e) => setFormData({ ...formData, hometown: e.target.value })} /></div>
                    <div className="form-group"><label>Current Residence</label><input type="text" value={formData.current} onChange={(e) => setFormData({ ...formData, current: e.target.value })} /></div>
                    <div className="form-group"><label>Apartment No.</label><input type="text" value={formData.apartment} onChange={(e) => setFormData({ ...formData, apartment: e.target.value })} /></div>
                </div>
                <button className={`admin-btn-add ${isEditMode ? 'mode-edit' : ''}`} onClick={handleAddOrUpdate}>
                    {isEditMode ? "CONFIRM CHANGES" : "ADD TO SYSTEM"}
                </button>
            </section>

            <div className="resident-table-wrapper" style={{ marginTop: '30px' }}>
                <table className="admin-custom-table bordered">
                    <thead>
                        <tr>
                            <th>ID</th><th>Full Name</th><th>DOB</th><th>Phone</th><th>Hometown</th><th>Current Residence</th><th>Apt.</th><th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {residents.map((res) => (
                            <tr key={res.id}>
                                <td><span className="res-id-badge">{res.id}</span></td>
                                <td><strong>{res.name}</strong></td>
                                <td>{res.dob}</td>
                                <td>{res.phone}</td>
                                <td>{res.hometown}</td>
                                <td>{res.current}</td>
                                <td><span className="apartment-tag">{res.apartment}</span></td>
                                <td style={{ textAlign: 'center' }}>
                                    <div className="action-flex">
                                        <button className="btn-edit-small" onClick={() => handleEditClick(res)}><FaEdit /> Edit</button>
                                        <button className="btn-remove-small" onClick={() => handleRemove(res.id)}><FaTrashAlt /> Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                <button className="btn-update-final" onClick={() => alert("System updated with latest data!")}>
                    <FaCheckCircle /> UPDATE SYSTEM
                </button>
            </div>
        </div>
    );
};

// --- TẠO HỢP ĐỒNG ---
export const AdminCreateContract = () => {
    const [contracts, setContracts] = useState([]);
    const [formData, setFormData] = useState({ owner: '', date: '', type: '1. Ownership - Full Purchase' });
    const handleAddContract = () => {
        if (!formData.owner || !formData.date) { alert("Please enter all information!"); return; }
        const newContract = { id: `HD-${Date.now().toString().slice(-4)}`, ...formData };
        setContracts([newContract, ...contracts]);
        setFormData({ ...formData, owner: '' });
    };
    return (
        <div className="admin-lock-resident-container">
            <div className="resident-stats-banner">
                <div className="stats-icon-box"><FaFileContract /></div>
                <div className="stats-info"><p>Urban Management System</p><h3>Create New Contract</h3></div>
            </div>
            <section className="resident-form-section">
                <div className="form-header"><FaPlus /> <span>Legal Contract Form</span></div>
                <div className="resident-grid-form">
                    <div className="form-group"><label>Owner Name</label><input type="text" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} /></div>
                    <div className="form-group"><label>Contract Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
                    <div className="form-group"><label>Contract Type</label>
                        <select className="admin-contract-select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} >
                            <option value="1. Ownership - Full Purchase">1. Ownership - Full Purchase</option>
                            <option value="2. Rental - Limited Term Contract">2. Rental - Limited Term Contract</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}><button className="admin-btn-add" style={{ width: '200px' }} onClick={handleAddContract}>ADD CONTRACT</button></div>
            </section>
            <section className="role-list-section" style={{ marginTop: '30px' }}>
                <h4>RECENTLY CREATED CONTRACTS</h4>
                <div className="admin-table-wrapper">
                    <table className="admin-custom-table">
                        <thead><tr><th>Cont. ID</th><th>Owner</th><th>Sign Date</th><th>Type</th><th>Status</th></tr></thead>
                        <tbody>
                            {contracts.map((item) => (
                                <tr key={item.id}>
                                    <td><span className="res-id-badge">{item.id}</span></td>
                                    <td><strong>{item.owner.toUpperCase()}</strong></td>
                                    <td>{item.date}</td>
                                    <td><span className={`badge ${item.type.includes('Ownership') ? 'badge-create' : 'badge-update'}`}>{item.type}</span></td>
                                    <td><span className="status-badge active">Active</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

// --- XEM HỢP ĐỒNG ---
export const AdminPropertyManager = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [properties, setProperties] = useState([
        { id: 'VH-101', owner: 'Trần Phu Thanh Hung', people: 4, type: 'Ownership', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000' },
        { id: 'VH-202', owner: 'Nguyễn Thúy Hường', people: 2, type: 'Rental', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000' }
    ]);
    const triggerUpload = (id, type) => { document.getElementById(`file-${type}-${id}`).click(); };
    const handleInputChange = (id, field, value) => { setProperties(properties.map(p => p.id === id ? { ...p, [field]: value } : p)); };

    return (
        <div className="admin-reports-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="admin-page-title" style={{ margin: 0 }}>Property & Contract List</h2>
                <button className={`btn-edit-toggle ${isEditMode ? 'active' : ''}`} onClick={() => { setIsEditMode(!isEditMode); setEditingId(null); }}>{isEditMode ? "Cancel Edit" : "Edit"}</button>
            </div>
            <div className="admin-visual-grid">
                {properties.map(item => (
                    <div key={item.id} className="house-card" style={{ backgroundImage: `url(${item.img})` }}>
                        {isEditMode && (<div className="edit-overlay-tag" onClick={() => setEditingId(item.id)}><div className="check-circle">✓</div><span>Edit</span></div>)}
                        <div className="card-inner">
                            <h3>Apartment: {item.id}</h3>
                            <div className="card-details">
                                {editingId === item.id ? (
                                    <div className="edit-input-group">
                                        <input type="text" value={item.owner} onChange={(e) => handleInputChange(item.id, 'owner', e.target.value)} />
                                        <input type="number" value={item.people} onChange={(e) => handleInputChange(item.id, 'people', e.target.value)} />
                                        <select value={item.type} onChange={(e) => handleInputChange(item.id, 'type', e.target.value)}>
                                            <option value="Ownership">Ownership</option><option value="Rental">Rental</option>
                                        </select>
                                    </div>
                                ) : (<><p>👤 Owner: <strong>{item.owner}</strong></p><p>👨‍👩‍👧‍👦 People: {item.people}</p><p>📄 Type: {item.type}</p></>)}
                            </div>
                            <div className="contract-toolbar">
                                <div className="toolbar-left-icons">
                                    <FaFileUpload onClick={() => triggerUpload(item.id, 'doc')} /><input type="file" id={`file-doc-${item.id}`} style={{ display: 'none' }} />
                                    <FaImage onClick={() => triggerUpload(item.id, 'img')} /><input type="file" id={`file-img-${item.id}`} style={{ display: 'none' }} accept="image/*" />
                                </div>
                                <button className="toolbar-add-btn">add</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isEditMode && (<div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}><button className="btn-update-final" onClick={() => { alert("Updated!"); setIsEditMode(false); }}>UPDATE SYSTEM</button></div>)}
        </div>
    );
};