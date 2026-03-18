import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaBars, FaUserCircle, FaHistory, FaCalendarCheck, 
    FaMoneyBillWave, FaFileInvoice, FaNewspaper, FaComments, 
    FaBuilding, FaUserPlus, FaUserEdit, FaTrash, FaReply, FaCheck, FaTimes, FaPaperPlane, FaClock, FaPhone,
    FaFileExcel, FaCogs, FaPlus, FaEye, FaCalendarAlt, FaSearch
} from 'react-icons/fa';
import '../styles/staff.css';

const StaffApartment = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showIdCard, setShowIdCard] = useState(false);
    const [activeTab, setActiveTab] = useState('accounts');

    // --- 1. LOGIC QUẢN LÝ TÀI KHOẢN ---
    const [formData, setFormData] = useState({
        username: '', password: '', owner: '', dob: '', dateAdded: '', room: '', phone: ''
    });
    const [residentAccounts, setResidentAccounts] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const handleAddAccount = () => {
        if (!formData.username || !formData.owner || !formData.room || !formData.phone) {
            alert("Vui lòng nhập đủ các thông tin bắt buộc!"); return;
        }
        if (editIndex !== null) {
            const updatedList = [...residentAccounts];
            updatedList[editIndex] = formData;
            setResidentAccounts(updatedList);
            setEditIndex(null);
        } else {
            setResidentAccounts([...residentAccounts, formData]);
        }
        setFormData({ username: '', password: '', owner: '', dob: '', dateAdded: '', room: '', phone: '' });
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

    // --- 2. LOGIC STAY AT HISTORY (KHÔI PHỤC ĐỦ 7 Ô NHƯ ẢNH) ---
    const [historyFormData, setHistoryFormData] = useState({
        id: '', owner: '', room: '', phone: '', hometown: '', current: '', status: 'Đang lưu trú'
    });
    const [stayHistory, setStayHistory] = useState([
        { id: '01', owner: 'Trần Phu Thanh Hung', room: 'A-505', phone: '0912345678', hometown: 'Nam Định', current: 'Vin Ocean Park', status: 'Đang lưu trú' }
    ]);
    const [editHistoryIndex, setEditHistoryIndex] = useState(null);

    const handleAddHistory = () => {
        if (!historyFormData.id || !historyFormData.owner || !historyFormData.room) {
            alert("Vui lòng nhập đủ ID, Chủ hộ và Căn hộ!"); return;
        }
        if (editHistoryIndex !== null) {
            const updated = [...stayHistory];
            updated[editHistoryIndex] = historyFormData;
            setStayHistory(updated);
            setEditHistoryIndex(null);
        } else {
            setStayHistory([...stayHistory, historyFormData]);
        }
        setHistoryFormData({ id: '', owner: '', room: '', phone: '', hometown: '', current: '', status: 'Đang lưu trú' });
    };

    // --- 3. LOGIC KHIẾU NẠI ---
    const [selectedComplaint, setSelectedComplaint] = useState(null); 
    const [replyNote, setReplyNote] = useState("");
    const [complaints, setComplaints] = useState([
        { id: 1, name: "Trần Phu Thanh Hung", room: "A-505", note: "Điều hòa kêu to quá không ngủ được!", time: "15:30 - 12/03/2026", status: "Pending" },
        { id: 2, name: "Minh Son Thanh", room: "B-101", note: "Cửa thoát hiểm bị kẹt, staff xem lại", time: "09:15 - 13/03/2026", status: "Pending" }
    ]);

    const handleAction = (id, type) => {
        setComplaints(complaints.map(c => c.id === id ? { ...c, status: type } : c));
        alert(`Đã ${type === 'Approved' ? 'Phê duyệt' : 'Từ chối'} phản ánh!`);
    };

    // --- 4. LOGIC UTILITIES INVOICES & MODAL MỚI ---
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [invForm, setInvForm] = useState({
        room: '', date: '', roomPrice: 0, prevElec: 0, currElec: 0, dueDate: ''
    });
    const elecPrice = 3500;
    const otherServiceFee = 500000;

    const calcElecTotal = () => {
        const consumed = Number(invForm.currElec) - Number(invForm.prevElec);
        return consumed > 0 ? consumed * elecPrice : 0;
    };

    const calcFinalTotal = () => {
        return calcElecTotal() + otherServiceFee + Number(invForm.roomPrice);
    };

    const [invoices] = useState([
        { id: 'HD-202512-001', room: 'Phòng 1', owner: 'Nguyễn Văn Dược', time: '12/2025', total: '2.940.000 VNĐ', status: 'ĐÃ THANH TOÁN' }
    ]);

    return (
        <div className="staff-wrapper">
            <aside className={`staff-sidebar ${sidebarOpen ? '' : 'closed'}`}>
                <div style={{padding: '25px', display: 'flex', alignItems: 'center'}}>
                    <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} style={{cursor: 'pointer', color: '#f59e0b'}} />
                    {sidebarOpen && <span style={{marginLeft: '15px', fontWeight: '800', color: '#f59e0b'}}>STAFF HUB</span>}
                </div>
                <nav className="staff-sidebar-nav">
                    <div className={`staff-nav-item ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => {setActiveTab('accounts'); setSelectedComplaint(null)}}><FaUserCircle /> {sidebarOpen && "Resident Accounts"}</div>
                    <div className={`staff-nav-item ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')}><FaComments /> {sidebarOpen && "Complaints & Replies"}</div>
                    <div className="staff-nav-item" onClick={() => navigate('/news')}><FaNewspaper /> {sidebarOpen && "News Manager"}</div>
                    <div className="staff-nav-item" onClick={() => navigate('/market')}><FaBuilding /> {sidebarOpen && "Apartment Types"}</div>
                    <div className={`staff-nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}><FaHistory /> {sidebarOpen && "Stay At History"}</div>
                    <div className={`staff-nav-item ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}><FaFileInvoice /> {sidebarOpen && "Utilities Invoices"}</div>
                    <div className="staff-nav-item"><FaCalendarCheck /> {sidebarOpen && "Appointments"}</div>
                    <div className="staff-nav-item"><FaMoneyBillWave /> {sidebarOpen && "Expenses"}</div>
                </nav>
            </aside>

            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <header className="staff-topbar">
                    <nav className="staff-main-nav">
                        <a href="/staff/apartment" className="active">STAFF APARTMENT</a>
                        <a href="/staff/service">STAFF SERVICE</a>
                        <a href="/staff/security">STAFF SECURITY</a>
                    </nav>
                    <div className="staff-profile-trigger" onClick={() => setShowIdCard(!showIdCard)}>
                        <FaUserCircle size={35} color="#f59e0b" />
                    </div>
                </header>

                <main className="staff-content-area">
                    {/* --- TAB 1: ACCOUNTS --- */}
                    {activeTab === 'accounts' && (
                        <div className="staff-account-management">
                            <div className="staff-form-container gold-border">
                                <h3><FaUserPlus color="#f59e0b" /> {editIndex !== null ? "Chỉnh sửa tài khoản" : "Cấp tài khoản Resident mới"}</h3>
                                <div className="staff-grid" style={{marginTop: '20px', gridTemplateColumns: 'repeat(3, 1fr)'}}>
                                    <div className="form-group"><label>TÊN ĐĂNG NHẬP</label><input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} /></div>
                                    <div className="form-group"><label>MẬT KHẨU</label><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
                                    <div className="form-group"><label>TÊN CHỦ HỘ</label><input type="text" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} /></div>
                                    <div className="form-group"><label>NGÀY SINH</label><input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} /></div>
                                    <div className="form-group"><label>SỐ ĐIỆN THOẠI</label><input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                                    <div className="form-group"><label>NGÀY THÊM</label><input type="date" value={formData.dateAdded} onChange={(e) => setFormData({...formData, dateAdded: e.target.value})} /></div>
                                    <div className="form-group"><label>SỐ CĂN HỘ</label><input type="text" value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} /></div>
                                </div>
                                <button className="btn-gold" style={{marginTop: '20px'}} onClick={handleAddAccount}>CẤP TÀI KHOẢN</button>
                            </div>
                            <div className="staff-form-container">
                                <h3>Danh sách tài khoản đã cấp</h3>
                                <table className="admin-custom-table bordered">
                                    <thead>
                                        <tr><th>ID</th><th>USERNAME</th><th>CHỦ HỘ</th><th>PHONE</th><th>CĂN HỘ</th><th>NGÀY SINH</th><th style={{textAlign: 'center'}}>HÀNH ĐỘNG</th></tr>
                                    </thead>
                                    <tbody>
                                        {residentAccounts.map((acc, index) => (
                                            <tr key={index}>
                                                <td>{String(index + 1).padStart(2, '0')}</td>
                                                <td><strong>{acc.username}</strong></td>
                                                <td>{acc.owner}</td><td>{acc.phone}</td>
                                                <td><span className="apartment-tag">{acc.room}</span></td>
                                                <td>{acc.dob}</td>
                                                <td style={{textAlign: 'center'}}><div className="action-flex"><FaUserEdit className="icon-edit" onClick={()=>handleEdit(index)}/><FaTrash className="icon-delete" onClick={()=>handleDelete(index)}/></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 2: COMPLAINTS --- */}
                    {activeTab === 'complaints' && (
                        <div className="staff-complaint-section">
                            <div className="staff-form-container">
                                <h3>Danh sách phản ánh từ Resident</h3>
                                <table className="admin-custom-table bordered" style={{marginTop: '20px'}}>
                                    <thead>
                                        <tr><th>STT</th><th>Thời gian</th><th>Tên Resident</th><th>Căn hộ</th><th>Nội dung</th><th style={{textAlign: 'center'}}>Hành động</th></tr>
                                    </thead>
                                    <tbody>
                                        {complaints.map((c, idx) => (
                                            <tr key={c.id}>
                                                <td>{idx + 1}</td>
                                                <td style={{fontSize: '12px', color: '#64748b'}}><FaClock /> {c.time}</td>
                                                <td><strong>{c.name}</strong></td><td>{c.room}</td><td>{c.note}</td>
                                                <td style={{textAlign: 'center'}}><div className="action-flex"><button className="btn-reply-gold" onClick={() => setSelectedComplaint(c)}><FaReply /> Phản hồi</button><FaCheck style={{color: 'green', cursor:'pointer'}} onClick={()=>handleAction(c.id, 'Approved')}/><FaTimes style={{color: 'red', cursor:'pointer'}} onClick={()=>handleAction(c.id, 'Rejected')}/></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {selectedComplaint && (
                                <div className="staff-reply-detail-page" style={{marginTop: '20px'}}>
                                    <div className="staff-form-container gold-border">
                                        <h3>Phản hồi cho: {selectedComplaint.name}</h3>
                                        <textarea style={{width: '100%', height: '100px', marginTop:'10px'}} placeholder="Nhập nội dung..."></textarea>
                                        <div style={{display:'flex', gap:'10px', marginTop:'10px'}}><button className="btn-gold">GỬI</button><button className="btn-cancel" onClick={()=>setSelectedComplaint(null)}>HỦY</button></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- TAB 3: STAY AT HISTORY --- */}
                    {activeTab === 'history' && (
                        <div className="staff-history-section">
                            <div className="staff-form-container gold-border">
                                <h3><FaHistory color="#f59e0b" /> Stay At History Registration</h3>
                                <div className="staff-grid" style={{marginTop: '20px', gridTemplateColumns: 'repeat(4, 1fr)'}}>
                                    <div className="form-group"><label>ID</label><input type="text" value={historyFormData.id} onChange={(e) => setHistoryFormData({...historyFormData, id: e.target.value})} /></div>
                                    <div className="form-group"><label>TÊN CHỦ HỘ</label><input type="text" value={historyFormData.owner} onChange={(e) => setHistoryFormData({...historyFormData, owner: e.target.value})} /></div>
                                    <div className="form-group"><label>CĂN HỘ</label><input type="text" value={historyFormData.room} onChange={(e) => setHistoryFormData({...historyFormData, room: e.target.value})} /></div>
                                    <div className="form-group"><label>SỐ ĐIỆN THOẠI</label><input type="text" value={historyFormData.phone} onChange={(e) => setHistoryFormData({...historyFormData, phone: e.target.value})} /></div>
                                    <div className="form-group"><label>HỘ KHẨU</label><input type="text" value={historyFormData.hometown} onChange={(e) => setHistoryFormData({...historyFormData, hometown: e.target.value})} /></div>
                                    <div className="form-group"><label>NƠI Ở HIỆN TẠI</label><input type="text" value={historyFormData.current} onChange={(e) => setHistoryFormData({...historyFormData, current: e.target.value})} /></div>
                                    <div className="form-group"><label>TÌNH TRẠNG</label><select value={historyFormData.status} onChange={(e) => setHistoryFormData({...historyFormData, status: e.target.value})}><option>Đang lưu trú</option><option>Đã rời đi</option></select></div>
                                </div>
                                <button className="btn-gold" style={{marginTop: '20px'}} onClick={handleAddHistory}>LƯU LỊCH SỬ</button>
                            </div>
                            <div className="staff-form-container">
                                <h3>Bảng Tổng hợp Lịch sử Lưu trú</h3>
                                <table className="admin-custom-table bordered">
                                    <thead><tr><th>ID</th><th>CHỦ HỘ</th><th>CĂN HỘ</th><th>SĐT</th><th>HỘ KHẨU</th><th>NƠI Ở HT</th><th>TÌNH TRẠNG</th><th>HÀNH ĐỘNG</th></tr></thead>
                                    <tbody>
                                        {stayHistory.map((h, i) => (
                                            <tr key={i}>
                                                <td>{h.id}</td><td><strong>{h.owner}</strong></td><td>{h.room}</td><td>{h.phone}</td><td>{h.hometown}</td><td>{h.current}</td>
                                                <td><span className={`status-tag ${h.status==='Đang lưu trú'?'active':'left'}`}>{h.status}</span></td>
                                                <td><div className="action-flex"><FaUserEdit className="icon-edit" onClick={()=>{setEditHistoryIndex(i); setHistoryFormData(h)}}/><FaTrash className="icon-delete" onClick={()=>setStayHistory(stayHistory.filter((_,idx)=>idx!==i))}/></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 4: UTILITIES INVOICES --- */}
                    {activeTab === 'invoices' && (
                        <div className="staff-invoice-section">
                            <div className="invoice-header-flex">
                                <h2>Quản Lý Hóa Đơn</h2>
                                <div className="invoice-header-btns">
                                    <button className="btn-excel"><FaFileExcel /> Xuất Excel</button>
                                    <button className="btn-config"><FaCogs /> Cấu hình giá</button>
                                    <button className="btn-create-inv" onClick={() => setShowInvoiceModal(true)}><FaPlus /> Tạo hóa đơn</button>
                                </div>
                            </div>
                            <div className="staff-form-container">
                                <div className="staff-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
                                    <div className="form-group"><label>TRẠNG THÁI</label><select><option>Tất cả</option><option>Đã thanh toán</option><option>Chưa thanh toán</option></select></div>
                                    <div className="form-group"><label>THÁNG</label><select><option>Tất cả</option></select></div>
                                    <div className="form-group"><label>PHÒNG</label><input type="text" placeholder="Tất cả" /></div>
                                    <div className="form-group"><label>TÌM KIẾM</label><div className="input-with-icon"><input type="text" placeholder="Tìm kiếm..." /><FaSearch className="inner-icon"/></div></div>
                                </div>
                            </div>
                            <div className="staff-form-container">
                                <table className="admin-custom-table bordered">
                                    <thead><tr><th>Số hóa đơn</th><th>Phòng</th><th>Người thuê</th><th>Tổng tiền</th><th>Thao tác</th></tr></thead>
                                    <tbody>
                                        {invoices.map((inv, idx) => (
                                            <tr key={idx}>
                                                <td>{inv.id}</td><td>{inv.room}</td><td><strong>{inv.owner}</strong></td><td>{inv.total}</td>
                                                <td><div className="action-flex"><FaEye className="icon-view"/><FaUserEdit className="icon-edit"/><FaTrash className="icon-delete"/></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* MODAL NỔI TẠO HÓA ĐƠN THEO ẢNH */}
            {showInvoiceModal && (
                <div className="invoice-modal-overlay">
                    <div className="invoice-modal-content">
                        <div className="modal-header">
                            <h3>Tạo hóa đơn mới</h3>
                            <FaTimes className="close-btn" onClick={() => setShowInvoiceModal(false)} />
                        </div>
                        <div className="modal-body-scroll">
                            <div className="form-group">
                                <label>Phòng <span style={{color:'red'}}>*</span></label>
                                <input type="text" placeholder="PHONGC101 - Nguyễn Văn B" value={invForm.room} onChange={e => setInvForm({...invForm, room: e.target.value})} />
                            </div>
                            <div className="staff-grid" style={{gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'15px'}}>
                                <div className="form-group"><label>Tháng/Năm</label><input type="month" /></div>
                                <div className="form-group"><label>Tiền phòng (VNĐ)</label><input type="number" placeholder="Tiền thuê nhà..." value={invForm.roomPrice} onChange={e => setInvForm({...invForm, roomPrice: e.target.value})} /></div>
                            </div>
                            <div className="electric-box-shadow">
                                <h4 style={{marginBottom:'10px'}}>Chỉ số Điện</h4>
                                <div className="form-group"><label>Giá điện (VNĐ/kWh)</label><input type="text" value="3500" disabled /></div>
                                <div className="staff-grid" style={{gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'10px'}}>
                                    <div className="form-group"><label>Số điện tháng trước</label><input type="number" value={invForm.prevElec} onChange={e => setInvForm({...invForm, prevElec: e.target.value})} /></div>
                                    <div className="form-group"><label>Số điện tháng này</label><input type="number" value={invForm.currElec} onChange={e => setInvForm({...invForm, currElec: e.target.value})} /></div>
                                </div>
                                <div className="res-calc">Tiền điện: <strong>{calcElecTotal().toLocaleString()} VNĐ</strong></div>
                            </div>
                            <div className="form-group" style={{marginTop:'15px'}}><label>Dịch vụ khác (Mặc định)</label><input type="text" value="500,000 VNĐ" disabled /></div>
                            <div className="form-group" style={{marginTop:'15px'}}><label>Ngày đến hạn</label><input type="date" /></div>
                            <div className="total-final-box">
                                TỔNG CỘNG: <strong>{calcFinalTotal().toLocaleString()} VNĐ</strong>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowInvoiceModal(false)}>HỦY</button>
                            <button className="btn-gold">TẠO HÓA ĐƠN</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffApartment;