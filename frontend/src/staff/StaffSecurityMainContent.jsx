import React, { useState } from 'react';
import {
    FaUserPlus, FaHistory, FaCheck, FaTimes, FaClipboardList,
    FaExclamationCircle, FaShieldAlt, FaPhoneAlt, FaMapMarkerAlt,
    FaClock, FaUserShield, FaBell, FaFireExtinguisher, FaAmbulance, FaUserTie
} from 'react-icons/fa';

const StaffSecurityMainContent = ({ activeTab }) => {
    // --- MOCK DATA FOR SECURITY ---
    const [visitors, setVisitors] = useState([
        { id: 1, name: "Le Van C", idCard: "001095012345", phone: "0901234567", purpose: "Visit A-505", checkIn: "08:30 - 17/03/2026", status: "Registered" },
        { id: 2, name: "Pham Thi D", idCard: "001092098765", phone: "0912345678", purpose: "Delivery", checkIn: "14:20 - 17/03/2026", status: "Registered" },
        { id: 3, name: "Hoang Van E", idCard: "001088456123", phone: "0923456789", purpose: "Maintenance", checkIn: "09:00 - 18/03/2026", status: "Registered" },
        { id: 4, name: "Do Thi F", idCard: "001090789456", phone: "0934567890", purpose: "Guest A-1204", checkIn: "10:30 - 18/03/2026", status: "Registered" },
        { id: 5, name: "Nguyen Van G", idCard: "001094123450", phone: "0945678901", purpose: "Visit B-101", checkIn: "11:15 - 18/03/2026", status: "Registered" },
        { id: 6, name: "Tran Thi H", idCard: "001085543216", phone: "0956789012", purpose: "Cleaning Service", checkIn: "13:00 - 18/03/2026", status: "Registered" },
        { id: 7, name: "Le Van I", idCard: "001091678905", phone: "0967890123", purpose: "Visit C-202", checkIn: "14:45 - 18/03/2026", status: "Registered" },
        { id: 8, name: "Pham Van J", idCard: "001089901234", phone: "0978901234", purpose: "Delivery Food", checkIn: "18:00 - 18/03/2026", status: "Registered" },
        { id: 9, name: "Hoang Thi K", idCard: "001096234567", phone: "0989012345", purpose: "Visit D-808", checkIn: "08:00 - 19/03/2026", status: "Registered" },
        { id: 10, name: "Do Van L", idCard: "001093345678", phone: "0990123456", purpose: "Maintenance AC", checkIn: "09:30 - 19/03/2026", status: "Registered" },
        { id: 11, name: "Nguyen Thi M", idCard: "001097456789", phone: "0901234567", purpose: "Guest B-702", checkIn: "10:45 - 19/03/2026", status: "Registered" },
        { id: 12, name: "Tran Van N", idCard: "001087567890", phone: "0912345678", purpose: "Visit A-1405", checkIn: "12:15 - 19/03/2026", status: "Registered" },
        { id: 13, name: "Le Thi O", idCard: "001092678901", phone: "0923456789", purpose: "Delivery Package", checkIn: "14:30 - 19/03/2026", status: "Registered" },
        { id: 14, name: "Pham Van P", idCard: "001090789012", phone: "0934567890", purpose: "Visit C-1204", checkIn: "16:00 - 19/03/2026", status: "Registered" },
        { id: 15, name: "Hoang Van Q", idCard: "001095890123", phone: "0945678901", purpose: "Guest D-510", checkIn: "19:30 - 19/03/2026", status: "Registered" },
        { id: 16, name: "Do Thi R", idCard: "001084901234", phone: "0956789012", purpose: "Visit A-908", checkIn: "08:45 - 20/03/2026", status: "Registered" },
        { id: 17, name: "Nguyen Van S", idCard: "001098012345", phone: "0967890123", purpose: "Maintenance Lift", checkIn: "10:00 - 20/03/2026", status: "Registered" },
        { id: 18, name: "Tran Thi T", idCard: "001091123456", phone: "0978901234", purpose: "Visit B-1005", checkIn: "11:30 - 20/03/2026", status: "Registered" },
        { id: 19, name: "Le Van U", idCard: "001093234567", phone: "0989012345", purpose: "Delivery Grab", checkIn: "13:45 - 20/03/2026", status: "Registered" },
        { id: 20, name: "Pham Thi V", idCard: "001086345678", phone: "0990123456", purpose: "Visit C-306", checkIn: "15:20 - 20/03/2026", status: "Registered" },
        { id: 21, name: "Hoang Van W", idCard: "001094456789", phone: "0901234567", purpose: "Visit D-111", checkIn: "17:10 - 20/03/2026", status: "Registered" },
        { id: 22, name: "Do Van X", idCard: "001090567890", phone: "0912345678", purpose: "Guest A-607", checkIn: "09:00 - 21/03/2026", status: "Registered" },
        { id: 23, name: "Nguyen Thi Y", idCard: "001096678901", phone: "0923456789", purpose: "Cleaning Service", checkIn: "10:30 - 21/03/2026", status: "Registered" },
        { id: 24, name: "Tran Van Z", idCard: "001088789012", phone: "0934567890", purpose: "Visit B-212", checkIn: "12:00 - 21/03/2026", status: "Registered" },
        { id: 25, name: "Le Thi AA", idCard: "001095890123", phone: "0945678901", purpose: "Visit C-1502", checkIn: "14:15 - 21/03/2026", status: "Registered" },
        { id: 26, name: "Pham Van BB", idCard: "001092901234", phone: "0956789012", purpose: "Delivery Lazada", checkIn: "16:45 - 21/03/2026", status: "Registered" },
        { id: 27, name: "Hoang Thi CC", idCard: "001097012345", phone: "0967890123", purpose: "Visit D-404", checkIn: "18:30 - 21/03/2026", status: "Registered" },
        { id: 28, name: "Do Van DD", idCard: "001085123456", phone: "0978901234", purpose: "Visit A-1210", checkIn: "08:15 - 22/03/2026", status: "Registered" },
        { id: 29, name: "Nguyen Van EE", idCard: "001093234567", phone: "0989012345", purpose: "Maintenance Fire", checkIn: "10:00 - 22/03/2026", status: "Registered" },
        { id: 30, name: "Tran Thi FF", idCard: "001090345678", phone: "0990123456", purpose: "Guest B-808", checkIn: "11:45 - 22/03/2026", status: "Registered" }
    ]);


    const [visitorForm, setVisitorForm] = useState({
        name: '',
        idCard: '',
        phone: '',
        purpose: ''
    });

    const handleCheckIn = () => {
        if (!visitorForm.name || !visitorForm.idCard) {
            alert("Please enter at least Visitor Name and ID card!");
            return;
        }

        const newVisitor = {
            id: Date.now(),
            ...visitorForm,
            checkIn: new Date().toLocaleString(),
            status: "Registered"
        };

        // [BACKEND_NOTE]: Call API (POST /api/security/visitors) to save new check-in to database
        // await axios.post('/api/security/visitors', newVisitor);

        setVisitors([newVisitor, ...visitors]);
        setVisitorForm({ name: '', idCard: '', phone: '', purpose: '' });
        alert("Visitor checked-in successfully!");
    };

    const [incidents, setIncidents] = useState([
        { id: 1, title: "Elevator Malfunction", location: "Block A", time: "09:00 - 16/03/2026", priority: "High", status: "Resolved" },
        { id: 2, title: "Unidentified Vehicle in Restricted Area", location: "Basement 2", time: "22:15 - 16/03/2026", priority: "Medium", status: "Under Investigation" },
        { id: 3, title: "Noise Complaint", location: "Floor 8, Block B", time: "23:45 - 17/03/2026", priority: "Low", status: "Resolved" },
        { id: 4, title: "Package Tampering Reported", location: "Mailroom", time: "11:30 - 18/03/2026", priority: "High", status: "Pending" },
        { id: 5, title: "Water Leak in Corridor", location: "Floor 12, Block A", time: "08:15 - 19/03/2026", priority: "Medium", status: "Resolved" },
        { id: 6, title: "Broken Light Fixture", location: "Side Entrance", time: "19:40 - 19/03/2026", priority: "Low", status: "Pending" },
        { id: 7, title: "Suspicious Person Loitering", location: "Pool Area", time: "21:10 - 19/03/2026", priority: "Medium", status: "Resolved" },
        { id: 8, title: "Fire Alarm False Trigger", location: "Block D", time: "03:20 - 20/03/2026", priority: "High", status: "Resolved" },
        { id: 9, title: "Lost Property Found (Keys)", location: "Lobby Block C", time: "10:30 - 20/03/2026", priority: "Low", status: "Pending" },
        { id: 10, title: "Unauthorized Pet in Common Area", location: "Garden", time: "16:45 - 20/03/2026", priority: "Low", status: "Resolved" },
        { id: 11, title: "Power Trip Reported", location: "Unit B-508", time: "20:15 - 20/03/2026", priority: "Medium", status: "Resolved" },
        { id: 12, title: "Stuck Trash Chute", location: "Floor 6, Block A", time: "09:00 - 21/03/2026", priority: "Low", status: "Pending" },
        { id: 13, title: "Graffiti Discovered", location: "Back Wall", time: "07:30 - 21/03/2026", priority: "Low", status: "Under Investigation" },
        { id: 14, title: "Emergency Button Pressed (Accident)", location: "Elevator 4", time: "11:50 - 21/03/2026", priority: "High", status: "Resolved" },
        { id: 15, title: "Illegal Parking at Entrance", location: "Main Gate", time: "14:20 - 21/03/2026", priority: "Medium", status: "Resolved" },
        { id: 16, title: "Shattered Window (Storm)", location: "Gym Area", time: "22:00 - 21/03/2026", priority: "High", status: "Pending" },
        { id: 17, title: "Gas Smell Reported", location: "Kitchen Block B", time: "08:10 - 22/03/2026", priority: "High", status: "Resolved" },
        { id: 18, title: "Broken Sprinkler Head", location: "Basement 1", time: "10:25 - 22/03/2026", priority: "Medium", status: "Pending" },
        { id: 19, title: "Loud Party Complaint", location: "Block C, Floor 15", time: "23:30 - 22/03/2026", priority: "Medium", status: "Resolved" },
        { id: 20, title: "Wi-Fi Router Failure", location: "Office", time: "09:45 - 23/03/2026", priority: "Low", status: "Resolved" },
        { id: 21, title: "Intercom System Outage", location: "Block A", time: "11:00 - 23/03/2026", priority: "Medium", status: "Pending" },
        { id: 22, title: "Dog Barking Excessively", location: "Block B, Floor 2", time: "14:15 - 23/03/2026", priority: "Low", status: "Resolved" },
        { id: 23, title: "Key Card Reader Malfunction", location: "Side Gate", time: "16:30 - 23/03/2026", priority: "Medium", status: "Resolved" },
        { id: 24, title: "Minor Plumbing Leak", location: "Public Restroom", time: "10:20 - 24/03/2026", priority: "Low", status: "Pending" },
        { id: 25, title: "CCTV Blind Spot Identified", location: "Garage Exit", time: "13:40 - 24/03/2026", priority: "Medium", status: "Under Investigation" },
        { id: 26, title: "Argument in Lobby", location: "Lobby Block D", time: "15:55 - 24/03/2026", priority: "Medium", status: "Resolved" },
        { id: 27, title: "Packages Piled Up (Blocking Way)", location: "Mailroom", time: "17:10 - 24/03/2026", priority: "Low", status: "Resolved" },
        { id: 28, title: "Security Barrier Damage", location: "Exit Gate", time: "19:25 - 24/03/2026", priority: "High", status: "Pending" },
        { id: 29, title: "Vandalism to Bench", location: "Outdoor Park", time: "08:00 - 25/03/2026", priority: "Low", status: "Under Investigation" },
        { id: 30, title: "Unauthorized Solicitation", location: "Building Wide", time: "11:30 - 25/03/2026", priority: "Medium", status: "Resolved" }
    ]);


    const [patrols, setPatrols] = useState([
        { id: 1, route: "Perimeter Block A & B", guard: "Officer Nguyen", time: "20:00 - 22:00", status: "Completed" },
        { id: 2, route: "Parking Basement & Gates", guard: "Officer Tran", time: "22:00 - 00:00", status: "In Progress" },
        { id: 3, route: "Rooftop & Technical Floors", guard: "Officer Le", time: "00:00 - 02:00", status: "Scheduled" },
        { id: 4, route: "Internal Corridors Block C", guard: "Officer Pham", time: "02:00 - 04:00", status: "Scheduled" },
        { id: 5, route: "Garden & Pool Area", guard: "Officer Do", time: "04:00 - 06:00", status: "Scheduled" },
        { id: 6, route: "Lobby & Reception", guard: "Officer Hoang", time: "06:00 - 08:00", status: "Completed" },
        { id: 7, route: "Gym & Amenity Floor", guard: "Officer Nguyen", time: "08:00 - 10:00", status: "Completed" },
        { id: 8, route: "Service Entrance & Docks", guard: "Officer Tran", time: "10:00 - 12:00", status: "Completed" },
        { id: 9, route: "Block D Internal Check", guard: "Officer Le", time: "12:00 - 14:00", status: "Completed" },
        { id: 10, route: "Basement 2 Storage", guard: "Officer Pham", time: "14:00 - 16:00", status: "In Progress" },
        { id: 11, route: "Perimeter Block C & D", guard: "Officer Do", time: "16:00 - 18:00", status: "Scheduled" },
        { id: 12, route: "Main Gate Monitoring", guard: "Officer Hoang", time: "18:00 - 20:00", status: "Scheduled" },
        { id: 13, route: "Block A Roof Garden", guard: "Officer Nguyen", time: "20:00 - 22:00", status: "Scheduled" },
        { id: 14, route: "Emergency Exit Review", guard: "Officer Tran", time: "22:00 - 00:00", status: "Scheduled" },
        { id: 15, route: "Lobby Block B Check", guard: "Officer Le", time: "00:00 - 02:00", status: "Scheduled" },
        { id: 16, route: "Stairwell Safety Audit", guard: "Officer Pham", time: "02:00 - 04:00", status: "Scheduled" },
        { id: 17, route: "Staff Lounge & Lockers", guard: "Officer Do", time: "04:00 - 06:00", status: "Scheduled" },
        { id: 18, route: "Outer Fence Check", guard: "Officer Hoang", time: "06:00 - 08:00", status: "Scheduled" },
        { id: 19, route: "Block B Technical Room", guard: "Officer Nguyen", time: "08:00 - 10:00", status: "Scheduled" },
        { id: 20, route: "Mailroom Security Check", guard: "Officer Tran", time: "10:00 - 12:00", status: "Scheduled" },
        { id: 21, route: "Visitor Parking Zone A", guard: "Officer Le", time: "12:00 - 14:00", status: "Scheduled" },
        { id: 22, route: "Basement 1 Exit Gates", guard: "Officer Pham", time: "14:00 - 16:00", status: "Scheduled" },
        { id: 23, route: "Common Area Lighting", guard: "Officer Do", time: "16:00 - 18:00", status: "Scheduled" },
        { id: 24, route: "Block C Lobby Patrol", guard: "Officer Hoang", time: "18:00 - 20:00", status: "Scheduled" },
        { id: 25, route: "Trash Room Inspection", guard: "Officer Nguyen", time: "20:00 - 22:00", status: "Scheduled" },
        { id: 26, route: "Elevator Hall Checks", guard: "Officer Tran", time: "22:00 - 00:00", status: "Scheduled" },
        { id: 27, route: "Night Shift Gate Review", guard: "Officer Le", time: "00:00 - 02:00", status: "Scheduled" },
        { id: 28, route: "Block D Fire Extinguishers", guard: "Officer Pham", time: "02:00 - 04:00", status: "Scheduled" },
        { id: 29, route: "Basement 2 Sump Pump Area", guard: "Officer Do", time: "04:00 - 06:00", status: "Scheduled" },
        { id: 30, route: "Service Corridor Block B", guard: "Officer Hoang", time: "06:00 - 08:00", status: "Scheduled" }
    ]);


    const emergencyContacts = [
        { name: "Local Police", phone: "113", icon: <FaShieldAlt /> },
        { name: "Fire Department", phone: "114", icon: <FaFireExtinguisher /> },
        { name: "Ambulance", phone: "115", icon: <FaAmbulance /> },
        { name: "Building Manager", phone: "0836 160 161", icon: <FaUserTie /> }
    ];

    return (
        <main className="staff-content-area">
            {/* --- VISITOR MANAGEMENT --- */}
            {activeTab === 'visitors' && (
                <div className="staff-tab-content">
                    <div className="staff-form-container" style={{ borderLeft: '5px solid #c89b3c' }}>
                        <h3><FaUserPlus /> Register New Visitor</h3>
                        <div className="staff-grid" style={{ marginTop: '20px' }}>
                            <div className="form-group"><label>VISITOR NAME</label><input type="text" placeholder="Full name..." value={visitorForm.name} onChange={(e) => setVisitorForm({ ...visitorForm, name: e.target.value })} /></div>
                            <div className="form-group"><label>ID CARD / PASSPORT</label><input type="text" placeholder="Enter 12-digit ID number..." value={visitorForm.idCard} onChange={(e) => setVisitorForm({ ...visitorForm, idCard: e.target.value })} /></div>
                            <div className="form-group"><label>PHONE NUMBER</label><input type="text" placeholder="Phone number..." value={visitorForm.phone} onChange={(e) => setVisitorForm({ ...visitorForm, phone: e.target.value })} /></div>
                            <div className="form-group"><label>PURPOSE / VISIT APARTMENT</label><input type="text" placeholder="e.g Visit A-505, Delivery..." value={visitorForm.purpose} onChange={(e) => setVisitorForm({ ...visitorForm, purpose: e.target.value })} /></div>
                        </div>
                        <button className="btn-add-resident" style={{ marginTop: '20px' }} onClick={handleCheckIn}>
                            CHECK-IN VISITOR
                        </button>
                    </div>

                    <div className="staff-form-container" style={{ marginTop: '30px' }}>
                        <h3><FaHistory /> Visitor Logs</h3>
                        <div className="staff-table-scroll">
                            <table className="admin-custom-table bordered" style={{ marginTop: '20px' }}>
                                <thead>
                                    <tr>
                                        <th>Visitor Name</th>
                                        <th>ID Card</th>
                                        <th>Phone Number</th>
                                        <th>Purpose</th>
                                        <th>Check-in</th>
                                        <th style={{ textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitors.map(v => (
                                        <tr key={v.id}>
                                            <td><strong>{v.name}</strong></td>
                                            <td>{v.idCard}</td>
                                            <td>{v.phone}</td>
                                            <td>{v.purpose}</td>
                                            <td style={{ fontSize: '12px' }}><FaClock /> {v.checkIn}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                                                    background: '#fef3c7',
                                                    color: '#92400e'
                                                }}>
                                                    {v.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            )}

            {/* --- INCIDENT REPORTS --- */}
            {activeTab === 'incidents' && (
                <div className="staff-tab-content">
                    <div className="staff-form-container" style={{ borderLeft: '5px solid #ef4444' }}>
                        <h3><FaExclamationCircle /> Report New Incident</h3>
                        <div className="staff-grid" style={{ marginTop: '20px' }}>
                            <div className="form-group"><label>INCIDENT TITLE</label><input type="text" placeholder="Short description..." /></div>
                            <div className="form-group"><label>LOCATION</label><input type="text" placeholder="e.g Block A, Lobby..." /></div>
                            <div className="form-group">
                                <label>PRIORITY</label>
                                <select style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #e2e8f0' }}>
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Critical</option>
                                </select>
                            </div>
                        </div>
                        <button className="btn-add-resident" style={{ marginTop: '20px', background: '#ef4444' }}>
                            SUBMIT REPORT
                        </button>
                    </div>

                    <div className="staff-form-container" style={{ marginTop: '30px' }}>
                        <h3><FaClipboardList /> Recent Incidents</h3>
                        <div className="staff-table-scroll">
                            <table className="admin-custom-table bordered" style={{ marginTop: '20px' }}>
                                <thead>
                                    <tr>
                                        <th>Incident</th>
                                        <th>Location</th>
                                        <th>Reported Time</th>
                                        <th>Priority</th>
                                        <th style={{ textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incidents.map(inc => (
                                        <tr key={inc.id}>
                                            <td><strong>{inc.title}</strong></td>
                                            <td><FaMapMarkerAlt /> {inc.location}</td>
                                            <td style={{ fontSize: '12px' }}>{inc.time}</td>
                                            <td>
                                                <span style={{ color: inc.priority === 'High' ? '#ef4444' : '#f59e0b', fontWeight: 'bold' }}>
                                                    {inc.priority}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                                                    background: inc.status === 'Resolved' ? '#10b981' : '#f59e0b',
                                                    color: 'white'
                                                }}>
                                                    {inc.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            )}

            {/* --- PATROL SCHEDULE --- */}
            {activeTab === 'patrols' && (
                <div className="staff-tab-content">
                    <div className="staff-form-container">
                        <h3><FaShieldAlt /> Daily Patrol Schedule</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Track and monitor ongoing security patrols across the complex.</p>
                        <table className="admin-custom-table bordered">
                            <thead>
                                <tr>
                                    <th>Route Name</th>
                                    <th>Assigned Guard</th>
                                    <th>Time Slot</th>
                                    <th style={{ textAlign: 'center' }}>Status</th>
                                    <th style={{ textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patrols.map(p => (
                                    <tr key={p.id}>
                                        <td><strong>{p.route}</strong></td>
                                        <td>{p.guard}</td>
                                        <td><FaClock /> {p.time}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{
                                                color: p.status === 'Completed' ? '#10b981' : '#3b82f6',
                                                fontWeight: 'bold'
                                            }}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button className="btn-table-edit" title="Log Activity"><FaClipboardList /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- EMERGENCY --- */}
            {activeTab === 'emergency' && (
                <div className="staff-tab-content">
                    <div className="staff-grid">
                        <div className="staff-form-container" style={{ borderTop: '5px solid #ef4444' }}>
                            <h3><FaExclamationCircle /> Emergency Contacts</h3>
                            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {emergencyContacts.map((contact, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '15px', background: '#fff5f5', borderRadius: '8px', border: '1px solid #fee2e2'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ color: '#ef4444', fontSize: '1.2rem' }}>{contact.icon}</div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{contact.name}</div>
                                                <div style={{ color: '#ef4444', fontWeight: '800', fontSize: '1.1rem' }}>{contact.phone}</div>
                                            </div>
                                        </div>
                                        <a
                                            href={`tel:${contact.phone}`}
                                            style={{
                                                background: '#ef4444', color: 'white', border: 'none',
                                                padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
                                                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px'
                                            }}
                                        >
                                            <FaPhoneAlt /> CALL
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="staff-form-container" style={{ borderTop: '5px solid #3b82f6' }}>
                            <h3><FaShieldAlt /> System Monitoring</h3>
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <span>CCTV System Status</span>
                                    <span style={{ color: '#10b981', fontWeight: 'bold' }}><FaCheck /> Operational</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <span>Fire Alarm System</span>
                                    <span style={{ color: '#10b981', fontWeight: 'bold' }}><FaCheck /> Armed</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <span>Main Gate Connectivity</span>
                                    <span style={{ color: '#10b981', fontWeight: 'bold' }}><FaCheck /> Stable</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                                    <span>Guard Tour System</span>
                                    <span style={{ color: '#10b981', fontWeight: 'bold' }}><FaCheck /> Online</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '25px', padding: '15px', background: '#eff6ff', borderRadius: '8px', color: '#1e40af' }}>
                                <strong>System Note:</strong> Next full system maintenance scheduled for 01/04/2026.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default StaffSecurityMainContent;
