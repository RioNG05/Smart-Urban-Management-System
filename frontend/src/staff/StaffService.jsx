import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/sections/auth/AuthContext';
import {
    FaBars, FaUserCircle, FaUser, FaClipboardList,
    FaCreditCard, FaNewspaper, FaConciergeBell, FaSignOutAlt,
    FaComments
} from 'react-icons/fa';

import StaffServiceMainContent from './StaffServiceMainContent';
import '../styles/manager.css';

const StaffService = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showIdCard, setShowIdCard] = useState(false);
    const [activeTab, setActiveTab] = useState('bookings');

    // --- LOGIC COMPLAINTS ---
    const { user } = useAuth();
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [replyNote, setReplyNote] = useState("");
    const [complaints, setComplaints] = useState([
        { id: 1, name: "Le Van Luong", room: "A-201", note: "Cleaning service was late by 2 hours", time: "08:30 - 20/03/2026", repliedBy: "Staff_Mike" },
        { id: 2, name: "Hoang Thu Thao", room: "C-1105", note: "Request to change yoga class time", time: "10:15 - 21/03/2026", repliedBy: null },
        { id: 3, name: "Do Manh Duc", room: "B-404", note: "Spa room was a bit cold during session", time: "14:50 - 22/03/2026", repliedBy: "Staff_Sarah" },
    ]);

    const handleAction = (id, type, note) => {
        setComplaints(complaints.map(c => 
            c.id === id ? { ...c, repliedBy: user?.username || "Staff Service", reply: note } : c
        ));
        alert("Reply saved!");
    };


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
                    <div className={`staff-nav-item ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaComments style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Complaint & Reply"}
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
                                        <p><strong>Department:</strong> Service Management</p>
                                        <p><strong>Join Date:</strong> 13/03/2026</p>
                                        <p><strong>Shift:</strong> 08:00 - 17:00</p>
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

                <StaffServiceMainContent
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

export default StaffService;
