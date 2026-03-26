import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useOutletContext, useNavigate } from 'react-router-dom';
import {
    FaHome, FaUserShield, FaBuilding, FaNewspaper, FaBars,
    FaUserLock, FaChartPie, FaUsers,
    FaFileContract,
    FaMoneyBillWave,
    FaWrench,
    FaCalendarAlt,
    FaStar,
    FaUser
} from 'react-icons/fa';
import "../styles/admin.css";
import "../styles/staff.css";

const AdminSidebar = ({ isOpen, setIsOpen, upcomingCount }) => {
    return (
        <aside className={`staff-sidebar ${isOpen ? '' : 'closed'}`}>
            <div style={{ padding: '25px', display: 'flex', alignItems: 'center' }}>
                <FaBars onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }} />
                {isOpen && <span style={{ marginLeft: '15px', fontWeight: '800' }}>ADMIN HUB</span>}
            </div>

            <nav className="staff-sidebar-nav">
                <div style={{ padding: isOpen ? '15px 20px 5px' : '15px 0 5px', fontSize: '11px', color: '#64748b', fontWeight: '800', textAlign: isOpen ? 'left' : 'center', marginTop: '10px' }}>
                    {isOpen ? "ACCESS CONTROL" : "---"}
                </div>
                <NavLink to="/admin/roles" className="staff-nav-item"><FaUserShield /> {isOpen && "Permissions"}</NavLink>
                <NavLink to="/admin/lock-resident" className="staff-nav-item"><FaUserLock /> {isOpen && "Lock Resident"}</NavLink>

                <div style={{ padding: isOpen ? '15px 20px 5px' : '15px 0 5px', fontSize: '11px', color: '#64748b', fontWeight: '800', textAlign: isOpen ? 'left' : 'center', marginTop: '10px' }}>
                    {isOpen ? "APARTMENT & CONTRACT" : "---"}
                </div>
                <NavLink to="/admin/contracts/create" className="staff-nav-item"><FaFileContract /> {isOpen && "Create Contract"}</NavLink>
                <NavLink to="/admin/contracts/view" className="staff-nav-item"><FaBuilding /> {isOpen && "View Contracts"}</NavLink>
                <NavLink to="/admin/apartment-layout" className="staff-nav-item"><FaBuilding /> {isOpen && "Apartment Management"}</NavLink>

                <div style={{ padding: isOpen ? '15px 20px 5px' : '15px 0 5px', fontSize: '11px', color: '#64748b', fontWeight: '800', textAlign: isOpen ? 'left' : 'center', marginTop: '10px' }}>
                    {isOpen ? "REPORTS" : "---"}
                </div>
                <NavLink to="/admin/reports/revenue" className="staff-nav-item"><FaChartPie /> {isOpen && "Monthly Revenue"}</NavLink>
            </nav>
        </aside>
    );
};

export const AdminLayout = () => {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const [showIdCard, setShowIdCard] = useState(false);
    // Quản lý số lượng bảo trì toàn cục
    const [upcomingCount, setUpcomingCount] = useState(0);

    useEffect(() => {
        setAdminName('Super Admin');
    }, []);

    return (
        <div className="staff-wrapper">
            <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} upcomingCount={upcomingCount} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header className="staff-topbar" style={{ justifyContent: 'space-between' }}>
                    <nav className="staff-main-nav" style={{ marginRight: 0, alignItems: 'center' }}>
                        <a href="/admin" className="active">Admin</a>
                        <a href="/staff/apartment">Staff Apartment</a>
                        <a href="/staff/service">Staff Service</a>
                        <a href="/staff/security">Staff Security</a>
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button className="btn-header-home" onClick={() => navigate('/')}>
                            Home
                        </button>
                        <div className="staff-profile-trigger" onClick={() => setShowIdCard(!showIdCard)}>
                            <div className="profile-icon-wrapper">
                                <div className="profile-icon-inner">
                                    <FaUser />
                                </div>
                            </div>
                            {showIdCard && (
                                <div className="staff-id-card">
                                    <div className="id-card-header">
                                        <div className="staff-avatar-circle" style={{ background: '#0f172a' }}>SA</div>
                                        <h3 style={{ margin: 0 }}>{adminName}</h3>
                                        <p style={{ fontSize: '12px', color: '#64748b' }}>System Administrator</p>
                                    </div>
                                    <div style={{ fontSize: '13px' }}>
                                        <p><strong>Role:</strong> Super Admin</p>
                                        <p><strong>Department:</strong> System Management</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="staff-content-area">
                    {/* Truyền hàm cập nhật số lượng xuống các trang con */}
                    <Outlet context={{ setUpcomingCount }} />
                </div>
            </div>
        </div>
    );
};

export const AdminDashboard = () => {
    return (
        <div className="dashboard-content staff-form-container">
            <header className="content-header" style={{ marginBottom: '20px' }}>
                <h2>Overview of the Management System</h2>
                <p style={{ color: '#c89b3c', fontWeight: 'bold' }}>Quick actions and metrics</p>
            </header>

            <div className="admin-visual-grid">
                <div className="house-card" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000')", height: '250px' }}>
                    <div className="card-inner" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem' }}>Modify the Homepage interface.</h3>
                        <p style={{ marginBottom: '10px' }}>Edit banners, featured areas, and contact information.</p>
                        <button style={{ padding: '8px 15px' }} onClick={() => window.location.href = '/'}>Go to the Home page</button>
                    </div>
                </div>

                <div className="house-card" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000')", height: '250px' }}>
                    <div className="card-inner" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem' }}>Exchange Management</h3>
                        <p style={{ marginBottom: '10px' }}>Updated prices, photos, and status of VinaHouse apartments.</p>
                        <button style={{ padding: '8px 15px' }} onClick={() => window.location.href = '/market'}>Edit Products</button>
                    </div>
                </div>
            </div>
        </div>
    );
};