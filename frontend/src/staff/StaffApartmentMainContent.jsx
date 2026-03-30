import React from 'react';
import { FaUserPlus, FaUserEdit, FaTrash, FaReply, FaCheck, FaTimes, FaPaperPlane, FaClock, FaUserSlash, FaUserCheck, FaLock, FaUnlock, FaBuilding } from 'react-icons/fa';
import ComplaintsSection from '../components/sections/manager/ComplaintsSection';

const StaffApartmentMainContent = ({
  activeTab,
  editIndex,
  formData,
  setFormData,
  handleAddAccount,
  residentAccounts,
  handleEdit,
  handleToggleBlock,
  selectedComplaint,
  complaints,
  setSelectedComplaint,
  handleAction,
  replyNote,
  setReplyNote
}) => {

  const mockHistories = [
    { id: 1, name: "Nguyen Van A", room: "A-505", checkIn: "01/01/2025", checkOut: "Present", status: "Active" },
    { id: 2, name: "Minh Son Thanh", room: "B-101", checkIn: "15/06/2024", checkOut: "28/02/2026", status: "Moved Out" },
    { id: 3, name: "Tran Van C", room: "C-202", checkIn: "10/03/2025", checkOut: "Present", status: "Active" },
    { id: 4, name: "Le Thi D", room: "A-1204", checkIn: "20/12/2024", checkOut: "Present", status: "Active" },
    { id: 5, name: "Pham Van E", room: "D-808", checkIn: "05/01/2024", checkOut: "30/11/2025", status: "Moved Out" },
    { id: 6, name: "Le Thi Mai", room: "A-102", checkIn: "12/02/2025", checkOut: "Present", status: "Active" },
    { id: 7, name: "Nguyen Van Dung", room: "B-304", checkIn: "25/03/2024", checkOut: "Present", status: "Active" },
    { id: 8, name: "Trinh Thi Hoa", room: "C-1102", checkIn: "14/05/2025", checkOut: "Present", status: "Active" },
    { id: 9, name: "An Ngoc Tuan", room: "D-1506", checkIn: "10/08/2024", checkOut: "Present", status: "Active" },
    { id: 10, name: "Phan Hoang Linh", room: "A-703", checkIn: "01/09/2025", checkOut: "Present", status: "Active" }
  ];

  const mockAppointments = [
    { id: 1, resident: "Nguyen Van A", room: "C-202", date: "18/03/2026", time: "14:30", type: "Ownership Title Procedure", status: "Upcoming" },
    { id: 2, resident: "Minh Son Thanh", room: "A-505", date: "19/03/2026", time: "09:00", type: "Residency Registration", status: "Upcoming" },
    { id: 3, resident: "Tran Van C", room: "B-101", date: "20/03/2026", time: "11:00", type: "Contract Signing", status: "Upcoming" },
    { id: 4, resident: "Le Thi D", room: "D-808", date: "21/03/2026", time: "15:00", type: "Renovation Request", status: "Upcoming" },
    { id: 5, resident: "Pham Van E", room: "A-1204", date: "22/03/2026", time: "10:30", type: "Key Handover", status: "Completed" }
  ];

  const [selectedApartment, setSelectedApartment] = React.useState(null);
  const [expandedHistoryId, setExpandedHistoryId] = React.useState(null);

  const floors = Array.from({ length: 10 }, (_, i) => 10 - i);
  const apartmentsPerFloor = 7;

  const mockAptDetail = {
    room: selectedApartment,
    floor: selectedApartment ? Math.floor(parseInt(selectedApartment) / 100) : '',
    owner: (selectedApartment % 100 === 1) ? `Nguyen Van A` : null,
    residentCount: (selectedApartment % 100 === 1) ? 3 : 0,
    currentMonthStatus: "Unpaid",
    payerName: "---",
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
              <div className="form-group"><label>OWNER NAME</label><input type="text" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} placeholder="Enter owner name" /></div>
              <div className="form-group"><label>ID CARD / PASSPORT</label><input type="text" value={formData.idCard} onChange={(e) => setFormData({ ...formData, idCard: e.target.value })} placeholder="Enter 12-digit ID number" /></div>
              <div className="form-group"><label>USERNAME</label><input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="Enter username" /></div>
              <div className="form-group">
                <label>GENDER</label>
                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', outline: 'none' }}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group"><label>DATE OF BIRTH</label><input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} /></div>
              <div className="form-group"><label>APARTMENT NO.</label><input type="text" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} placeholder="Enter apartment number" /></div>
            </div>
            <button className="btn-add-resident" style={{ marginTop: '20px', background: editIndex !== null ? '#f59e0b' : '#c89b3c' }} onClick={handleAddAccount}>
              {editIndex !== null ? "CONFIRM UPDATE" : "ISSUE ACCOUNT"}
            </button>
          </div>
          <div className="staff-form-container" style={{ marginTop: '30px' }}>
            <h3>Issued Accounts List</h3>
            <div className="staff-table-scroll">
              <table className="admin-custom-table bordered">
                <thead>
                  <tr><th>Username</th><th>Owner</th><th>Apartment</th><th>Status</th><th style={{ textAlign: 'center' }}>Action</th></tr>
                </thead>
                <tbody>
                  {residentAccounts.map((acc, index) => (
                    <tr key={index}>
                      <td><strong>{acc.username}</strong></td>
                      <td>{acc.owner}</td><td>{acc.room}</td>
                      <td><span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: acc.status === 'Blocked' ? '#fee2e2' : '#dcfce7', color: acc.status === 'Blocked' ? '#ef4444' : '#10b981' }}>{acc.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                          <button className="btn-table-edit" onClick={() => handleEdit(index)}><FaUserEdit /></button>
                          <button className={acc.status === 'Blocked' ? "btn-approve-mini" : "btn-reject-mini"} onClick={() => handleToggleBlock(index)}>
                            {acc.status === 'Blocked' ? <FaUnlock /> : <FaLock />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- COMPLAINTS --- */}
      {activeTab === 'complaints' && (
        <ComplaintsSection
          selectedComplaint={selectedComplaint}
          complaints={complaints}
          setSelectedComplaint={setSelectedComplaint}
          handleAction={handleAction}
          replyNote={replyNote}
          setReplyNote={setReplyNote}
        />
      )}

      {/* --- HISTORY --- */}
      {activeTab === 'history' && (
        <div className="staff-form-container">
          <h3>Stay & Residency History</h3>
          <table className="admin-custom-table bordered">
            <thead>
              <tr><th>Resident</th><th>Apartment</th><th>Check-in</th><th>Status</th></tr>
            </thead>
            <tbody>
              {mockHistories.map(h => (
                <tr key={h.id}><td>{h.name}</td><td>{h.room}</td><td>{h.checkIn}</td><td>{h.status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- APPOINTMENTS --- */}
      {activeTab === 'appointments' && (
        <div className="staff-form-container">
          <h3>Resident Appointments</h3>
          <table className="admin-custom-table bordered">
            <thead>
              <tr><th>Resident</th><th>Apartment</th><th>Date</th><th>Purpose</th><th>Action</th></tr>
            </thead>
            <tbody>
              {mockAppointments.map(app => (
                <tr key={app.id}><td>{app.resident}</td><td>{app.room}</td><td>{app.date}</td><td>{app.type}</td>
                <td><button className="btn-approve-mini"><FaCheck /></button></td></tr>
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
              <h3>VinaHouse Building Layout (Apartments)</h3>
              <div className="building-grid">
                {floors.map(floor => (
                  <div key={floor} className="floor-row">
                    <div className="floor-label">Floor {floor}</div>
                    <div className="apartment-grid">
                      {Array.from({ length: apartmentsPerFloor }).map((_, idx) => {
                        const aptNumber = floor * 100 + idx + 1;
                        return (<div key={aptNumber} className="apartment-box" onClick={() => setSelectedApartment(aptNumber)}>{aptNumber}</div>);
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="staff-form-container apartment-detail-view">
              <button onClick={() => setSelectedApartment(null)} className="btn-back">← Back</button>
              <h3>Apartment: {mockAptDetail.room}</h3>
              <div className="apt-info-grid">
                <p><strong>Floor:</strong> {mockAptDetail.floor}</p>
                <p><strong>Owner:</strong> {mockAptDetail.owner || "Empty"}</p>
              </div>
              <h4 style={{ marginTop: '20px' }}>Month Services</h4>
              <table className="admin-custom-table bordered">
                <thead><tr><th>Service</th><th>Total</th></tr></thead>
                <tbody>
                  {mockAptDetail.services.map((svc, i) => (
                    <tr key={i}><td>{svc.name}</td><td>{(svc.unitPrice * svc.quantity).toLocaleString()}</td></tr>
                  ))}
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
