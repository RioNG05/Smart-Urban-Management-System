import React, { useState } from "react";
import "../styles/admin.css";
import { FaUsers, FaUserPlus, FaSearch, FaTrashAlt, FaEdit, FaCheckCircle, FaLock, FaCalendarAlt } from 'react-icons/fa';
import { FaFileContract, FaPlus, FaFileUpload, FaImage, FaChevronDown } from 'react-icons/fa';

// --- ADMIN ROLE MANAGER (GIỮ NGUYÊN) ---
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
export const AdminLockResident = () => {
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
        setFormData(res); setIsEditMode(true); setEditingId(res.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

// --- THAO TÁC 1: TẠO HỢP ĐỒNG (GIỮ NGUYÊN) ---
export const AdminCreateContract = () => {
    const [contracts, setContracts] = useState([]);
    const [formData, setFormData] = useState({ owner: '', date: '', type: '1. Sở hữu - Mua đứt' });
    const handleAddContract = () => {
        if (!formData.owner || !formData.date) { alert("Vui lòng nhập đầy đủ thông tin!"); return; }
        const newContract = { id: `HD-${Date.now().toString().slice(-4)}`, ...formData };
        setContracts([newContract, ...contracts]);
        setFormData({ ...formData, owner: '' });
    };
    return (
        <div className="admin-lock-resident-container">
            <div className="resident-stats-banner" style={{ background: 'linear-gradient(135deg, #1a202c 0%, #4a5568 100%)' }}>
                <div className="stats-icon-box"><FaFileContract /></div>
                <div className="stats-info"><p>Hệ thống Quản lý Đô thị</p><h3>Khởi tạo Hợp đồng Mới</h3></div>
            </div>
            <section className="resident-form-section">
                <div className="form-header"><FaPlus /> <span>Biểu mẫu hợp đồng pháp lý</span></div>
                <div className="resident-grid-form">
                    <div className="form-group"><label>Tên chủ hộ</label><input type="text" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} /></div>
                    <div className="form-group"><label>Ngày làm hợp đồng</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
                    <div className="form-group"><label>Tình trạng hợp đồng</label>
                        <select className="admin-contract-select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} >
                            <option value="1. Sở hữu - Mua đứt">1. Sở hữu - Mua đứt</option>
                            <option value="2. Cho thuê - Có hạn hợp đồng thuê nhà">2. Cho thuê - Có hạn hợp đồng thuê nhà</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}><button className="btn-add-resident" style={{ width: '200px' }} onClick={handleAddContract}>Add hợp đồng</button></div>
            </section>
        </div>
    );
};

// --- THAO TÁC 2: XEM HỢP ĐỒNG (CARD) (GIỮ NGUYÊN) ---
export const AdminPropertyManager = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [properties, setProperties] = useState([
        { id: 'VH-101', owner: 'Trần Phu Thanh Hung', people: 4, type: 'Sở hữu', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000' },
        { id: 'VH-202', owner: 'Nguyễn Thúy Hường', people: 2, type: 'Thuê nhà', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000' }
    ]);
    const triggerUpload = (id, type) => { document.getElementById(`file-${type}-${id}`).click(); };
    const handleInputChange = (id, field, value) => { setProperties(properties.map(p => p.id === id ? { ...p, [field]: value } : p)); };

    return (
        <div className="admin-reports-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="admin-page-title" style={{ margin: 0 }}>Danh sách Căn nhà & Hợp đồng</h2>
                <button className={`btn-edit-toggle ${isEditMode ? 'active' : ''}`} onClick={() => { setIsEditMode(!isEditMode); setEditingId(null); }}>{isEditMode ? "Cancel Edit" : "Edit"}</button>
            </div>
            <div className="admin-visual-grid">
                {properties.map(item => (
                    <div key={item.id} className="house-card" style={{ backgroundImage: `url(${item.img})` }}>
                        {isEditMode && (<div className="edit-overlay-tag" onClick={() => setEditingId(item.id)}><div className="check-circle">✓</div><span>Chỉnh sửa</span></div>)}
                        <div className="card-inner">
                            <h3>Căn hộ: {item.id}</h3>
                            <div className="card-details">
                                {editingId === item.id ? (
                                    <div className="edit-input-group">
                                        <input type="text" value={item.owner} onChange={(e) => handleInputChange(item.id, 'owner', e.target.value)} />
                                        <input type="number" value={item.people} onChange={(e) => handleInputChange(item.id, 'people', e.target.value)} />
                                        <select value={item.type} onChange={(e) => handleInputChange(item.id, 'type', e.target.value)}>
                                            <option value="Sở hữu">Sở hữu</option><option value="Thuê nhà">Thuê nhà</option>
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