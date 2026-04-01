import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/sections/auth/AuthContext';
import {
    FaBars, FaUserCircle, FaUser, FaShieldAlt, FaHistory,
    FaExclamationTriangle, FaWalking, FaPhoneAlt, FaNewspaper,
    FaBuilding, FaClipboardList, FaSignOutAlt, FaComments
} from 'react-icons/fa';

import StaffSecurityMainContent from './StaffSecurityMainContent';
import '../styles/manager.css';

const StaffSecurity = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showIdCard, setShowIdCard] = useState(false);
    const [activeTab, setActiveTab] = useState('visitors');

    // --- LOGIC COMPLAINTS ---
    const { user } = useAuth();
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [replyNote, setReplyNote] = useState("");
    const [complaints, setComplaints] = useState([
        { id: 1, name: "Nguyen Hoai Nam", room: "D-102", note: "Found a suspicious package in the lobby", time: "07:15 - 20/03/2026", repliedBy: null },
        { id: 2, name: "Le Thi Thu", room: "A-505", note: "Noise complaint: neighbor's dog barking all night", time: "02:30 - 21/03/2026", repliedBy: "Staff_Jack" },
        { id: 3, name: "Tran Van Long", room: "B-201", note: "Suspected unauthorized person in the parking basement", time: "23:45 - 22/03/2026", repliedBy: "Staff_Jack" },
    ]);

    const handleAction = (id, type, note) => {
        setComplaints(complaints.map(c => 
            c.id === id ? { ...c, repliedBy: user?.username || "Staff Security", reply: note } : c
        ));
        alert("Security reply logged!");
    };


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
                        <FaUserCircle style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Visitor Management"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaComments style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Complaint & Reply"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'emergency' ? 'active' : ''}`} onClick={() => setActiveTab('emergency')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaPhoneAlt style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Emergency & Alerts"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'incidents' ? 'active' : ''}`} onClick={() => setActiveTab('incidents')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaExclamationTriangle style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Incident Reports"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'patrols' ? 'active' : ''}`} onClick={() => setActiveTab('patrols')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaWalking style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Patrol Schedule"}
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

                <StaffSecurityMainContent
                    activeTab={activeTab}
                    selectedComplaint={selectedComplaint}
                    complaints={complaints}
                    setSelectedComplaint={setSelectedComplaint}
                    handleAction={handleAction}
                    replyNote={replyNote}
                    setReplyNote={setReplyNote}
                />

            </div>
        </div>
    );
};

export default StaffSecurity;
