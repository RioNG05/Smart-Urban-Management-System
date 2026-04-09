import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, NavLink, useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/sections/auth/AuthContext';
import { getMyAccount } from '../services/profileService';
import {
    getNotificationsByRole,
    markNotificationAsRead,
} from '../services/notificationService';
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
    FaCogs,
    FaUserPlus,
    FaChevronDown,
    FaChevronRight,
    FaLock,
    FaLayerGroup,
    FaShieldAlt,
    FaSignOutAlt,
    FaComments,
    FaFileInvoiceDollar,
    FaHistory,
    FaBell
} from 'react-icons/fa';

import "../styles/manager.css";
import Dashboard from '../components/sections/manager/Dashboard';
import { canAccessAdminSection, getDefaultAdminPath } from './adminAccess';
export { Dashboard };


const AdminSidebar = ({ isOpen, setIsOpen, upcomingCount }) => {
    const location = useLocation();
    const { role } = useAuth();
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
        apartment: ['/admin/apartment-layout', '/admin/apartment-types', '/admin/stay-history'],
        contracts: ['/admin/contracts'],
        service: ['/admin/services', '/admin/utilities-invoices', '/admin/bookings', '/admin/service-fees'],
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

    const canAccess = (sectionKey) => canAccessAdminSection(role, sectionKey);
    const showAccessMenu = canAccess('roles') || canAccess('accounts') || canAccess('residentAccount');
    const showApartmentMenu = canAccess('apartmentLayout') || canAccess('apartmentTypes') || canAccess('stayHistory');
    const showContractMenu = canAccess('contracts');
    const showServiceMenu = canAccess('utilitiesInvoices') || canAccess('services') || canAccess('bookings') || canAccess('serviceFees');
    const showSecurityMenu = canAccess('visitors');

    return (
        <aside className={`staff-sidebar ${isOpen ? '' : 'closed'}`}>
            <div style={{ padding: '25px', display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'flex-start' : 'center' }}>
                <FaBars onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
                {isOpen && <span style={{ marginLeft: '15px', fontWeight: '800' }}>ADMIN HUB</span>}
            </div>

            <nav className="staff-sidebar-nav">
                {/* Home */}
                <NavLink to={getDefaultAdminPath(role)} end className="staff-nav-item" style={{ justifyContent: isOpen ? 'flex-start' : 'center', padding: isOpen ? '12px 15px' : '15px 0' }}>
                    <FaHome style={{ marginRight: isOpen ? '15px' : '0' }} /> {isOpen && <span style={{ fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Dashboard Home</span>}
                </NavLink>

                {/* 1. ACCESS CONTROL */}
                {showAccessMenu && <CategoryHeader title="ACCESS CONTROL" menuKey="access" icon={FaLock} />}
                {(showAccessMenu && isOpen && openMenus.access) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        {canAccess('roles') && <NavLink to="/admin/roles" className="staff-nav-item" style={subNavLinkStyle}><FaUserShield style={{ marginRight: '10px' }} /> Permissions</NavLink>}
                        {canAccess('accounts') && <NavLink to="/admin/accounts" className="staff-nav-item" style={subNavLinkStyle}><FaUsers style={{ marginRight: '10px' }} /> Account Management</NavLink>}
                        {canAccess('residentAccount') && <NavLink to="/admin/resident-account" className="staff-nav-item" style={subNavLinkStyle}><FaUserLock style={{ marginRight: '10px' }} /> Resident Account</NavLink>}
                    </div>
                )}

                {/* 2. APARTMENT */}
                {showApartmentMenu && <CategoryHeader title="APARTMENT" menuKey="apartment" icon={FaBuilding} />}
                {(showApartmentMenu && isOpen && openMenus.apartment) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        {canAccess('apartmentLayout') && <NavLink to="/admin/apartment-layout" className="staff-nav-item" style={subNavLinkStyle}><FaBuilding style={{ marginRight: '10px' }} /> Apartment</NavLink>}
                        {canAccess('apartmentTypes') && <NavLink to="/admin/apartment-types" className="staff-nav-item" style={subNavLinkStyle}><FaLayerGroup style={{ marginRight: '10px' }} /> Apartment Types</NavLink>}
                        {canAccess('stayHistory') && <NavLink to="/admin/stay-history" className="staff-nav-item" style={subNavLinkStyle}><FaHistory style={{ marginRight: '10px' }} /> Stay At History</NavLink>}
                    </div>
                )}

                {/* 3. CONTRACTS */}
                {showContractMenu && <CategoryHeader title="CONTRACTS" menuKey="contracts" icon={FaFileContract} />}
                {(showContractMenu && isOpen && openMenus.contracts) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        <NavLink to="/admin/contracts" className="staff-nav-item" style={subNavLinkStyle}><FaFileContract style={{ marginRight: '10px' }} /> Contracts</NavLink>
                    </div>
                )}

                {/* 4. SERVICE & INVOICE (Đưa lên trước Security) */}
                {showServiceMenu && <CategoryHeader title="SERVICE & INVOICE" menuKey="service" icon={FaFileInvoiceDollar} />}
                {(showServiceMenu && isOpen && openMenus.service) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        {canAccess('utilitiesInvoices') && <NavLink to="/admin/utilities-invoices" className="staff-nav-item" style={subNavLinkStyle}><FaFileInvoiceDollar style={{ marginRight: '10px' }} /> Utilities Invoice</NavLink>}
                        {canAccess('services') && <NavLink to="/admin/services" className="staff-nav-item" style={subNavLinkStyle}><FaCogs style={{ marginRight: '10px' }} /> Service Management</NavLink>}
                        {canAccess('bookings') && <NavLink to="/admin/bookings" className="staff-nav-item" style={subNavLinkStyle}><FaConciergeBell style={{ marginRight: '10px' }} /> Booking Management</NavLink>}
                        {canAccess('serviceFees') && <NavLink to="/admin/service-fees" className="staff-nav-item" style={subNavLinkStyle}><FaCreditCard style={{ marginRight: '10px' }} /> Service Fee Stats</NavLink>}
                        
                    </div>
                )}

                {/* 5. SECURITY */}
                {showSecurityMenu && <CategoryHeader title="SECURITY" menuKey="security" icon={FaShieldAlt} />}
                {(showSecurityMenu && isOpen && openMenus.security) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '20px', marginBottom: '10px' }}>
                        <NavLink to="/admin/visitors" className="staff-nav-item" style={subNavLinkStyle}><FaUserPlus style={{ marginRight: '10px' }} /> Visitor Management</NavLink>
                    </div>
                )}

                {/* 6. COMPLAINTS (Standalone) */}
                {canAccess('news') && <NavLink to="/admin/news" end className="staff-nav-item" style={{ justifyContent: isOpen ? 'flex-start' : 'center', padding: isOpen ? '12px 15px' : '15px 0' }}>
                    <FaNewspaper style={{ marginRight: isOpen ? '15px' : '0' }} />
                    {isOpen && <span style={{ fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '1px' }}>News</span>}
                </NavLink>}

                {/* 7. COMPLAINTS (Standalone) */}
                {canAccess('complaints') && <NavLink to="/admin/complaints" end className="staff-nav-item" style={{ justifyContent: isOpen ? 'flex-start' : 'center', padding: isOpen ? '12px 15px' : '15px 0' }}>
                    <FaComments style={{ marginRight: isOpen ? '15px' : '0' }} /> 
                    {isOpen && <span style={{ fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Complaints</span>}
                </NavLink>}
            </nav>
        </aside>
    );
};

