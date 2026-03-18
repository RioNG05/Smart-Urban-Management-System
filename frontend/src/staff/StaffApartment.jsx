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
        username: '', gender: '', owner: '', dob: '', idCard: '', room: ''
    });
    const [residentAccounts, setResidentAccounts] = useState([
        { id: 1, username: "hung.tp", gender: "Male", owner: "Tran Phu Thanh Hung", dob: "1995-05-15", idCard: "0123456789", room: "A-505" },
        { id: 2, username: "son.tm", gender: "Male", owner: "Minh Son Thanh", dob: "1992-10-20", idCard: "9876543210", room: "B-101" },
        { id: 3, username: "lan.nt", gender: "Female", owner: "Nguyen Thi Lan", dob: "1988-03-12", idCard: "4561237890", room: "C-202" },
        { id: 4, username: "cuong.vh", gender: "Male", owner: "Vu Hoang Cuong", dob: "1990-12-30", idCard: "7894561230", room: "D-808" },
        { id: 5, username: "mai.lt", gender: "Female", owner: "Le Thi Mai", dob: "1994-07-22", idCard: "1234509876", room: "A-102" },
        { id: 6, username: "dung.nv", gender: "Male", owner: "Nguyen Van Dung", dob: "1985-11-05", idCard: "5432167890", room: "B-304" },
        { id: 7, username: "hoa.tt", gender: "Female", owner: "Trinh Thi Hoa", dob: "1991-02-14", idCard: "6789054321", room: "C-1102" },
        { id: 8, username: "tuan.an", gender: "Male", owner: "An Ngoc Tuan", dob: "1989-09-09", idCard: "9012345678", room: "D-1506" },
        { id: 9, username: "linh.ph", gender: "Female", owner: "Phan Hoang Linh", dob: "1996-12-25", idCard: "2345678901", room: "A-703" },
        { id: 10, username: "thanh.bq", gender: "Male", owner: "Bui Quoc Thanh", dob: "1993-01-20", idCard: "3456789012", room: "B-910" },
        { id: 11, username: "quynh.nt", gender: "Female", owner: "Ngo Thu Quynh", dob: "1997-06-18", idCard: "4567890123", room: "C-405" },
        { id: 12, username: "dat.dv", gender: "Male", owner: "Do Van Dat", dob: "1987-04-12", idCard: "5678901234", room: "D-1201" },
        { id: 13, username: "yen.ht", gender: "Female", owner: "Hoang Thi Yen", dob: "1992-08-30", idCard: "6789012345", room: "A-312" },
        { id: 14, username: "khanh.pq", gender: "Male", owner: "Pham Quoc Khanh", dob: "1990-03-15", idCard: "7890123456", room: "B-508" },
        { id: 15, username: "ngoc.pt", gender: "Female", owner: "Phan Thu Ngoc", dob: "1995-10-10", idCard: "8901234567", room: "C-801" },
        { id: 16, username: "long.hv", gender: "Male", owner: "Hoang Van Long", dob: "1984-05-25", idCard: "9012345678", room: "D-203" },
        { id: 17, username: "trang.nt", gender: "Female", owner: "Nguyen Thu Trang", dob: "1998-01-05", idCard: "0123456789", room: "A-1405" },
        { id: 18, username: "thang.nh", gender: "Male", owner: "Nguyen Huu Thang", dob: "1991-11-20", idCard: "1234567890", room: "B-702" },
        { id: 19, username: "diem.tt", gender: "Female", owner: "Tran Thi Diem", dob: "1993-02-28", idCard: "2345678901", room: "C-1204" },
        { id: 20, username: "binh.vq", gender: "Male", owner: "Vu Quoc Binh", dob: "1986-07-15", idCard: "3456789012", room: "D-510" },
        { id: 21, username: "thu.ha", gender: "Female", owner: "Ha Thi Thu", dob: "1994-09-12", idCard: "4567890123", room: "A-908" },
        { id: 22, username: "quan.nm", gender: "Male", owner: "Nguyen Minh Quan", dob: "1990-12-01", idCard: "5678901234", room: "B-1005" },
        { id: 23, username: "vy.tt", gender: "Female", owner: "Truong Thi Vy", dob: "1996-04-20", idCard: "6789012345", room: "C-306" },
        { id: 24, username: "phuc.dh", gender: "Male", owner: "Dang Hoang Phuc", dob: "1988-06-10", idCard: "7890123456", room: "D-111" },
        { id: 25, username: "an.bt", gender: "Female", owner: "Bui Thi An", dob: "1995-03-05", idCard: "8901234567", room: "A-607" },
        { id: 26, username: "minh.tv", gender: "Male", owner: "Tran Van Minh", dob: "1992-05-30", idCard: "9012345678", room: "B-212" },
        { id: 27, username: "huong.dk", gender: "Female", owner: "Do Kim Huong", dob: "1997-10-15", idCard: "0123456789", room: "C-1502" },
        { id: 28, username: "thinh.pv", gender: "Male", owner: "Pham Van Thinh", dob: "1985-08-20", idCard: "1234567890", room: "D-404" },
        { id: 29, username: "giang.tt", gender: "Female", owner: "Trinh Thu Giang", dob: "1993-11-12", idCard: "2345678901", room: "A-1210" },
        { id: 30, username: "hieu.nm", gender: "Male", owner: "Nguyen Minh Hieu", dob: "1990-01-25", idCard: "3456789012", room: "B-808" }

    ]);
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
        setFormData({ username: '', gender: '', owner: '', dob: '', idCard: '', room: '' });
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
        { id: 1, name: "Tran Phu Thanh Hung", room: "A-505", note: "Điều hòa kêu to quá không ngủ được!", time: "15:30 - 12/03/2026", status: "Pending" },
        { id: 2, name: "Minh Son Thanh", room: "B-101", note: "Cửa thoát hiểm bị kẹt, staff xem lại", time: "09:15 - 13/03/2026", status: "Pending" },
        { id: 3, name: "Nguyen Thi Lan", room: "C-202", note: "Bể bơi tầng 5 nước có vẻ hơi đục", time: "10:00 - 14/03/2026", status: "Approved" },
        { id: 4, name: "Vu Hoang Cuong", room: "D-808", note: "Hệ thống đèn hành lang bị hỏng", time: "20:00 - 15/03/2026", status: "Rejected" },
        { id: 5, name: "Le Thi Mai", room: "A-102", note: "Hàng xóm làm ồn lúc nửa đêm", time: "23:45 - 15/03/2026", status: "Pending" },
        { id: 6, name: "Nguyen Van Dung", room: "B-304", note: "Vòi nước bồn rửa bát bị rò rỉ", time: "08:30 - 16/03/2026", status: "Approved" },
        { id: 7, name: "Trinh Thi Hoa", room: "C-1102", note: "Thang máy số 3 di chuyển rất chậm", time: "14:20 - 16/03/2026", status: "Pending" },
        { id: 8, name: "An Ngoc Tuan", room: "D-1506", note: "Có mùi lạ ở khu vực đổ rác", time: "17:10 - 16/03/2026", status: "Approved" },
        { id: 9, name: "Phan Hoang Linh", room: "A-703", note: "Wifi khu vực sảnh yếu quá", time: "11:55 - 17/03/2026", status: "Pending" },
        { id: 10, name: "Bui Quoc Thanh", room: "B-910", note: "Cần kiểm tra lại hóa đơn nước tháng này", time: "16:40 - 17/03/2026", status: "Pending" },
        { id: 11, name: "Ngo Thu Quynh", room: "C-405", note: "Khu vui chơi trẻ em có thiết bị hỏng", time: "09:30 - 18/03/2026", status: "Approved" },
        { id: 12, name: "Do Van Dat", room: "D-1201", note: "Bảo vệ ca đêm ngủ gật", time: "02:15 - 18/03/2026", status: "Rejected" },
        { id: 13, name: "Hoang Thi Yen", room: "A-312", note: "Cửa sổ bị thấm nước khi trời mưa", time: "13:00 - 18/03/2026", status: "Pending" },
        { id: 14, name: "Pham Quoc Khanh", room: "B-508", note: "Máy tập gym hỏng dây cáp", time: "18:25 - 18/03/2026", status: "Approved" },
        { id: 15, name: "Phan Thu Ngoc", room: "C-801", note: "Có côn trùng trong hầm gửi xe", time: "21:50 - 18/03/2026", status: "Pending" },
        { id: 16, name: "Hoang Van Long", room: "D-203", note: "Đèn cảm biến cầu thang không sáng", time: "20:30 - 19/03/2026", status: "Approved" },
        { id: 17, name: "Nguyen Thu Trang", room: "A-1405", note: "Yêu cầu phun thuốc muỗi định kỳ", time: "10:15 - 19/03/2026", status: "Pending" },
        { id: 18, name: "Nguyen Huu Thang", room: "B-702", note: "Hệ thống báo cháy kêu nhầm", time: "15:45 - 19/03/2026", status: "Rejected" },
        { id: 19, name: "Tran Thi Diem", room: "C-1204", note: "Ống thoát nước ban công bị tắc", time: "07:20 - 20/03/2026", status: "Pending" },
        { id: 20, name: "Vu Quoc Binh", room: "D-510", note: "Nhân viên vệ sinh dọn dẹp chưa sạch", time: "16:30 - 20/03/2026", status: "Approved" },
        { id: 21, name: "Ha Thi Thu", room: "A-908", note: "Cần hỗ trợ chuyển đồ cồng kềnh", time: "09:00 - 21/03/2026", status: "Pending" },
        { id: 22, name: "Nguyen Minh Quan", room: "B-1005", note: "Thẻ từ thang máy không nhận", time: "11:10 - 21/03/2026", status: "Approved" },
        { id: 23, name: "Truong Thi Vy", room: "C-306", note: "Bình nóng lạnh có vấn đề", time: "22:00 - 21/03/2026", status: "Pending" },
        { id: 24, name: "Dang Hoang Phuc", room: "D-111", note: "Gạch lát sảnh bị bong tróc", time: "08:45 - 22/03/2026", status: "Pending" },
        { id: 25, name: "Bui Thi An", room: "A-607", note: "Chuông cửa không hoạt động", time: "14:15 - 22/03/2026", status: "Approved" },
        { id: 26, name: "Tran Van Minh", room: "B-212", note: "Có xe đậu sai vị trí thường xuyên", time: "19:30 - 22/03/2026", status: "Pending" },
        { id: 27, name: "Do Kim Huong", room: "C-1502", note: "Wifi công cộng quá chậm", time: "10:00 - 23/03/2026", status: "Approved" },
        { id: 28, name: "Pham Van Thinh", room: "D-404", note: "Yêu cầu thay pin khóa cửa điện tử", time: "13:40 - 23/03/2026", status: "Pending" },
        { id: 29, name: "Trinh Thu Giang", room: "A-1210", note: "Máy lọc nước khu vực chung hết hạn thay lõi", time: "15:10 - 23/03/2026", status: "Approved" },
        { id: 30, name: "Nguyen Minh Hieu", room: "B-808", note: "Có người hút thuốc trong thang máy", time: "17:55 - 23/03/2026", status: "Pending" }

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