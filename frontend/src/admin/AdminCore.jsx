import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useOutletContext, useNavigate } from 'react-router-dom';
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
    FaSignOutAlt
} from 'react-icons/fa';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import "../styles/admin.css";
import "../styles/staff.css";

const AdminSidebar = ({ isOpen, setIsOpen, upcomingCount }) => {
    const [openMenus, setOpenMenus] = useState({
        access: true,
        apartment: true,
        service: true
    });

    const toggleMenu = (menu) => {
        if (!isOpen) setIsOpen(true);
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const CategoryHeader = ({ title, menuKey, icon: Icon }) => (
        <div
            onClick={() => toggleMenu(menuKey)}
            className={`staff-nav-item`}
            style={{
                cursor: 'pointer',
                justifyContent: isOpen ? 'space-between' : 'center',
                padding: isOpen ? '12px 15px' : '15px 0'
            }}
            title={title}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: isOpen ? '15px' : '0' }} />
                {isOpen && <span style={{ fontWeight: '700', fontSize: '13px' }}>{title}</span>}
            </div>
            {isOpen && (openMenus[menuKey] ? <FaChevronDown style={{ fontSize: '12px' }} /> : <FaChevronRight style={{ fontSize: '12px' }} />)}
        </div>
    );

    return (
        <aside className={`staff-sidebar ${isOpen ? '' : 'closed'}`}>
            <div style={{ padding: '25px', display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'flex-start' : 'center' }}>
                <FaBars onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
                {isOpen && <span style={{ marginLeft: '15px', fontWeight: '800' }}>ADMIN HUB</span>}
            </div>

            <nav className="staff-sidebar-nav">

                <NavLink to="/admin" end className="staff-nav-item" style={{ justifyContent: isOpen ? 'flex-start' : 'center', padding: isOpen ? '12px 15px' : '15px 0' }}>
                    <FaHome style={{ marginRight: isOpen ? '15px' : '0' }} /> {isOpen && "Dashboard Home"}
                </NavLink>

                <CategoryHeader title="ACCESS CONTROL" menuKey="access" icon={FaLock} />
                {(isOpen && openMenus.access) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        <NavLink to="/admin/roles" className="staff-nav-item" style={{ padding: '8px 15px', fontSize: '13px' }}><FaUserShield style={{ marginRight: '10px' }} /> Permissions</NavLink>
                        <NavLink to="/admin/resident-account" className="staff-nav-item" style={{ padding: '8px 15px', fontSize: '13px' }}><FaUserLock style={{ marginRight: '10px' }} /> Resident Account</NavLink>
                    </div>
                )}

                <CategoryHeader title="APARTMENT & CONTRACT" menuKey="apartment" icon={FaLayerGroup} />
                {(isOpen && openMenus.apartment) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        <NavLink to="/admin/contracts/create" className="staff-nav-item" style={{ padding: '8px 15px', fontSize: '13px' }}><FaFileContract style={{ marginRight: '10px' }} /> Create Contract</NavLink>
                        <NavLink to="/admin/contracts/view" className="staff-nav-item" style={{ padding: '8px 15px', fontSize: '13px' }}><FaClipboardList style={{ marginRight: '10px' }} /> View Contracts</NavLink>
                        <NavLink to="/admin/apartment-layout" className="staff-nav-item" style={{ padding: '8px 15px', fontSize: '13px' }}><FaBuilding style={{ marginRight: '10px' }} /> Apartment</NavLink>
                    </div>
                )}

                <CategoryHeader title="SERVICE & SECURITY" menuKey="service" icon={FaShieldAlt} />
                {(isOpen && openMenus.service) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        <NavLink to="/admin/bookings" className="staff-nav-item" style={{ padding: '8px 15px', fontSize: '13px' }}><FaConciergeBell style={{ marginRight: '10px' }} /> Booking Management</NavLink>
                        <NavLink to="/admin/service-fees" className="staff-nav-item" style={{ padding: '8px 15px', fontSize: '13px' }}><FaCreditCard style={{ marginRight: '10px' }} /> Service Fee Stats</NavLink>
                        <NavLink to="/admin/visitors" className="staff-nav-item" style={{ padding: '8px 15px', fontSize: '13px' }}><FaUserPlus style={{ marginRight: '10px' }} /> Visitor Management</NavLink>
                    </div>
                )}

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

