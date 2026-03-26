import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaBars, FaUserCircle, FaUser, FaShieldAlt, FaHistory,
    FaExclamationTriangle, FaWalking, FaPhoneAlt, FaNewspaper,
    FaBuilding, FaClipboardList
} from 'react-icons/fa';
import StaffSecurityMainContent from './StaffSecurityMainContent';
import '../styles/staff.css';

const StaffSecurity = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showIdCard, setShowIdCard] = useState(false);
    const [activeTab, setActiveTab] = useState('visitors');

    return (
        <div className="staff-wrapper">
            {/* SIDEBAR */}
            <aside className={`staff-sidebar ${sidebarOpen ? '' : 'closed'}`}>
                <div style={{ padding: '25px', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
                    <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
                    {sidebarOpen && <span style={{ marginLeft: '15px', fontWeight: '800' }}>SECURITY HUB</span>}
                </div>

                <nav className="staff-sidebar-nav">
                    <div className={`staff-nav-item ${activeTab === 'visitors' ? 'active' : ''}`} onClick={() => setActiveTab('visitors')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaUserCircle style={{ marginRight: sidebarOpen ? '15px' : '0' }}/> {sidebarOpen && "Visitor Management"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'emergency' ? 'active' : ''}`} onClick={() => setActiveTab('emergency')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaPhoneAlt style={{ marginRight: sidebarOpen ? '15px' : '0' }}/> {sidebarOpen && "Emergency & Alerts"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'incidents' ? 'active' : ''}`} onClick={() => setActiveTab('incidents')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaExclamationTriangle style={{ marginRight: sidebarOpen ? '15px' : '0' }}/> {sidebarOpen && "Incident Reports"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'patrols' ? 'active' : ''}`} onClick={() => setActiveTab('patrols')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaWalking style={{ marginRight: sidebarOpen ? '15px' : '0' }}/> {sidebarOpen && "Patrol Schedule"}
                    </div>
                </nav>
            </aside>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header className="staff-topbar" style={{ justifyContent: 'space-between' }}>
                    <nav className="staff-main-nav" style={{ marginRight: 0, alignItems: 'center' }}>
                        <a href="/admin">Admin</a>
                        <a href="/staff/apartment">Staff Apartment</a>
                        <a href="/staff/service">Staff Service</a>
                        <a href="/staff/security" className="active">Staff Security</a>
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
                                        <div className="staff-avatar-circle">SS</div>
                                        <h3 style={{ margin: 0 }}>Staff Security</h3>
                                        <p style={{ fontSize: '12px', color: '#64748b' }}>Security Supervisor | ID: SEC-2026</p>
                                    </div>
                                    <div style={{ fontSize: '13px' }}>
                                        <p><strong>Department:</strong> Security Services</p>
                                        <p><strong>Join Date:</strong> 15/03/2026</p>
                                        <p><strong>Shift:</strong> 06:00 - 18:00 (Day)</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <StaffSecurityMainContent activeTab={activeTab} />
            </div>
        </div>
    );
};

export default StaffSecurity;
