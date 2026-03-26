import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaBars, FaUserCircle, FaUser, FaHistory, FaCalendarCheck,
    FaComments, FaBuilding
} from 'react-icons/fa';
import StaffApartmentMainContent from './StaffApartmentMainContent';
import '../styles/staff.css';

const StaffApartment = () => {
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
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [replyNote, setReplyNote] = useState("");
    const [complaints, setComplaints] = useState([
        { id: 1, name: "Tran Phu Thanh Hung", room: "A-505", note: "AC is too loud, can't sleep!", time: "15:30 - 12/03/2026", status: "Pending" },
        { id: 2, name: "Minh Son Thanh", room: "B-101", note: "Emergency exit stuck, please check", time: "09:15 - 13/03/2026", status: "Pending" },
        { id: 3, name: "Nguyen Thi Lan", room: "C-202", note: "Pool on 5th floor water seems cloudy", time: "10:00 - 14/03/2026", status: "Approved" },
        { id: 4, name: "Vu Hoang Cuong", room: "D-808", note: "Hallway lighting system broken", time: "20:00 - 15/03/2026", status: "Rejected" },
        { id: 5, name: "Le Thi Mai", room: "A-102", note: "Neighbors making noise at midnight", time: "23:45 - 15/03/2026", status: "Pending" },
        { id: 6, name: "Nguyen Van Dung", room: "B-304", note: "Kitchen sink faucet leaking", time: "08:30 - 16/03/2026", status: "Approved" },
        { id: 7, name: "Trinh Thi Hoa", room: "C-1102", note: "Elevator #3 is very slow", time: "14:20 - 16/03/2026", status: "Pending" },
        { id: 8, name: "An Ngoc Tuan", room: "D-1506", note: "Strange smell in trash area", time: "17:10 - 16/03/2026", status: "Approved" },
        { id: 9, name: "Phan Hoang Linh", room: "A-703", note: "Lobby Wifi is too weak", time: "11:55 - 17/03/2026", status: "Pending" },
        { id: 10, name: "Bui Quoc Thanh", room: "B-910", note: "Need to re-check this month water bill", time: "16:40 - 17/03/2026", status: "Pending" },
        { id: 11, name: "Ngo Thu Quynh", room: "C-405", note: "Broken equipment in playground", time: "09:30 - 18/03/2026", status: "Approved" },
        { id: 12, name: "Do Van Dat", room: "D-1201", note: "Night guard fell asleep on duty", time: "02:15 - 18/03/2026", status: "Rejected" },
        { id: 13, name: "Hoang Thi Yen", room: "A-312", note: "Window leaking when it rains", time: "13:00 - 18/03/2026", status: "Pending" },
        { id: 14, name: "Pham Quoc Khanh", room: "B-508", note: "Gym machine cable is broken", time: "18:25 - 18/03/2026", status: "Approved" },
        { id: 15, name: "Phan Thu Ngoc", room: "C-801", note: "Insects found in parking basement", time: "21:50 - 18/03/2026", status: "Pending" },
        { id: 16, name: "Hoang Van Long", room: "D-203", note: "Stair sensor light not working", time: "20:30 - 19/03/2026", status: "Approved" },
        { id: 17, name: "Nguyen Thu Trang", room: "A-1405", note: "Request regular mosquito spraying", time: "10:15 - 19/03/2026", status: "Pending" },
        { id: 18, name: "Nguyen Huu Thang", room: "B-702", note: "Fire alarm triggered falsely", time: "15:45 - 19/03/2026", status: "Rejected" },
        { id: 19, name: "Tran Thi Diem", room: "C-1204", note: "Balcony drain is clogged", time: "07:20 - 20/03/2026", status: "Pending" },
        { id: 20, name: "Vu Quoc Binh", room: "D-510", note: "Cleaning staff did not clean well", time: "16:30 - 20/03/2026", status: "Approved" },
        { id: 21, name: "Ha Thi Thu", room: "A-908", note: "Need help moving bulky items", time: "09:00 - 21/03/2026", status: "Pending" },
        { id: 22, name: "Nguyen Minh Quan", room: "B-1005", note: "Elevator card not recognized", time: "11:10 - 21/03/2026", status: "Approved" },
        { id: 23, name: "Truong Thi Vy", room: "C-306", note: "Water heater problem", time: "22:00 - 21/03/2026", status: "Pending" },
        { id: 24, name: "Dang Hoang Phuc", room: "D-111", note: "Lobby floor tiles are peeling", time: "08:45 - 22/03/2026", status: "Pending" },
        { id: 25, name: "Bui Thi An", room: "A-607", note: "Doorbell not working", time: "14:15 - 22/03/2026", status: "Approved" },
        { id: 26, name: "Tran Van Minh", room: "B-212", note: "Cars frequently parked wrongly", time: "19:30 - 22/03/2026", status: "Pending" },
        { id: 27, name: "Do Kim Huong", room: "C-1502", note: "Public Wifi is too slow", time: "10:00 - 23/03/2026", status: "Approved" },
        { id: 28, name: "Pham Van Thinh", room: "D-404", note: "Request battery change for e-lock", time: "13:40 - 23/03/2026", status: "Pending" },
        { id: 29, name: "Trinh Thu Giang", room: "A-1210", note: "Common area water filter expired", time: "15:10 - 23/03/2026", status: "Approved" },
        { id: 30, name: "Nguyen Minh Hieu", room: "B-808", note: "Person smoking in elevator", time: "17:55 - 23/03/2026", status: "Pending" }
    ]);

    const handleAction = (id, type) => {
        setComplaints(complaints.map(c => c.id === id ? { ...c, status: type } : c));
        alert(`Complaint ${type === 'Approved' ? 'Approved' : 'Rejected'}!`);
    };

    return (
        <div className="staff-wrapper">
            <aside className={`staff-sidebar ${sidebarOpen ? '' : 'closed'}`}>
                <div style={{ padding: '25px', display: 'flex', alignItems: 'center' }}>
                    <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer' }} />
                    {sidebarOpen && <span style={{ marginLeft: '15px', fontWeight: '800' }}>APARTMENT HUB</span>}
                </div>

                <nav className="staff-sidebar-nav">
                    <div className={`staff-nav-item ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => { setActiveTab('accounts'); setSelectedComplaint(null) }}>
                        <FaUserCircle /> {sidebarOpen && "Resident Accounts"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')}>
                        <FaComments /> {sidebarOpen && "Complaints & Replies"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'apartment_management' ? 'active' : ''}`} onClick={() => { setActiveTab('apartment_management'); setSelectedComplaint(null) }}>
                        <FaBuilding /> {sidebarOpen && "Apartment Management"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                        <FaHistory /> {sidebarOpen && "Stay At History"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
                        <FaCalendarCheck /> {sidebarOpen && "Appointments"}
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