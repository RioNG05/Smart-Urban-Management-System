import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaBars, FaUserCircle, FaUser, FaClipboardList,
    FaCreditCard, FaNewspaper, FaConciergeBell
} from 'react-icons/fa';
import StaffServiceMainContent from './StaffServiceMainContent';
import '../styles/staff.css';

const StaffService = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showIdCard, setShowIdCard] = useState(false);
    const [activeTab, setActiveTab] = useState('bookings');

    return (
        <div className="staff-wrapper">
            {/* SIDEBAR */}
            <aside className={`staff-sidebar ${sidebarOpen ? '' : 'closed'}`}>
                <div style={{ padding: '25px', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
                    <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
                    {sidebarOpen && <span style={{ marginLeft: '15px', fontWeight: '800' }}>SERVICE HUB</span>}
                </div>

                <nav className="staff-sidebar-nav">
                    <div className={`staff-nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaConciergeBell style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Booking Management"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => setActiveTab('fees')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaCreditCard style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Service Fee Stats"}
                    </div>
                </nav>
            </aside>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header className="staff-topbar" style={{ justifyContent: 'space-between' }}>
                    <nav className="staff-main-nav" style={{ marginRight: 0, alignItems: 'center' }}>
                        <a href="/admin">Admin</a>
                        <a href="/staff/apartment">Staff Apartment</a>
                        <a href="/staff/service" className="active">Staff Service</a>
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
                                        <div className="staff-avatar-circle">SV</div>
                                        <h3 style={{ margin: 0 }}>Staff Service</h3>
                                        <p style={{ fontSize: '12px', color: '#64748b' }}>Service Coordinator | ID: SVC-2026</p>
                                    </div>
                                    <div style={{ fontSize: '13px' }}>
                                        <p><strong>Department:</strong> Resident Services</p>
                                        <p><strong>Join Date:</strong> 10/02/2026</p>
                                        <p><strong>Responsibility:</strong> Amenity Management</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <StaffServiceMainContent activeTab={activeTab} />
            </div>
        </div>
    );
};

export default StaffService;