export const AdminDashboard = () => {
    const apartmentRevenueData = [
        { month: 'Jan', rent: 45000, utilities: 12000, management: 5000 },
        { month: 'Feb', rent: 46000, utilities: 11500, management: 5000 },
        { month: 'Mar', rent: 45000, utilities: 13000, management: 5000 },
        { month: 'Apr', rent: 47000, utilities: 14000, management: 5200 },
        { month: 'May', rent: 48000, utilities: 15500, management: 5200 },
        { month: 'Jun', rent: 50000, utilities: 18000, management: 5500 },
        { month: 'Jul', rent: 52000, utilities: 19500, management: 5500 },
    ];

    const serviceRevenueData = [
        { month: 'Jan', gym: 3000, bbq: 1200, sauna: 1500, hall: 800 },
        { month: 'Feb', gym: 3200, bbq: 1500, sauna: 1400, hall: 1000 },
        { month: 'Mar', gym: 3100, bbq: 1800, sauna: 1600, hall: 500 },
        { month: 'Apr', gym: 3500, bbq: 2000, sauna: 1800, hall: 1200 },
        { month: 'May', gym: 3600, bbq: 2200, sauna: 2000, hall: 1500 },
        { month: 'Jun', gym: 3800, bbq: 2500, sauna: 2100, hall: 2000 },
        { month: 'Jul', gym: 4000, bbq: 2800, sauna: 2300, hall: 1800 },
    ];

    return (
        <div className="dashboard-content staff-form-container" style={{ paddingBottom: '40px' }}>
            <header className="content-header" style={{ marginBottom: '30px' }}>
                <h2>Admin Dashboard Overview</h2>
                <p style={{ color: '#c89b3c', fontWeight: 'bold' }}>Real-time building management metrics</p>
            </header>

            {/* Quick Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {[
                    { title: 'Total Apartments', value: '1,000', icon: <FaBuilding />, color: '#3b82f6', bg: '#eff6ff' },
                    { title: 'Active Residents', value: '3,240', icon: <FaUsers />, color: '#10b981', bg: '#dcfce7' },
                    { title: 'Open Service Requests', value: '52', icon: <FaWrench />, color: '#f59e0b', bg: '#fef3c7' },
                    { title: 'Monthly Revenue', value: '$125k', icon: <FaMoneyBillWave />, color: '#c89b3c', bg: '#fefce8' }
                ].map((stat, i) => (
                    <div key={i} style={{ padding: '20px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #f1f5f9', transition: 'transform 0.2s ease', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: '600' }}>{stat.title}</p>
                            <h3 style={{ margin: '5px 0 0', color: '#1e293b', fontSize: '26px', fontWeight: '800' }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Area */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '30px' }}>
                {/* Apartment Revenue Chart */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '16px', color: '#1e293b', fontWeight: '800', marginBottom: '20px' }}>Apartment Revenue Breakdown</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={apartmentRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorMgmt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val / 1000}k`} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', padding: '10px' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                                <Area type="monotone" dataKey="rent" name="Rent/Sale" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRent)" stackId="1" />
                                <Area type="monotone" dataKey="utilities" name="Utilities" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUtil)" stackId="1" />
                                <Area type="monotone" dataKey="management" name="Management" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorMgmt)" stackId="1" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Revenue Chart */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '16px', color: '#1e293b', fontWeight: '800', marginBottom: '20px' }}>Service Revenue (Monthly)</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={serviceRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val / 1000}k`} />
                                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', padding: '10px' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                                <Bar dataKey="gym" name="Gym & Yoga" fill="#3b82f6" stackId="a" barSize={35} />
                                <Bar dataKey="bbq" name="BBQ" fill="#10b981" stackId="a" barSize={35} />
                                <Bar dataKey="sauna" name="Sauna & Spa" fill="#c89b3c" stackId="a" barSize={35} />
                                <Bar dataKey="hall" name="Community Hall" fill="#ef4444" stackId="a" barSize={35} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};