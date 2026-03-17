import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để điều hướng
import { 
    FaBars, FaUserCircle, FaHistory, FaCalendarCheck, 
    FaMoneyBillWave, FaFileInvoice, FaNewspaper, FaComments, 
    FaBuilding, FaUserPlus, FaUserEdit, FaTrash, FaReply, FaCheck, FaTimes, FaPaperPlane, FaClock 
} from 'react-icons/fa';
import '../styles/staff.css';

const StaffApartment = () => {
    const navigate = useNavigate(); // Hook điều hướng
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showIdCard, setShowIdCard] = useState(false);
    const [activeTab, setActiveTab] = useState('accounts');

    // --- 1. LOGIC QUẢN LÝ TÀI KHOẢN ---
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
            const updatedList = [...residentAccounts];
            updatedList[editIndex] = formData;
            setResidentAccounts(updatedList);
            setEditIndex(null);
            alert("Đã cập nhật tài khoản!");
        } else {
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
        if(window.confirm("Mày có chắc muốn xóa không?")) {
            setResidentAccounts(residentAccounts.filter((_, i) => i !== index));
            if(editIndex === index) setEditIndex(null);
        }
    };

    // --- 2. LOGIC KHIẾU NẠI ---
    const [selectedComplaint, setSelectedComplaint] = useState(null); 
    const [replyNote, setReplyNote] = useState("");
    const [complaints, setComplaints] = useState([
        { 
            id: 1, 
            name: "Trần Phu Thanh Hung", 
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
        setComplaints(complaints.map(c => c.id === id ? { ...c, status: type } : c));
        alert(`Đã ${type === 'Approved' ? 'Phê duyệt' : 'Từ chối'} phản ánh!`);
    };

    return (
        <div className="staff-wrapper">
            {/* SIDEBAR */}
            <aside className={`staff-sidebar ${sidebarOpen ? '' : 'closed'}`}>
                <div style={{padding: '25px', display: 'flex', alignItems: 'center'}}>
                    <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} style={{cursor: 'pointer'}} />
                    {sidebarOpen && <span style={{marginLeft: '15px', fontWeight: '800'}}>STAFF HUB</span>}
                </div>
                
                <nav className="staff-sidebar-nav">
                    <div className={`staff-nav-item ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => {setActiveTab('accounts'); setSelectedComplaint(null)}}>
                        <FaUserCircle /> {sidebarOpen && "Resident Accounts"}
                    </div>
                    <div className={`staff-nav-item ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')}>
                        <FaComments /> {sidebarOpen && "Complaints & Replies"}
                    </div>
                    
                    {/* SỬA NEWS MANAGER: BẤM LÀ NHẢY TRANG */}
                    <div className="staff-nav-item" onClick={() => navigate('/news')} style={{cursor: 'pointer'}}>
                        <FaNewspaper /> {sidebarOpen && "News Manager"}
                    </div>

                    {/* SỬA APARTMENT TYPES: BẤM LÀ NHẢY TRANG */}
                    <div className="staff-nav-item" onClick={() => navigate('/market')} style={{cursor: 'pointer'}}>
                        <FaBuilding /> {sidebarOpen && "Apartment Types"}
                    </div>

                    <div className="staff-nav-item"><FaFileInvoice /> {sidebarOpen && "Utilities Invoices"}</div>
                    
                    <div className={`staff-nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                        <FaHistory /> {sidebarOpen && "Stay At History"}
                    </div>
                    <div className="staff-nav-item"><FaCalendarCheck /> {sidebarOpen && "Appointments"}</div>
                    <div className="staff-nav-item"><FaMoneyBillWave /> {sidebarOpen && "Expenses"}</div>
                </nav>
            </aside>

            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <header className="staff-topbar">
                    <nav className="staff-main-nav">
                        <a href="/staff/apartment" className="active">Staff Apartment</a>
                        <a href="/staff/service">Staff Service</a>
                        <a href="/staff/security">Staff Security</a>
                    </nav>

                    <div className="staff-profile-trigger" onClick={() => setShowIdCard(!showIdCard)}>
                        <FaUserCircle size={35} color="#1e293b" />
                        {showIdCard && (
                            <div className="staff-id-card">
                                <div className="id-card-header">
                                    <div className="staff-avatar-circle">TH</div>
                                    <h3 style={{margin: 0}}>Trần Hùng</h3>
                                    <p style={{fontSize: '12px', color: '#64748b'}}>Senior Staff | ID: VNH-2026</p>
                                </div>
                                <div style={{fontSize: '13px'}}>
                                    <p><strong>Department:</strong> Apartment Management</p>
                                    <p><strong>Join Date:</strong> 13/03/2026</p>
                                    <p><strong>Shift:</strong> Morning (08:00 - 17:00)</p>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <main className="staff-content-area">
                    {/* --- TAB 1: ACCOUNTS --- */}
                    {activeTab === 'accounts' && (
                        <div className="staff-account-management">
                            <div className="staff-form-container" style={{borderLeft: '5px solid #3b82f6'}}>
                                <h3><FaUserPlus /> {editIndex !== null ? "Chỉnh sửa tài khoản" : "Cấp tài khoản Resident mới"}</h3>
                                <div className="staff-grid" style={{marginTop: '20px'}}>
                                    <div className="form-group"><label>Tên đăng nhập</label><input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} /></div>
                                    <div className="form-group"><label>Mật khẩu</label><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
                                    <div className="form-group"><label>Tên chủ hộ</label><input type="text" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} /></div>
                                    <div className="form-group"><label>Ngày sinh</label><input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} /></div>
                                    <div className="form-group"><label>Ngày thêm</label><input type="date" value={formData.dateAdded} onChange={(e) => setFormData({...formData, dateAdded: e.target.value})} /></div>
                                    <div className="form-group"><label>Số căn hộ</label><input type="text" value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} /></div>
                                </div>
                                <button className="btn-add-resident" style={{marginTop: '20px', background: editIndex !== null ? '#f59e0b' : '#3b82f6'}} onClick={handleAddAccount}>
                                    {editIndex !== null ? "XÁC NHẬN CẬP NHẬT" : "CẤP TÀI KHOẢN"}
                                </button>
                            </div>

                            <div className="staff-form-container" style={{marginTop: '30px'}}>
                                <h3>Danh sách tài khoản đã cấp</h3>
                                <table className="admin-custom-table bordered">
                                    <thead>
                                        <tr>
                                            <th>Username</th><th>Chủ hộ</th><th>Căn hộ</th><th>Ngày sinh</th><th>Ngày cấp</th>
                                            <th style={{textAlign: 'center'}}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {residentAccounts.length > 0 ? residentAccounts.map((acc, index) => (
                                            <tr key={index}>
                                                <td><strong>{acc.username}</strong></td>
                                                <td>{acc.owner}</td><td>{acc.room}</td><td>{acc.dob}</td><td>{acc.dateAdded}</td>
                                                <td>
                                                    <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                                                        <button className="btn-table-edit" onClick={() => handleEdit(index)}><FaUserEdit /></button>
                                                        <button className="btn-table-delete" onClick={() => handleDelete(index)}><FaTrash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Chưa có dữ liệu...</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 2: COMPLAINTS --- */}
                    {activeTab === 'complaints' && (
                        <div className="staff-complaint-section">
                            {!selectedComplaint ? (
                                <div className="staff-form-container">
                                    <h3>Danh sách phản ánh từ Resident</h3>
                                    <table className="admin-custom-table bordered" style={{marginTop: '20px'}}>
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Thời gian</th>
                                                <th>Tên Resident</th>
                                                <th>Căn hộ</th>
                                                <th>Nội dung phản ánh</th>
                                                <th style={{textAlign: 'center'}}>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {complaints.map((c, idx) => (
                                                <tr key={c.id}>
                                                    <td>{idx + 1}</td>
                                                    <td style={{fontSize: '12px', color: '#64748b'}}><FaClock style={{marginRight: '5px'}}/>{c.time}</td>
                                                    <td><strong>{c.name}</strong></td>
                                                    <td>{c.room}</td>
                                                    <td>{c.note}</td>
                                                    <td>
                                                        <div style={{display: 'flex', justifyContent: 'center', gap: '8px'}}>
                                                            <button className="btn-reply-main" onClick={() => setSelectedComplaint(c)}><FaReply /> Phản hồi</button>
                                                            <button className="btn-approve-mini" onClick={() => handleAction(c.id, 'Approved')}><FaCheck /></button>
                                                            <button className="btn-reject-mini" onClick={() => handleAction(c.id, 'Rejected')}><FaTimes /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="staff-reply-detail-page">
                                    <button onClick={() => setSelectedComplaint(null)} style={{marginBottom: '15px', cursor: 'pointer', border: '1px solid #ddd', background: '#fff', padding: '5px 15px', borderRadius: '5px'}}>← Quay lại</button>
                                    <div className="staff-form-container" style={{borderTop: '5px solid #3b82f6'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                                            <h3>Phản hồi cho: {selectedComplaint.name} ({selectedComplaint.room})</h3>
                                            <span style={{fontSize: '13px', color: '#64748b'}}><FaClock /> Gửi lúc: {selectedComplaint.time}</span>
                                        </div>
                                        <div style={{background: '#f1f5f9', padding: '15px', borderRadius: '8px', fontStyle: 'italic', marginBottom: '20px', borderLeft: '4px solid #cbd5e0'}}>
                                            "{selectedComplaint.note}"
                                        </div>
                                        <label><strong>Ghi chú phản hồi của Staff:</strong></label>
                                        <textarea 
                                            style={{width: '100%', height: '120px', marginTop: '10px', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit'}}
                                            placeholder="Nhập nội dung trả lời cư dân..."
                                            value={replyNote}
                                            onChange={(e) => setReplyNote(e.target.value)}
                                        ></textarea>
                                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '15px'}}>
                                            <button className="btn-add-resident" onClick={() => {alert("Đã gửi phản hồi!"); setSelectedComplaint(null); setReplyNote("");}}>
                                                <FaPaperPlane /> GỬI PHẢN HỒI
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default StaffApartment;