export const AdminLayout = () => {
    const { logout, role, user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [adminAccount, setAdminAccount] = useState(user || null);
    const [isOpen, setIsOpen] = useState(true);
    const [showIdCard, setShowIdCard] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    // Quản lý số lượng bảo trì toàn cục
    const [upcomingCount, setUpcomingCount] = useState(0);

    useEffect(() => {
        setAdminAccount(user || null);
    }, [user]);

    useEffect(() => {
        if (!isAuthenticated) {
            setAdminAccount(null);
            return;
        }

        if (user?.id && user?.username) {
            return;
        }

        let active = true;

        const loadMyAccount = async () => {
            try {
                const account = await getMyAccount();
                if (active) {
                    setAdminAccount(account);
                }
            } catch (error) {
                console.error('Failed to load admin account', error);
            }
        };

        loadMyAccount();

        return () => {
            active = false;
        };
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (role !== 'MANAGER') {
            setNotifications([]);
            return;
        }

        let active = true;

        const loadNotifications = async ({ silent = false } = {}) => {
            if (!silent) {
                setLoadingNotifications(true);
            }

            try {
                const items = await getNotificationsByRole('MANAGER');
                if (active) {
                    setNotifications(items);
                }
            } catch (error) {
                if (!silent) {
                    console.error('Failed to load admin notifications', error);
                }
            } finally {
                if (active) {
                    setLoadingNotifications(false);
                }
            }
        };

        loadNotifications();
        const intervalId = window.setInterval(() => loadNotifications({ silent: true }), 15000);

        return () => {
            active = false;
            window.clearInterval(intervalId);
        };
    }, [role]);

    const unreadNotifications = useMemo(
        () => notifications.filter((item) => !item.isRead),
        [notifications]
    );

    const handleNotificationClick = async (notification) => {
        if (!notification?.id) return;

        try {
            if (!notification.isRead) {
                await markNotificationAsRead(notification.id);
                setNotifications((current) =>
                    current.map((item) =>
                        item.id === notification.id ? { ...item, isRead: true } : item
                    )
                );
            }
        } catch (error) {
            console.error('Failed to mark admin notification as read', error);
        } finally {
            setOpenNotifications(false);
            if (notification.relatedUrl) {
                navigate(notification.relatedUrl);
            }
        }
    };

    const handleMarkAllNotificationsAsRead = async () => {
        const unreadIds = unreadNotifications.map((item) => item.id).filter(Boolean);
        if (!unreadIds.length) return;

        try {
            await Promise.all(unreadIds.map((id) => markNotificationAsRead(id)));
            setNotifications((current) =>
                current.map((item) => ({ ...item, isRead: true }))
            );
        } catch (error) {
            console.error('Failed to mark all admin notifications as read', error);
        }
    };

    const formatNotificationTime = (value) => {
        if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
            return '';
        }

        return value.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const adminDisplayName = adminAccount?.username || user?.username || 'Admin';
    const adminEmail = adminAccount?.email || user?.email || 'No email';
    const adminRole = adminAccount?.role?.roleName || user?.role?.roleName || role || 'MANAGER';
    const adminInitials = adminDisplayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('') || 'AD';

    return (
        <div className="staff-wrapper">
            <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} upcomingCount={upcomingCount} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header className="staff-topbar admin-topbar-clean">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <button
                                type="button"
                                onClick={() => setOpenNotifications((prev) => !prev)}
                                style={{
                                    position: 'relative',
                                    border: '1px solid #dbe2ea',
                                    background: '#fff',
                                    borderRadius: '999px',
                                    width: '42px',
                                    height: '42px',
                                    display: 'grid',
                                    placeItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <FaBell />
                                {unreadNotifications.length > 0 && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '-4px',
                                            right: '-2px',
                                            minWidth: '18px',
                                            height: '18px',
                                            borderRadius: '999px',
                                            background: '#dc2626',
                                            color: '#fff',
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            display: 'grid',
                                            placeItems: 'center',
                                            padding: '0 5px',
                                        }}
                                    >
                                        {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                                    </span>
                                )}
                            </button>

                            {openNotifications && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '52px',
                                        right: 0,
                                        width: '360px',
                                        maxHeight: '420px',
                                        overflow: 'auto',
                                        background: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '18px',
                                        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
                                        zIndex: 30,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '14px 16px',
                                            borderBottom: '1px solid #eef2f7',
                                        }}
                                    >
                                        <div>
                                            <strong>Notifications</strong>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                {unreadNotifications.length} unread
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleMarkAllNotificationsAsRead}
                                            disabled={!unreadNotifications.length}
                                            style={{
                                                border: 'none',
                                                background: 'transparent',
                                                color: unreadNotifications.length ? '#0f172a' : '#94a3b8',
                                                cursor: unreadNotifications.length ? 'pointer' : 'default',
                                                fontWeight: '600',
                                            }}
                                        >
                                            Mark all read
                                        </button>
                                    </div>

                                    <div style={{ padding: '8px' }}>
                                        {loadingNotifications ? (
                                            <div style={{ padding: '16px', color: '#64748b' }}>Loading notifications...</div>
                                        ) : notifications.length === 0 ? (
                                            <div style={{ padding: '16px', color: '#64748b' }}>No notifications yet.</div>
                                        ) : (
                                            notifications.slice(0, 10).map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleNotificationClick(item)}
                                                    style={{
                                                        width: '100%',
                                                        textAlign: 'left',
                                                        border: 'none',
                                                        background: item.isRead ? '#fff' : '#f8fafc',
                                                        borderRadius: '14px',
                                                        padding: '12px 14px',
                                                        marginBottom: '8px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                                        <strong style={{ color: '#0f172a' }}>{item.title}</strong>
                                                        {!item.isRead && (
                                                            <span
                                                                style={{
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    borderRadius: '999px',
                                                                    background: '#2563eb',
                                                                    marginTop: '6px',
                                                                    flexShrink: 0,
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <p style={{ margin: '6px 0', color: '#475569', fontSize: '13px', lineHeight: 1.5 }}>
                                                        {item.message}
                                                    </p>
                                                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                                        {formatNotificationTime(item.createdDate)}
                                                    </span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

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
                                        <div className="staff-avatar-circle" style={{ background: '#0f172a' }}>{adminInitials}</div>
                                        <h3 style={{ margin: 0 }}>{adminDisplayName}</h3>
                                        <p style={{ fontSize: '12px', color: '#64748b' }}>{adminEmail}</p>
                                    </div>
                                    <div style={{ fontSize: '13px' }}>
                                        <p><strong>Role:</strong> {adminRole}</p>
                                        {adminAccount?.id && <p><strong>Account ID:</strong> {adminAccount.id}</p>}
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
