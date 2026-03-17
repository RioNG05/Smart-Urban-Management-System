import React from 'react';
import { FaUserPlus, FaUserEdit, FaTrash, FaReply, FaCheck, FaTimes, FaPaperPlane, FaClock } from 'react-icons/fa';

const StaffApartmentMainContent = ({
  activeTab,
  editIndex,
  formData,
  setFormData,
  handleAddAccount,
  residentAccounts,
  handleEdit,
  handleDelete,
  selectedComplaint,
  complaints,
  setSelectedComplaint,
  handleAction,
  replyNote,
  setReplyNote
}) => {
  // [BACKEND_NOTE]: Dữ liệu các phần này sẽ được truyền từ StaffApartment.jsx xuống qua Props như residentAccounts

  const mockHistories = [
    { id: 1, name: "Nguyen Van A", room: "A-505", checkIn: "01/01/2025", checkOut: "Present", status: "Active" },
    { id: 2, name: "Nguyen Van B", room: "B-101", checkIn: "15/06/2024", checkOut: "28/02/2026", status: "Moved Out" }
  ];

  const mockAppointments = [
    { id: 1, resident: "Nguyen Van A", room: "C-202", date: "18/03/2026", time: "14:30", type: "Ownership Title Procedure", status: "Upcoming" },
    { id: 2, resident: "Nguyen Van B", room: "A-505", date: "19/03/2026", time: "09:00", type: "Residency Registration", status: "Upcoming" }
  ];

  const [selectedApartment, setSelectedApartment] = React.useState(null);
  const [expandedHistoryId, setExpandedHistoryId] = React.useState(null);

  // [BACKEND_NOTE]: Gọi API lấy list các căn hộ và trạng thái
  const floors = Array.from({ length: 10 }, (_, i) => 10 - i); // 10 tầng
  const apartmentsPerFloor = 7; // 7 phòng 1 tầng

  // [BACKEND_NOTE]: 
  // 1. Khi user click vào 1 ô căn hộ, StaffApartment.jsx sẽ gọi API: GET /api/apartments/{aptNumber}
  // 2. Backend trả về object chi tiết. Nếu 'owner' là null hoặc trống -> Hiển thị "Chưa có chủ sở hữu".
  // 3. Nếu 'owner' trống: Bảng "Dịch vụ tháng hiện tại" sẽ không có dữ liệu (vì chưa có hợp đồng).
  // 4. Nếu căn hộ này từng có chủ cũ hoặc lịch sử giao dịch, vẫn hiển thị ở bảng "Lịch sử giao dịch".
  // 5. 'services' và 'history' cũng sẽ được lấy từ các bảng Invoice/Contract tương ứng.
  const mockAptDetail = {
    room: selectedApartment,
    floor: selectedApartment ? Math.floor(parseInt(selectedApartment) / 100) : '',
    // Logic test: Chỉ căn hộ số 01 của mỗi tầng là có chủ
    owner: (selectedApartment % 100 === 1) ? `Nguyen Van A` : null,
    residentCount: (selectedApartment % 100 === 1) ? 3 : 0,
    currentMonthStatus: "Chưa thanh toán",
    payerName: (selectedApartment % 100 === 1) ? "---" : "---", // Mặc định chưa thanh toán thì chưa có tên người trả
    services: [
      { name: "Electricity", unitPrice: 3500, quantity: 150 },
      { name: "Water", unitPrice: 15000, quantity: 10 },
      { name: "Management Fee", unitPrice: 12000, quantity: (selectedApartment % 100 === 1) ? 3 : 0 }
    ],
    history: [
      {
        id: 1, month: "02/2026", total: "1,450,000", status: "Paid", payer: "Robert Miller", details: [
          { name: "Electricity", unitPrice: 3500, quantity: 130, total: 455000 },
          { name: "Water", unitPrice: 15000, quantity: 11, total: 165000 },
          { name: "Management Fee", unitPrice: 12000, quantity: (selectedApartment % 100 === 1) ? 3 : 0, total: ((selectedApartment % 100 === 1) ? 3 : 0) * 12000 }
        ]
      },
      {
        id: 2, month: "01/2026", total: "1,520,000", status: "Paid", payer: "Linda Wilson", details: [
          { name: "Electricity", unitPrice: 3500, quantity: 140, total: 490000 },
          { name: "Water", unitPrice: 15000, quantity: 12, total: 180000 },
          { name: "Management Fee", unitPrice: 12000, quantity: (selectedApartment % 100 === 1) ? 3 : 0, total: ((selectedApartment % 100 === 1) ? 3 : 0) * 12000 }
        ]
      }
    ]
  };

  return (
    <main className="staff-content-area">
      {/* --- ACCOUNTS --- */}
      {activeTab === 'accounts' && (
        <div className="staff-account-management staff-tab-content">
          <div className="staff-form-container" style={{ borderLeft: '5px solid #c89b3c' }}>
            <h3><FaUserPlus /> {editIndex !== null ? "Edit Resident Account" : "Issue New Resident Account"}</h3>
            <div className="staff-grid" style={{ marginTop: '20px' }}>
              <div className="form-group"><label>Username</label><input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} /></div>
              <div className="form-group"><label>Password</label><input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} /></div>
              <div className="form-group"><label>Owner Name</label><input type="text" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} /></div>
              <div className="form-group"><label>Date of Birth</label><input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} /></div>
              <div className="form-group"><label>Date Added</label><input type="date" value={formData.dateAdded} onChange={(e) => setFormData({ ...formData, dateAdded: e.target.value })} /></div>
              <div className="form-group"><label>Apartment No.</label><input type="text" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} /></div>
            </div>
            <button className="btn-add-resident" style={{ marginTop: '20px', background: editIndex !== null ? '#f59e0b' : '#c89b3c' }} onClick={handleAddAccount}>
              {editIndex !== null ? "CONFIRM UPDATE" : "ISSUE ACCOUNT"}
            </button>
          </div>

          <div className="staff-form-container" style={{ marginTop: '30px' }}>
            <h3>Issued Accounts List</h3>
            <table className="admin-custom-table bordered">
              <thead>
                <tr>
                  <th>Username</th><th>Owner</th><th>Apartment</th><th>DOB</th><th>Date Issued</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {residentAccounts.length > 0 ? residentAccounts.map((acc, index) => (
                  <tr key={index}>
                    <td><strong>{acc.username}</strong></td>
                    <td>{acc.owner}</td><td>{acc.room}</td><td>{acc.dob}</td><td>{acc.dateAdded}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button className="btn-table-edit" onClick={() => handleEdit(index)}><FaUserEdit /></button>
                        <button className="btn-table-delete" onClick={() => handleDelete(index)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No data available...</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- COMPLAINTS --- */}
      {activeTab === 'complaints' && (
        <div className="staff-complaint-section staff-tab-content">
          {!selectedComplaint ? (
            <div className="staff-form-container">
              <h3>Resident Complaints List</h3>
              <table className="admin-custom-table bordered" style={{ marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Time</th>
                    <th>Resident Name</th>
                    <th>Apartment</th>
                    <th>Complaint Content</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c, idx) => (
                    <tr key={c.id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontSize: '12px', color: '#64748b' }}><FaClock style={{ marginRight: '5px' }} />{c.time}</td>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.room}</td>
                      <td>{c.note}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button className="btn-reply-main" onClick={() => setSelectedComplaint(c)}><FaReply /> Reply</button>
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
              <button onClick={() => setSelectedComplaint(null)} style={{ marginBottom: '15px', cursor: 'pointer', border: '1px solid #ddd', background: '#fff', padding: '5px 15px', borderRadius: '5px' }}>← Back</button>
              <div className="staff-form-container" style={{ borderTop: '5px solid #c89b3c' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3>Response to: {selectedComplaint.name} ({selectedComplaint.room})</h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}><FaClock /> Sent at: {selectedComplaint.time}</span>
                </div>
                <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '8px', fontStyle: 'italic', marginBottom: '20px', borderLeft: '4px solid #cbd5e0' }}>
                  "{selectedComplaint.note}"
                </div>
                <label><strong>Staff Response Note:</strong></label>
                <textarea
                  style={{ width: '100%', height: '120px', marginTop: '10px', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit' }}
                  placeholder="Enter response to resident..."
                  value={replyNote}
                  onChange={(e) => setReplyNote(e.target.value)}
                ></textarea>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                  {/* [BACKEND_NOTE]: Gọi API (POST) để gửi nội dung replyNote cho một khiếu nại cụ thể lên Database */}
                  <button className="btn-add-resident" onClick={() => {
                    // await axios.post(`/api/staff/complaints/${selectedComplaint.id}/reply`, { reply: replyNote });
                    alert("Reply sent!");
                    setSelectedComplaint(null);
                    setReplyNote("");
                  }}>
                    <FaPaperPlane /> SEND REPLY
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- STAY AT HISTORY --- */}
      {activeTab === 'history' && (
        <div className="staff-form-container staff-tab-content">
          <h3>Stay & Residency History</h3>
          <table className="admin-custom-table bordered" style={{ marginTop: '20px' }}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Resident Name</th>
                <th>Apartment</th>
                <th>Check-in Date</th>
                <th>Check-out Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockHistories.map((h, i) => (
                <tr key={h.id}>
                  <td>{i + 1}</td>
                  <td><strong>{h.name}</strong></td>
                  <td>{h.room}</td>
                  <td>{h.checkIn}</td>
                  <td>{h.checkOut}</td>
                  <td>
                    <span style={{ color: h.status === 'Active' ? '#10b981' : '#64748b', fontWeight: 'bold' }}>
                      {h.status === 'Active' ? 'Residing' : 'Moved Out'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- APPOINTMENTS --- */}
      {activeTab === 'appointments' && (
        <div className="staff-form-container staff-tab-content">
          <h3 style={{ marginBottom: '20px' }}>Resident Appointments</h3>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <button className="btn-add-resident" style={{ background: '#c89b3c', padding: '10px 20px', fontWeight: 'bold' }}>+ ADD APPOINTMENT</button>
          </div>
          <table className="admin-custom-table bordered">
            <thead>
              <tr>
                <th>No.</th>
                <th>Resident</th>
                <th>Apartment</th>
                <th>Date</th>
                <th>Time</th>
                <th>Purpose</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockAppointments.map((app, i) => (
                <tr key={app.id}>
                  <td>{i + 1}</td>
                  <td><strong>{app.resident}</strong></td>
                  <td>{app.room}</td>
                  <td>{app.date}</td>
                  <td>{app.time}</td>
                  <td>{app.type}</td>
                  <td>
                    <span style={{
                      padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                      background: '#eff6ff', color: '#3b82f6'
                    }}>
                      Upcoming
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button className="btn-approve-mini"><FaCheck /></button>
                      <button className="btn-table-edit" style={{ padding: '6px' }}><FaUserEdit /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- APARTMENT MANAGEMENT --- */}
      {activeTab === 'apartment_management' && (
        <div className="staff-apartment-management staff-tab-content">
          {!selectedApartment ? (
            <div className="staff-form-container building-container">
              <h3 style={{ marginBottom: '20px' }}>VinaHouse Building Layout (Apartments)</h3>
              <div className="building-grid">
                {floors.map(floor => (
                  <div key={floor} className="floor-row">
                    <div className="floor-label">Floor {floor}</div>
                    <div className="apartment-grid">
                      {Array.from({ length: apartmentsPerFloor }).map((_, idx) => {
                        const aptNumber = floor * 100 + idx + 1;
                        return (
                          <div key={aptNumber} className="apartment-box" onClick={() => setSelectedApartment(aptNumber)}>
                            {aptNumber}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="staff-form-container apartment-detail-view">
              <button onClick={() => setSelectedApartment(null)} className="btn-back">← Back to Layout</button>
              <h3 style={{ marginTop: '15px', color: '#c89b3c' }}>Apartment Details: {mockAptDetail.room}</h3>
              <div className="apt-info-grid" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginTop: '15px' }}>
                <p><strong>Floor:</strong> {mockAptDetail.floor}</p>
                <p>
                  <strong>Owner:</strong> {mockAptDetail.owner ? (
                    mockAptDetail.owner
                  ) : (
                    <span style={{ color: '#64748b', fontStyle: 'italic' }}>No Owner (Empty)</span>
                  )}
                </p>
                <p><strong>Current Residents:</strong> {mockAptDetail.residentCount} people</p>
              </div>

              <h4 style={{ marginTop: '25px', marginBottom: '15px' }}>Current Month Services Table</h4>
              {mockAptDetail.owner ? (
                <table className="admin-custom-table bordered">
                  <thead>
                    <tr><th>Service</th><th>Unit Price (VND)</th><th>Quantity</th><th>Total (VND)</th></tr>
                  </thead>
                  <tbody>
                    {mockAptDetail.services.map((svc, idx) => {
                      const totalAmount = svc.unitPrice * svc.quantity;
                      return (
                        <tr key={idx}>
                          <td>{svc.name}</td>
                          <td>{svc.unitPrice.toLocaleString()}</td>
                          <td>{svc.quantity} {svc.name === "Management Fee" ? "(People)" : ""}</td>
                          <td style={{ fontWeight: 'bold', color: '#1e293b' }}>{totalAmount.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#f8fafc' }}>
                      <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '15px' }}>GRAND TOTAL THIS MONTH:</td>
                      <td style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '16px' }}>
                        {mockAptDetail.services.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>PAYER:</td>
                      <td style={{ fontWeight: '500', color: '#64748b' }}>
                        {mockAptDetail.payerName}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>STATUS:</td>
                      <td>
                        <span style={{ color: mockAptDetail.currentMonthStatus === 'Paid' ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: '15px' }}>
                          {mockAptDetail.currentMonthStatus}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#64748b', border: '1px dashed #cbd5e1' }}>
                  <p>Apartment is currently empty - No current service data available.</p>
                </div>
              )}

              <h4 style={{ marginTop: '25px', marginBottom: '15px' }}>Service Transaction History</h4>
              <table className="admin-custom-table bordered">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Payer</th>
                    <th>Total (VND)</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAptDetail.history.map((hist) => {
                    const historyTotal = hist.details.reduce((acc, curr) => acc + curr.total, 0);
                    return (
                      <React.Fragment key={hist.id}>
                        <tr>
                          <td>{hist.month}</td>
                          <td>{hist.payer}</td>
                          <td style={{ fontWeight: 'bold' }}>{historyTotal.toLocaleString()}</td>
                          <td><span style={{ color: '#10b981', fontWeight: 'bold' }}>{hist.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <button
                                className="btn-reply-main"
                                onClick={() => setExpandedHistoryId(expandedHistoryId === hist.id ? null : hist.id)}
                              >
                                {expandedHistoryId === hist.id ? "Hide Details" : "View Details"}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedHistoryId === hist.id && (
                          <tr>
                            <td colSpan="5">
                              <div style={{ padding: '15px', borderLeft: '4px solid #c89b3c', background: '#f8fafc' }}>
                                <h5 style={{ marginBottom: '10px', color: '#1e293b' }}>Service Details for Month {hist.month}:</h5>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                  <thead style={{ background: '#e2e8f0' }}>
                                    <tr>
                                      <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Service</th>
                                      <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Unit Price</th>
                                      <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Quantity</th>
                                      <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Total Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {hist.details.map((detail, dIdx) => (
                                      <tr key={dIdx}>
                                        <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{detail.name}</td>
                                        <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{detail.unitPrice.toLocaleString()}</td>
                                        <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{detail.quantity} {detail.name === "Management Fee" ? "(People)" : ""}</td>
                                        <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>{detail.total.toLocaleString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default StaffApartmentMainContent;
