import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/sections/auth/AuthContext';
import {
    FaBars, FaUserCircle, FaUser, FaHistory, FaCalendarCheck,
    FaComments, FaBuilding, FaSignOutAlt
} from 'react-icons/fa';
import StaffApartmentMainContent from './StaffApartmentMainContent';
import '../styles/manager.css';

const StaffApartment = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showIdCard, setShowIdCard] = useState(false);
    const [activeTab, setActiveTab] = useState('accounts');

    // --- LOGIC QUẢN LÝ TÀI KHOẢN ---
    const [formData, setFormData] = useState({
        username: '', gender: '', owner: '', dob: '', idCard: '', room: ''
    });
    const [residentAccounts, setResidentAccounts] = useState([
        { id: 1, username: "hung.tp", gender: "Male", owner: "Tran Phu Thanh Hung", dob: "1995-05-15", idCard: "001095012345", room: "A-505", status: 'Active' },
        { id: 2, username: "son.tm", gender: "Male", owner: "Minh Son Thanh", dob: "1992-10-20", idCard: "001092098765", room: "B-101", status: 'Active' },
        { id: 3, username: "lan.nt", gender: "Female", owner: "Nguyen Thi Lan", dob: "1988-03-12", idCard: "001088456123", room: "C-202", status: 'Active' },
        { id: 4, username: "cuong.vh", gender: "Male", owner: "Vu Hoang Cuong", dob: "1990-12-30", idCard: "001090789456", room: "D-808", status: 'Active' },
        { id: 5, username: "mai.lt", gender: "Female", owner: "Le Thi Mai", dob: "1994-07-22", idCard: "001094123450", room: "A-102", status: 'Active' },
        { id: 6, username: "dung.nv", gender: "Male", owner: "Nguyen Van Dung", dob: "1985-11-05", idCard: "001085543216", room: "B-304", status: 'Active' },
        { id: 7, username: "hoa.tt", gender: "Female", owner: "Trinh Thi Hoa", dob: "1991-02-14", idCard: "001091678905", room: "C-1102", status: 'Active' },
        { id: 8, username: "tuan.an", gender: "Male", owner: "An Ngoc Tuan", dob: "1989-09-09", idCard: "001089901234", room: "D-1506", status: 'Active' },
        { id: 9, username: "linh.ph", gender: "Female", owner: "Phan Hoang Linh", dob: "1996-12-25", idCard: "001096234567", room: "A-703", status: 'Active' },
        { id: 10, username: "thanh.bq", gender: "Male", owner: "Bui Quoc Thanh", dob: "1993-01-20", idCard: "001093345678", room: "B-910", status: 'Active' },
        { id: 11, username: "quynh.nt", gender: "Female", owner: "Ngo Thu Quynh", dob: "1997-06-18", idCard: "001097456789", room: "C-405", status: 'Active' },
        { id: 12, username: "dat.dv", gender: "Male", owner: "Do Van Dat", dob: "1987-04-12", idCard: "001087567890", room: "D-1201", status: 'Active' },
        { id: 13, username: "yen.ht", gender: "Female", owner: "Hoang Thi Yen", dob: "1992-08-30", idCard: "001092678901", room: "A-312", status: 'Active' },
        { id: 14, username: "khanh.pq", gender: "Male", owner: "Pham Quoc Khanh", dob: "1990-03-15", idCard: "001090789012", room: "B-508", status: 'Active' },
        { id: 15, username: "ngoc.pt", gender: "Female", owner: "Phan Thu Ngoc", dob: "1995-10-10", idCard: "001095890123", room: "C-801", status: 'Active' },
        { id: 16, username: "long.hv", gender: "Male", owner: "Hoang Van Long", dob: "1984-05-25", idCard: "001084901234", room: "D-203", status: 'Active' },
        { id: 17, username: "trang.nt", gender: "Female", owner: "Nguyen Thu Trang", dob: "1998-01-05", idCard: "001098012345", room: "A-1405", status: 'Active' },
        { id: 18, username: "thang.nh", gender: "Male", owner: "Nguyen Huu Thang", dob: "1991-11-20", idCard: "001091123456", room: "B-702", status: 'Active' },
        { id: 19, username: "diem.tt", gender: "Female", owner: "Tran Thi Diem", dob: "1993-02-28", idCard: "001093234567", room: "C-1204", status: 'Active' },
        { id: 20, username: "binh.vq", gender: "Male", owner: "Vu Quoc Binh", dob: "1986-07-15", idCard: "001086345678", room: "D-510", status: 'Active' },
        { id: 21, username: "thu.ha", gender: "Female", owner: "Ha Thi Thu", dob: "1994-09-12", idCard: "001094456789", room: "A-908", status: 'Active' },
        { id: 22, username: "quan.nm", gender: "Male", owner: "Nguyen Minh Quan", dob: "1990-12-01", idCard: "001090567890", room: "B-1005", status: 'Active' },
        { id: 23, username: "vy.tt", gender: "Female", owner: "Truong Thi Vy", dob: "1996-04-20", idCard: "001096678901", room: "C-306", status: 'Active' },
        { id: 24, username: "phuc.dh", gender: "Male", owner: "Dang Hoang Phuc", dob: "1988-06-10", idCard: "001088789012", room: "D-111", status: 'Active' },
        { id: 25, username: "an.bt", gender: "Female", owner: "Bui Thi An", dob: "1995-03-05", idCard: "001095890123", room: "A-607", status: 'Active' },
        { id: 26, username: "minh.tv", gender: "Male", owner: "Tran Van Minh", dob: "1992-05-30", idCard: "001092901234", room: "B-212", status: 'Active' },
        { id: 27, username: "huong.dk", gender: "Female", owner: "Do Kim Huong", dob: "1997-10-15", idCard: "001097012345", room: "C-1502", status: 'Active' },
        { id: 28, username: "thinh.pv", gender: "Male", owner: "Pham Van Thinh", dob: "1985-08-20", idCard: "001085123456", room: "D-404", status: 'Active' },
        { id: 29, username: "giang.tt", gender: "Female", owner: "Trinh Thu Giang", dob: "1993-11-12", idCard: "001093234567", room: "A-1210", status: 'Active' },
        { id: 30, username: "hieu.nm", gender: "Male", owner: "Nguyen Minh Hieu", dob: "1990-01-25", idCard: "001090345678", room: "B-808", status: 'Active' }
    ]);
    const [editIndex, setEditIndex] = useState(null);

    const handleAddAccount = () => {
        if (!formData.username || !formData.owner || !formData.room) {
            alert("Please enter at least Username, Owner, and Room number!");
            return;
        }
        if (editIndex !== null) {
            const updatedList = [...residentAccounts];
            updatedList[editIndex] = formData;
            setResidentAccounts(updatedList);
            setEditIndex(null);
            alert("Account updated!");
        } else {
            setResidentAccounts([...residentAccounts, { ...formData, status: 'Active' }]);
            alert("Account issued successfully!");
        }
        setFormData({ username: '', gender: '', owner: '', dob: '', idCard: '', room: '' });
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setFormData(residentAccounts[index]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleBlock = (index) => {
        const account = residentAccounts[index];
        const newStatus = account.status === 'Active' ? 'Blocked' : 'Active';

        if (window.confirm(`Are you sure you want to ${newStatus === 'Blocked' ? 'Lock' : 'Unlock'} this account?`)) {
            const updatedList = [...residentAccounts];
            updatedList[index] = { ...account, status: newStatus };
            setResidentAccounts(updatedList);
            alert(`Account ${newStatus === 'Blocked' ? 'Locked' : 'Unlocked'} successfully!`);
        }
    };

    // --- LOGIC COMPLAINTS ---
    const { user } = useAuth();
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [replyNote, setReplyNote] = useState("");
    const [complaints, setComplaints] = useState([
        { id: 1, name: "Tran Phu Thanh Hung", room: "A-505", note: "AC is too loud, can't sleep!", time: "15:30 - 12/03/2026", repliedBy: "Staff_Tom" },
        { id: 2, name: "Minh Son Thanh", room: "B-101", note: "Emergency exit stuck, please check", time: "09:15 - 13/03/2026", repliedBy: null },
        { id: 3, name: "Nguyen Thi Lan", room: "C-202", note: "Pool on 5th floor water seems cloudy", time: "10:00 - 14/03/2026", repliedBy: "Staff_Tom" },
    ]);

    const handleAction = (id, type, note) => {
        setComplaints(complaints.map(c => 
            c.id === id ? { ...c, repliedBy: user?.username || "Staff Apartment", reply: note } : c
        ));
        alert("Reply saved successfully!");
    };


    return (
        <div className="staff-wrapper">
            <aside className={`staff-sidebar ${sidebarOpen ? '' : 'closed'}`}>
                <div style={{ padding: '25px', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
                    <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
                    {sidebarOpen && <span style={{ marginLeft: '15px', fontWeight: '800' }}>APARTMENT HUB</span>}
                </div>

                <nav className="staff-sidebar-nav">
                    <div className={`staff-nav-item ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => { setActiveTab('accounts'); setSelectedComplaint(null) }} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaUserCircle style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Resident Account"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'apartment_management' ? 'active' : ''}`} onClick={() => { setActiveTab('apartment_management'); setSelectedComplaint(null) }} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaBuilding style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Management"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaComments style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Complaint & Reply"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaHistory style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Stay At History"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '12px 15px' : '15px 0' }}>
                        <FaCalendarCheck style={{ marginRight: sidebarOpen ? '15px' : '0' }} /> {sidebarOpen && "Appointments"}
                    </div>
                </nav>
            </aside>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header className="staff-topbar" style={{ justifyContent: 'space-between' }}>
                    <nav className="staff-main-nav" style={{ marginRight: 0, alignItems: 'center' }}>
                        <a href="/admin">Admin</a>
                        <a href="/staff/apartment" className="active">Staff Apartment</a>
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
                                        <div className="staff-avatar-circle">SA</div>
                                        <h3 style={{ margin: 0 }}>Staff Apartment</h3>
                                        <p style={{ fontSize: '12px', color: '#64748b' }}>Senior Staff | ID: VNH-2026</p>
                                    </div>
                                    <div style={{ fontSize: '13px' }}>
                                        <p><strong>Department:</strong> Apartment Management</p>
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

                <StaffApartmentMainContent
                    activeTab={activeTab}
                    editIndex={editIndex}
                    formData={formData}
                    setFormData={setFormData}
                    handleAddAccount={handleAddAccount}
                    residentAccounts={residentAccounts}
                    handleEdit={handleEdit}
                    handleToggleBlock={handleToggleBlock}
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

export default StaffApartment;