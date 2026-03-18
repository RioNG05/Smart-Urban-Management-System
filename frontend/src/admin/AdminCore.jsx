import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { 
    FaHome, FaUserShield, FaBuilding, FaNewspaper, FaBars, 
    FaUserLock, FaChartPie, FaChevronDown, FaUsers,
    FaFileContract // Tao thêm icon hợp đồng
} from 'react-icons/fa';
import "../styles/admin.css";

// --- NGUYÊN VĂN ADMIN SIDEBAR (ĐÃ THÊM MENU CĂN HỘ & HỢP ĐỒNG) ---
const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [openAccess, setOpenAccess] = useState(false);
    const [openReports, setOpenReports] = useState(false);
    // State để đóng mở menu Hợp đồng
    const [openContract, setOpenContract] = useState(false);

    return (
        <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <FaBars className="menu-toggle-icon" onClick={() => setIsOpen(!isOpen)} />
                {isOpen && <span className="logo-text">VinaHouse CMS</span>}
            </div>

            <nav className="sidebar-nav">
                <Link to="/admin" className="nav-item">
                    <FaHome /> {isOpen && <span>Dashboard</span>}
                </Link>

                {/* --- NHÓM 1: ACCESS CONTROL --- */}
                <div className="menu-group">
                    <div className="menu-item-title" onClick={() => setOpenAccess(!openAccess)}>
                        <FaUserShield /> 
                        {isOpen && <span>Access Control</span>}
                        {isOpen && <FaChevronDown className={`arrow ${openAccess ? 'rotate' : ''}`} />}
                    </div>
                    {isOpen && openAccess && (
                        <div className="submenu">
                            <Link to="/admin/roles">Permissions</Link>
                            <Link to="/admin/lock-resident">Lock Resident</Link>
                        </div>
                    )}
                </div>

                {/* --- NHÓM MỚI: QUẢN LÝ CĂN HỘ VÀ HỢP ĐỒNG --- */}
                <div className="menu-group">
                    <div className="menu-item-title" onClick={() => setOpenContract(!openContract)}>
                        <FaFileContract /> 
                        {isOpen && <span>APARTMENT MANAGEMENT AND CONTRACTS</span>}
                        {isOpen && <FaChevronDown className={`arrow ${openContract ? 'rotate' : ''}`} />}
                    </div>
                    {isOpen && openContract && (
                        <div className="submenu">
                            <Link to="/admin/contracts/create">Create a contract</Link>
                            <Link to="/admin/contracts/view">See contract</Link>
                        </div>
                    )}
                </div>

                {/* --- NHÓM 2: REPORTS & STATS --- */}
                <div className="menu-group">
                    <div className="menu-item-title" onClick={() => setOpenReports(!openReports)}>
                        <FaChartPie /> 
                        {isOpen && <span>Reports & Stats</span>}
                        {isOpen && <FaChevronDown className={`arrow ${openReports ? 'rotate' : ''}`} />}
                    </div>
                    {isOpen && openReports && (
                        <div className="submenu">
                            <Link to="/admin/reports/revenue">Monthly Revenue</Link>
                            <Link to="/admin/reports/residents">Resident Count</Link>
                            <Link to="/admin/reports/payments">Payment Rate</Link>
                            <Link to="/admin/reports/services">Service Usage</Link>
                        </div>
                    )}
                </div>

                <Link to="/market" className="nav-item"><FaBuilding /> {isOpen && "Edit Properties"}</Link>
                <Link to="/news" className="nav-item"><FaNewspaper /> {isOpen && "News Manager"}</Link>
            </nav>
        </div>
    );
};

// --- NGUYÊN VĂN ADMIN LAYOUT ---
export const AdminLayout = () => {
    return (
        <div className="admin-page-wrapper">
            <AdminSidebar />
            <div className="admin-main-container">
                {/* THANH TOPBAR ĐÃ ĐƯỢC CHỈNH SỬA TỐI GIẢN */}
                <div className="admin-topbar">
                    <div className="vinahouse-header-brand">
                        <img
                            src="z7591806382044_ba5ea6e51b85fa2bcbf1489a10e60601.jpg"
                            alt=""
                            className="header-logo-img"
                        />
                        <span className="header-brand-name">VINAHOUSES</span>
                    </div>
                </div>
                <div className="admin-content-area">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

// --- NGUYÊN VĂN ADMIN DASHBOARD ---
export const AdminDashboard = () => {
    return (
        <div className="dashboard-content">
            <header className="content-header" style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2.5rem', color: '#1a202c' }}>Overview of the Management System</h2>
                <p style={{ fontSize: '1.2rem', color: '#718096' }}>Admin:</p>
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