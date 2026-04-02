import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, NavLink, useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/sections/auth/AuthContext';
import {
    FaHome, FaUserShield, FaBuilding, FaNewspaper, FaBars,
    FaUserLock, FaChartPie, FaUsers,
    FaFileContract,
    FaMoneyBillWave,
    FaWrench,
    FaCalendarAlt,
    FaStar,
    FaUser,
    FaClipboardList,
    FaConciergeBell,
    FaCreditCard,
    FaUserPlus,
    FaChevronDown,
    FaChevronRight,
    FaLock,
    FaLayerGroup,
    FaShieldAlt,
    FaSignOutAlt,
    FaComments,
    FaFileInvoiceDollar,
    FaHistory
} from 'react-icons/fa';

import "../styles/manager.css";
import Dashboard from '../components/sections/manager/Dashboard';
export { Dashboard };


const AdminSidebar = ({ isOpen, setIsOpen, upcomingCount }) => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({
        access: false,
        apartment: false,
        contracts: false,
        service: false,
        security: false,
    });

    const toggleMenu = (menu) => {
        if (!isOpen) setIsOpen(true);
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    // Định nghĩa các route thuộc về từng category để check active state
    const categoryRoutes = {
        access: ['/admin/roles', '/admin/accounts', '/admin/resident-account'],
        apartment: ['/admin/apartment-layout', '/admin/apartment-types'],
        contracts: ['/admin/contracts/create', '/admin/contracts/view'],
        service: [ '/admin/utilities-invoices','/admin/bookings', '/admin/service-fees'],
        security: ['/admin/visitors'],
    };

    const isCategoryActive = (menuKey) => {
        const routes = categoryRoutes[menuKey] || [];
        return routes.some(route => location.pathname.startsWith(route));
    };

    const CategoryHeader = ({ title, menuKey, icon: Icon }) => {
        const active = isCategoryActive(menuKey);
        
        return (
            <div
                onClick={() => toggleMenu(menuKey)}
                className={`staff-nav-item ${(!isOpen && active) ? 'active' : ''}`}
                style={{
                    cursor: 'pointer',
                    justifyContent: isOpen ? 'space-between' : 'center',
                    padding: isOpen ? '12px 15px' : '15px 0',
                    color: (!isOpen && active) ? 'var(--admin-primary)' : 'inherit'
                }}
                title={title}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon style={{ marginRight: isOpen ? '15px' : '0' }} />
                    {isOpen && (
                        <span style={{ 
                            fontWeight: '800', 
                            fontSize: '11.5px', 
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {title}
                        </span>
                    )}
                </div>
                {isOpen && (openMenus[menuKey] ? <FaChevronDown style={{ fontSize: '11px' }} /> : <FaChevronRight style={{ fontSize: '11px' }} />)}
            </div>
        );
    };

    const subNavLinkStyle = {
        padding: '9px 15px',
        fontSize: '14.5px', // Tăng size cho đề mục nhỏ
        fontWeight: '500'
    };

    return (
        <aside className={`staff-sidebar ${isOpen ? '' : 'closed'}`}>
            <div style={{ padding: '25px', display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'flex-start' : 'center' }}>
                <FaBars onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
                {isOpen && <span style={{ marginLeft: '15px', fontWeight: '800' }}>ADMIN HUB</span>}
            </div>

            <nav className="staff-sidebar-nav">
                {/* Home */}
                <NavLink to="/admin" end className="staff-nav-item" style={{ justifyContent: isOpen ? 'flex-start' : 'center', padding: isOpen ? '12px 15px' : '15px 0' }}>
                    <FaHome style={{ marginRight: isOpen ? '15px' : '0' }} /> {isOpen && <span style={{ fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Dashboard Home</span>}
                </NavLink>

                {/* 1. ACCESS CONTROL */}
                <CategoryHeader title="ACCESS CONTROL" menuKey="access" icon={FaLock} />
                {(isOpen && openMenus.access) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        <NavLink to="/admin/roles" className="staff-nav-item" style={subNavLinkStyle}><FaUserShield style={{ marginRight: '10px' }} /> Permissions</NavLink>
                        <NavLink to="/admin/accounts" className="staff-nav-item" style={subNavLinkStyle}><FaUsers style={{ marginRight: '10px' }} /> Account Management</NavLink>
                        <NavLink to="/admin/resident-account" className="staff-nav-item" style={subNavLinkStyle}><FaUserLock style={{ marginRight: '10px' }} /> Resident Account</NavLink>
                    </div>
                )}

                {/* 2. APARTMENT */}
                <CategoryHeader title="APARTMENT" menuKey="apartment" icon={FaBuilding} />
                {(isOpen && openMenus.apartment) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        <NavLink to="/admin/apartment-layout" className="staff-nav-item" style={subNavLinkStyle}><FaBuilding style={{ marginRight: '10px' }} /> Apartment</NavLink>
                        <NavLink to="/admin/apartment-types" className="staff-nav-item" style={subNavLinkStyle}><FaLayerGroup style={{ marginRight: '10px' }} /> Apartment Types</NavLink>
                        <NavLink to="/admin/stay-history" className="staff-nav-item" style={subNavLinkStyle}><FaHistory style={{ marginRight: '10px' }} /> Stay At History</NavLink>
                    </div>
                )}

                {/* 3. CONTRACTS */}
                <CategoryHeader title="CONTRACTS" menuKey="contracts" icon={FaFileContract} />
                {(isOpen && openMenus.contracts) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        <NavLink to="/admin/contracts/create" className="staff-nav-item" style={subNavLinkStyle}><FaFileContract style={{ marginRight: '10px' }} /> Create Contract</NavLink>
                        <NavLink to="/admin/contracts/view" className="staff-nav-item" style={subNavLinkStyle}><FaClipboardList style={{ marginRight: '10px' }} /> View Contracts</NavLink>
                    </div>
                )}

                {/* 4. SERVICE & INVOICE (Đưa lên trước Security) */}
                <CategoryHeader title="SERVICE & INVOICE" menuKey="service" icon={FaFileInvoiceDollar} />
                {(isOpen && openMenus.service) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        <NavLink to="/admin/utilities-invoices" className="staff-nav-item" style={subNavLinkStyle}><FaFileInvoiceDollar style={{ marginRight: '10px' }} /> Utilities Invoice</NavLink>
                        <NavLink to="/admin/bookings" className="staff-nav-item" style={subNavLinkStyle}><FaConciergeBell style={{ marginRight: '10px' }} /> Booking Management</NavLink>
                        <NavLink to="/admin/service-fees" className="staff-nav-item" style={subNavLinkStyle}><FaCreditCard style={{ marginRight: '10px' }} /> Service Fee Stats</NavLink>
                        
                    </div>
                )}

                {/* 5. SECURITY */}
                <CategoryHeader title="SECURITY" menuKey="security" icon={FaShieldAlt} />
                {(isOpen && openMenus.security) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        <NavLink to="/admin/visitors" className="staff-nav-item" style={subNavLinkStyle}><FaUserPlus style={{ marginRight: '10px' }} /> Visitor Management</NavLink>
                    </div>
                )}

                {/* 6. COMPLAINTS (Standalone) */}
                <NavLink to="/admin/complaints" end className="staff-nav-item" style={{ justifyContent: isOpen ? 'flex-start' : 'center', padding: isOpen ? '12px 15px' : '15px 0' }}>
                    <FaComments style={{ marginRight: isOpen ? '15px' : '0' }} /> 
                    {isOpen && <span style={{ fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Complaints</span>}
                </NavLink>
            </nav>
        </aside>
    );
};

export const AdminLayout = () => {
    const { logout } = useAuth();
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
                            <FaHome /> Home
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
                                    <div className="logout-btn-wrapper">
                                        <button className="btn-logout-account" onClick={() => logout()}>
                                            <FaSignOutAlt /> Logout Account
                                        </button>
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
