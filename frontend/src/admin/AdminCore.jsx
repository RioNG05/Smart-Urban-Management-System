import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    FaHome, FaUserShield, FaBuilding, FaNewspaper, FaBars,
    FaUserLock, FaChartPie, FaChevronDown, FaUsers,
    FaFileContract // Tao thêm icon hợp đồng
} from 'react-icons/fa';
import "../styles/admin.css";
import logoImg from '../assets/logo.jpg';

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [openAccess, setOpenAccess] = useState(false);
    const [openReports, setOpenReports] = useState(false);
    const [openContract, setOpenContract] = useState(false);

    const handleGroupClick = (setter, currentState) => {
        if (!isOpen) setIsOpen(true);
        setter(!currentState);
    };

    return (
        <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <FaBars className="menu-toggle-icon" onClick={() => setIsOpen(!isOpen)} />
                {isOpen && <span className="logo-text">VINAHOUSE CMS</span>}
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/admin" end className="nav-item">
                    <FaHome /> {isOpen && <span>Dashboard</span>}
                </NavLink>

                {/* --- ACCESS CONTROL --- */}
                <div className="menu-group">
                    <div className="menu-item-title" onClick={() => handleGroupClick(setOpenAccess, openAccess)}>
                        <FaUserShield />
                        {isOpen && <span>Access Control</span>}
                        {isOpen && <FaChevronDown className={`arrow ${openAccess ? 'rotate' : ''}`} />}
                    </div>
                    {isOpen && openAccess && (
                        <div className="submenu">
                            <NavLink to="/admin/roles">Permissions</NavLink>
                            <NavLink to="/admin/lock-resident">Lock Resident</NavLink>
                        </div>
                    )}
                </div>

                {/* --- QUẢN LÝ CĂN HỘ VÀ HỢP ĐỒNG --- */}
                <div className="menu-group">
                    <div className="menu-item-title" onClick={() => handleGroupClick(setOpenContract, openContract)}>
                        <FaFileContract />
                        {isOpen && <span>Apartment & Contract</span>}
                        {isOpen && <FaChevronDown className={`arrow ${openContract ? 'rotate' : ''}`} />}
                    </div>
                    {isOpen && openContract && (
                        <div className="submenu">
                            <NavLink to="/admin/contracts/create">Create Contract</NavLink>
                            <NavLink to="/admin/contracts/view">View Contracts</NavLink>
                        </div>
                    )}
                </div>

                {/* --- REPORTS & STATS --- */}
                <div className="menu-group">
                    <div className="menu-item-title" onClick={() => handleGroupClick(setOpenReports, openReports)}>
                        <FaChartPie />
                        {isOpen && <span>Reports & Stats</span>}
                        {isOpen && <FaChevronDown className={`arrow ${openReports ? 'rotate' : ''}`} />}
                    </div>
                    {isOpen && openReports && (
                        <div className="submenu">
                            <NavLink to="/admin/reports/revenue">Monthly Revenue</NavLink>
                            <NavLink to="/admin/reports/residents">Resident Count</NavLink>
                            <NavLink to="/admin/reports/payments">Payment Rate</NavLink>
                            <NavLink to="/admin/reports/services">Service Usage</NavLink>
                        </div>
                    )}
                </div>

                <NavLink to="/market" className="nav-item"><FaBuilding /> {isOpen && "Edit Properties"}</NavLink>
                <NavLink to="/news" className="nav-item"><FaNewspaper /> {isOpen && "News Manager"}</NavLink>
            </nav>
        </div>
    );
};

export const AdminLayout = () => {
    // Lấy account Admin từ DB
    const [adminName, setAdminName] = useState('');

    useEffect(() => {
        // TODO: Gọi API Backend để lấy thông tin Admin đang đăng nhập tại đây
        // VD:
        // fetch('/api/admin/profile', {
        //     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // })
        // .then(res => res.json())
        // .then(data => setAdminName(data.name))
        // .catch(err => console.error(err));

        // Tạm thời giả lập dữ liệu tĩnh để test UI (xóa khi có API thật)
        // setAdminName('Super Admin'); 
    }, []);

    return (
        <div className="admin-page-wrapper">
            <AdminSidebar />
            <div className="admin-main-container">
                <div className="admin-topbar">
                    <div className="vinahouse-header-brand">
                        <img src={logoImg} alt="Logo" className="header-logo-img" />
                        <span className="header-brand-name">ADMIN: {adminName}</span>
                    </div>

                    {/* TODO: Lấy dữ liệu account từ database ở đây trong tương lai */}
                    <div className="topbar-profile">
                        <div className="profile-info">
                            <span className="profile-name">Admin Name</span>
                            <span className="profile-role">Administrator</span>
                        </div>
                        <img
                            src="https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff"
                            alt="Admin Profile"
                            className="profile-avatar"
                        />
                    </div>
                </div>
                <div className="admin-content-area">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export const AdminDashboard = () => {
    return (
        <div className="dashboard-content">
            <header className="content-header">
                <h2>Overview of the Management System</h2>
            </header>

            <div className="admin-visual-grid">
                <div className="house-card" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000')" }}>
                    <div className="card-inner">
                        <h3>Modify the Homepage interface.</h3>
                        <p>Edit banners, featured areas, and contact information.</p>
                        <button onClick={() => window.location.href = '/'}>Go to the Home page</button>
                    </div>
                </div>

                <div className="house-card" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000')" }}>
                    <div className="card-inner">
                        <h3>Exchange Management</h3>
                        <p>Updated prices, photos, and status of VinaHouse apartments.</p>
                        <button onClick={() => window.location.href = '/market'}>Edit Products</button>
                    </div>
                </div>
            </div>
        </div>
    );
};