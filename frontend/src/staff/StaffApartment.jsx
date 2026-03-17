import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để điều hướng
import {
    FaBars, FaUserCircle, FaUser, FaHistory, FaCalendarCheck,
    FaMoneyBillWave, FaFileInvoice, FaNewspaper, FaComments,
    FaBuilding
} from 'react-icons/fa';
import StaffApartmentMainContent from './StaffApartmentMainContent';
import '../styles/staff.css';

const StaffApartment = () => {
    const navigate = useNavigate(); // Hook điều hướng
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showIdCard, setShowIdCard] = useState(false);
    const [activeTab, setActiveTab] = useState('accounts');

    // [BACKEND_NOTE]: Tạo state để lưu thông tin profile từ API
    // const [staffProfile, setStaffProfile] = useState({});

    // [BACKEND_NOTE]: Gọi API lấy thông tin profile và danh sách các bảng khi mới vào trang
    // useEffect(() => {
    //     const fetchData = async () => {
    //         // const profileData = await axios.get('/api/staff/profile');
    //         // setStaffProfile(profileData.data);
    //
    //         // const accountsData = await axios.get('/api/staff/accounts');
    //         // setResidentAccounts(accountsData.data);
    //
    //         // const complaintsData = await axios.get('/api/staff/complaints');
    //         // setComplaints(complaintsData.data);
    //     };
    //     fetchData();
    // }, []);

    // --- LOGIC QUẢN LÝ TÀI KHOẢN ---
    const [formData, setFormData] = useState({
        username: '', password: '', owner: '', dob: '', dateAdded: '', room: ''
    });
    const [residentAccounts, setResidentAccounts] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const handleAddAccount = () => {
        if (!formData.username || !formData.owner || !formData.room) {
            alert("Mày phải nhập ít nhất là Username, Tên chủ hộ và Số phòng!");
            return;
        }
        if (editIndex !== null) {
            // [BACKEND_NOTE]: Gọi API (PUT/PATCH) để cập nhật thông tin tài khoản trên Database
            // await axios.put(`/api/staff/accounts/${formData.id}`, formData);

            const updatedList = [...residentAccounts];
            updatedList[editIndex] = formData;
            setResidentAccounts(updatedList);
            setEditIndex(null);
            alert("Đã cập nhật tài khoản!");
        } else {
            // [BACKEND_NOTE]: Gọi API (POST) để lưu tài khoản mới xuống Database
            // await axios.post('/api/staff/accounts', formData);

            setResidentAccounts([...residentAccounts, formData]);
            alert("Đã cấp tài khoản thành công!");
        }
        setFormData({ username: '', password: '', owner: '', dob: '', dateAdded: '', room: '' });
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setFormData(residentAccounts[index]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (index) => {
        if (window.confirm("Mày có chắc muốn xóa không?")) {
            // [BACKEND_NOTE]: Gọi API (DELETE) để xóa tài khoản trong Database
            // const accountId = residentAccounts[index].id;
            // await axios.delete(`/api/staff/accounts/${accountId}`);

            setResidentAccounts(residentAccounts.filter((_, i) => i !== index));
            if (editIndex === index) setEditIndex(null);
        }
    };

    // --- LOGIC KHIẾU NẠI ---
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [replyNote, setReplyNote] = useState("");
    const [complaints, setComplaints] = useState([
        {
            id: 1,
            name: "Tran Phu Thanh Hung",
            room: "A-505",
            note: "Điều hòa kêu to quá không ngủ được!",
            time: "15:30 - 12/03/2026",
            status: "Pending"
        },
        {
            id: 2,
            name: "Minh Son Thanh",
            room: "B-101",
            note: "Cửa thoát hiểm bị kẹt, staff xem lại",
            time: "09:15 - 13/03/2026",
            status: "Pending"
        }
    ]);

    const handleAction = (id, type) => {
        // [BACKEND_NOTE]: Gọi API (PUT/PATCH) để cập nhật trạng thái khiếu nại (Approved/Rejected) trên Database
        // await axios.patch(`/api/staff/complaints/${id}/status`, { status: type });

        setComplaints(complaints.map(c => c.id === id ? { ...c, status: type } : c));
        alert(`Đã ${type === 'Approved' ? 'Phê duyệt' : 'Từ chối'} phản ánh!`);
    };

    return (
        <div className="staff-wrapper">
            {/* SIDEBAR */}
            <aside className={`staff-sidebar ${sidebarOpen ? '' : 'closed'}`}>
                <div style={{ padding: '25px', display: 'flex', alignItems: 'center' }}>
                    <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer' }} />
                    {sidebarOpen && <span style={{ marginLeft: '15px', fontWeight: '800' }}>STAFF HUB</span>}
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
                    <div className="staff-nav-item" onClick={() => navigate('/news')}>
                        <FaNewspaper /> {sidebarOpen && "News Manager"}
                    </div>
                </nav>
            </aside>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header className="staff-topbar" style={{ justifyContent: 'space-between' }}>
                    <nav className="staff-main-nav" style={{ marginRight: 0 }}>
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
                                    {/* [BACKEND_NOTE]: Sau này lấy dữ liệu từ Backend, thay thế các giá trị cứng bên dưới bằng các biến State. Ví dụ:
                                    - <div className="staff-avatar-circle">{staffProfile.shortName}</div>
                                    - <h3>{staffProfile.fullName}</h3>
                                    - <p>{staffProfile.role} | ID: {staffProfile.id}</p>
                                    - <p><strong>Department:</strong> {staffProfile.department}</p>
                                    - <p><strong>Join Date:</strong> {staffProfile.joinDate}</p>
                                    - <p><strong>Shift:</strong> {staffProfile.shift}</p>
                                */}
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
                    handleDelete={handleDelete}
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