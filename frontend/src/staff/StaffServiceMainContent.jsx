import React, { useState } from 'react';
import {
    FaCalendarCheck, FaCreditCard, FaCheck, FaTimes,
    FaInfoCircle, FaSwimmingPool, FaDumbbell, FaFire
} from 'react-icons/fa';

const StaffServiceMainContent = ({ activeTab }) => {
    // --- STATE FOR FILTERS ---
    const [bookingFilter, setBookingFilter] = useState('All');
    const [feeFilter, setFeeFilter] = useState('All');

    // --- MOCK DATA FOR SERVICE ---
    const [bookings, setBookings] = useState([
        { id: 1, resident: "Nguyen Van A", service: "Swimming Pool", date: "18/03/2026", time: "17:00 - 19:00", status: "Approved" },
        { id: 2, resident: "Tran Thi B", service: "Gym & Yoga", date: "18/03/2026", time: "08:00 - 10:00", status: "Pending" },
        { id: 3, resident: "Le Van C", service: "BBQ Park", date: "19/03/2026", time: "18:00 - 21:00", status: "Approved" },
        { id: 4, resident: "Pham Thi D", service: "Swimming Pool", date: "20/03/2026", time: "16:00 - 18:00", status: "Pending" },
        { id: 5, resident: "Hoang Van E", service: "Gym & Yoga", date: "21/03/2026", time: "06:00 - 08:00", status: "Deny" },
        { id: 6, resident: "Doan Kim F", service: "BBQ Park", date: "22/03/2026", time: "11:00 - 15:00", status: "Pending" },
        { id: 7, resident: "Truong Minh G", service: "Swimming Pool", date: "18/03/2026", time: "14:00 - 16:00", status: "Approved" },
        { id: 8, resident: "Vu Thi H", service: "Gym & Yoga", date: "19/03/2026", time: "15:00 - 17:00", status: "Approved" },
        { id: 9, resident: "Le Thi Mai", service: "BBQ Park", date: "20/03/2026", time: "17:00 - 20:00", status: "Pending" },
        { id: 10, resident: "Nguyen Van Dung", service: "Swimming Pool", date: "21/03/2026", time: "09:00 - 11:00", status: "Approved" },
        { id: 11, resident: "Trinh Thi Hoa", service: "Gym & Yoga", date: "21/03/2026", time: "18:00 - 20:00", status: "Pending" },
        { id: 12, resident: "An Ngoc Tuan", service: "BBQ Park", date: "22/03/2026", time: "10:00 - 14:00", status: "Approved" },
        { id: 13, resident: "Phan Hoang Linh", service: "Swimming Pool", date: "22/03/2026", time: "15:00 - 17:00", status: "Pending" },
        { id: 14, resident: "Bui Quoc Thanh", service: "Gym & Yoga", date: "23/03/2026", time: "07:00 - 09:00", status: "Approved" },
        { id: 15, resident: "Ngo Thu Quynh", service: "BBQ Park", date: "23/03/2026", time: "18:30 - 21:30", status: "Pending" },
        { id: 16, resident: "Do Van Dat", service: "Swimming Pool", date: "24/03/2026", time: "10:00 - 12:00", status: "Approved" },
        { id: 17, resident: "Hoang Thi Yen", service: "Gym & Yoga", date: "24/03/2026", time: "16:00 - 18:00", status: "Deny" },
        { id: 18, resident: "Pham Quoc Khanh", service: "BBQ Park", date: "25/03/2026", time: "11:00 - 14:00", status: "Pending" },
        { id: 19, resident: "Phan Thu Ngoc", service: "Swimming Pool", date: "25/03/2026", time: "18:00 - 20:00", status: "Approved" },
        { id: 20, resident: "Hoang Van Long", service: "Gym & Yoga", date: "26/03/2026", time: "08:30 - 10:30", status: "Pending" },
        { id: 21, resident: "Nguyen Thu Trang", service: "BBQ Park", date: "26/03/2026", time: "17:00 - 20:00", status: "Approved" },
        { id: 22, resident: "Nguyen Huu Thang", service: "Swimming Pool", date: "27/03/2026", time: "09:00 - 11:00", status: "Pending" },
        { id: 23, resident: "Tran Thi Diem", service: "Gym & Yoga", date: "27/03/2026", time: "15:00 - 17:00", status: "Approved" },
        { id: 24, resident: "Vu Quoc Binh", service: "BBQ Park", date: "28/03/2026", time: "18:00 - 21:00", status: "Pending" },
        { id: 25, resident: "Ha Thi Thu", service: "Swimming Pool", date: "28/03/2026", time: "14:00 - 16:00", status: "Approved" },
        { id: 26, resident: "Nguyen Minh Quan", service: "Gym & Yoga", date: "29/03/2026", time: "07:00 - 09:00", status: "Deny" },
        { id: 27, resident: "Truong Thi Vy", service: "BBQ Park", date: "29/03/2026", time: "11:00 - 15:00", status: "Pending" },
        { id: 28, resident: "Dang Hoang Phuc", service: "Swimming Pool", date: "30/03/2026", time: "10:00 - 12:00", status: "Approved" },
        { id: 29, resident: "Bui Thi An", service: "Gym & Yoga", date: "30/03/2026", time: "16:00 - 18:00", status: "Pending" },
        { id: 30, resident: "Tran Van Minh", service: "BBQ Park", date: "31/03/2026", time: "18:00 - 21:00", status: "Approved" }
    ]);


    const [serviceFees, setServiceFees] = useState([
        { id: 1, resident: "Nguyen Van A", apartment: "A-505", service: "BBQ Park", amount: "200,000 VND", status: "Paid", date: "17/03/2026" },
        { id: 2, resident: "Minh Son Thanh", apartment: "B-202", service: "Swimming Pool", amount: "500,000 VND", status: "Unpaid", date: "15/03/2026" },
        { id: 3, resident: "Le Van C", apartment: "C-1101", service: "Gym & Yoga", amount: "300,000 VND", status: "Paid", date: "10/03/2026" },
        { id: 4, resident: "Dinh Quang I", apartment: "A-1204", service: "Swimming Pool", amount: "150,000 VND", status: "Paid", date: "18/03/2026" },
        { id: 5, resident: "Ly Thu J", apartment: "D-808", service: "BBQ Park", amount: "450,000 VND", status: "Unpaid", date: "16/03/2026" },
        { id: 6, resident: "Ngo Gia K", apartment: "B-303", service: "Gym & Yoga", amount: "100,000 VND", status: "Paid", date: "12/03/2026" },
        { id: 7, resident: "Phan Hoai L", apartment: "C-606", service: "Swimming Pool", amount: "250,000 VND", status: "Unpaid", date: "18/03/2026" },
        { id: 8, resident: "Le Thi Mai", apartment: "A-102", service: "Gym & Yoga", amount: "350,000 VND", status: "Paid", date: "19/03/2026" },
        { id: 9, resident: "Nguyen Van Dung", apartment: "B-304", service: "BBQ Park", amount: "200,000 VND", status: "Paid", date: "19/03/2026" },
        { id: 10, resident: "Trinh Thi Hoa", apartment: "C-1102", service: "Swimming Pool", amount: "400,000 VND", status: "Unpaid", date: "20/03/2026" },
        { id: 11, resident: "An Ngoc Tuan", apartment: "D-1506", service: "Gym & Yoga", amount: "150,000 VND", status: "Paid", date: "20/03/2026" },
        { id: 12, resident: "Phan Hoang Linh", apartment: "A-703", service: "BBQ Park", amount: "500,000 VND", status: "Unpaid", date: "21/03/2026" },
        { id: 13, resident: "Bui Quoc Thanh", apartment: "B-910", service: "Swimming Pool", amount: "300,000 VND", status: "Paid", date: "21/03/2026" },
        { id: 14, resident: "Ngo Thu Quynh", apartment: "C-405", service: "Gym & Yoga", amount: "250,000 VND", status: "Paid", date: "21/03/2026" },
        { id: 15, resident: "Do Van Dat", apartment: "D-1201", service: "BBQ Park", amount: "150,000 VND", status: "Paid", date: "22/03/2026" },
        { id: 16, resident: "Hoang Thi Yen", apartment: "A-312", service: "Swimming Pool", amount: "600,000 VND", status: "Unpaid", date: "22/03/2026" },
        { id: 17, resident: "Pham Quoc Khanh", apartment: "B-508", service: "Gym & Yoga", amount: "100,000 VND", status: "Paid", date: "22/03/2026" },
        { id: 18, resident: "Phan Thu Ngoc", apartment: "C-801", service: "BBQ Park", amount: "450,000 VND", status: "Paid", date: "23/03/2026" },
        { id: 19, resident: "Hoang Van Long", apartment: "D-203", service: "Swimming Pool", amount: "200,000 VND", status: "Unpaid", date: "23/03/2026" },
        { id: 20, resident: "Nguyen Thu Trang", apartment: "A-1405", service: "Gym & Yoga", amount: "300,000 VND", status: "Paid", date: "24/03/2026" },
        { id: 21, resident: "Nguyen Huu Thang", apartment: "B-702", service: "BBQ Park", amount: "250,000 VND", status: "Paid", date: "24/03/2026" },
        { id: 22, resident: "Tran Thi Diem", apartment: "C-1204", service: "Swimming Pool", amount: "150,000 VND", status: "Paid", date: "24/03/2026" },
        { id: 23, resident: "Vu Quoc Binh", apartment: "D-510", service: "Gym & Yoga", amount: "400,000 VND", status: "Unpaid", date: "25/03/2026" },
        { id: 24, resident: "Ha Thi Thu", apartment: "A-908", service: "BBQ Park", amount: "300,000 VND", status: "Paid", date: "25/03/2026" },
        { id: 25, resident: "Nguyen Minh Quan", apartment: "B-1005", service: "Swimming Pool", amount: "500,000 VND", status: "Paid", date: "25/03/2026" },
        { id: 26, resident: "Truong Thi Vy", apartment: "C-306", service: "Gym & Yoga", amount: "100,000 VND", status: "Paid", date: "26/03/2026" },
        { id: 27, resident: "Dang Hoang Phuc", apartment: "D-111", service: "BBQ Park", amount: "200,000 VND", status: "Unpaid", date: "26/03/2026" },
        { id: 28, resident: "Bui Thi An", apartment: "A-607", service: "Swimming Pool", amount: "350,000 VND", status: "Paid", date: "26/03/2026" },
        { id: 29, resident: "Tran Van Minh", apartment: "B-212", service: "Gym & Yoga", amount: "150,000 VND", status: "Paid", date: "27/03/2026" },
        { id: 30, resident: "Do Kim Huong", apartment: "C-1502", service: "BBQ Park", amount: "450,000 VND", status: "Paid", date: "27/03/2026" }
    ]);


    const getServiceIcon = (service) => {
        if (service.includes("Pool")) return <FaSwimmingPool />;
        if (service.includes("Gym")) return <FaDumbbell />;
        if (service.includes("BBQ")) return <FaFire />;
        return <FaCalendarCheck />;
    };

    const handleStatusUpdate = (id, newStatus) => {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        // [NOTE CHO BACKEND]
        // Gọi API: axios.put(`/api/bookings/${id}`, { status: newStatus })
    };

    // --- FILTER LOGIC ---
    const filteredBookings = bookingFilter === 'All'
        ? bookings
        : bookings.filter(b => b.service === bookingFilter);

    const filteredFees = feeFilter === 'All'
        ? serviceFees
        : serviceFees.filter(f => f.service === feeFilter); return (
            <main className="staff-content-area">
                {/* --- BOOKING MANAGEMENT --- */}
                {activeTab === 'bookings' && (
                    <div className="staff-tab-content">
                        <div className="staff-form-container" style={{ borderLeft: '5px solid #c89b3c' }}>
                            <h3><FaCalendarCheck /> Amenity Booking Management</h3>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                                Review and manage resident requests for building facilities.
                            </p>

                            <div className="staff-sub-nav">
                                {['All', 'Swimming Pool', 'Gym & Yoga', 'BBQ Park'].map(cat => (
                                    <div
                                        key={cat}
                                        className={`sub-nav-item ${bookingFilter === cat ? 'active' : ''}`}
                                        onClick={() => setBookingFilter(cat)}
                                    >
                                        {cat === 'All' ? 'All Services' : <>{getServiceIcon(cat)} {cat}</>}
                                    </div>
                                ))}
                            </div>

                            {/* [NOTE CHO BACKEND ]
                            1. Khi bấm Approve/Deny, gửi request PUT/PATCH lên backend.
                            2. Backend cần cập nhật database và có thể gửi thông báo (Push Notification/Email) cho cư dân.
                            3. Reload lại danh sách sau khi update thành công.
                        */}

                            <div className="staff-table-scroll">
                                <table className="admin-custom-table bordered">
                                    <thead>
                                        <tr>
                                            <th>Resident</th>
                                            <th>Service</th>
                                            <th>Date</th>
                                            <th>Time Slot</th>
                                            <th style={{ textAlign: 'center' }}>Status</th>
                                            <th style={{ textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBookings.map(b => (
                                            <tr key={b.id}>
                                                <td><strong>{b.resident}</strong></td>
                                                <td>
                                                    <div className="service-row-item">
                                                        {getServiceIcon(b.service)} {b.service}
                                                    </div>
                                                </td>
                                                <td>{b.date}</td>
                                                <td>{b.time}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span className={`status-badge ${b.status.toLowerCase()}`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    {b.status === 'Pending' && (
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                            <button
                                                                className="action-btn-circle approve"
                                                                title="Approve"
                                                                onClick={() => handleStatusUpdate(b.id, 'Approved')}
                                                            >
                                                                <FaCheck />
                                                            </button>
                                                            <button
                                                                className="action-btn-circle deny"
                                                                title="Deny"
                                                                onClick={() => handleStatusUpdate(b.id, 'Denied')}
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </div>
                                                    )}
                                                    {b.status !== 'Pending' && <span className="action-processed-text">Processed</span>}
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredBookings.length === 0 && (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                                                    <FaInfoCircle style={{ marginRight: '10px' }} />
                                                    No bookings found for {bookingFilter}.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SERVICE FEE STATISTICS --- */}
                {activeTab === 'fees' && (
                    <div className="staff-tab-content">
                        <div className="staff-form-container" style={{ borderLeft: '5px solid #c89b3c' }}>
                            <h3><FaCreditCard /> Service Fee Statistics</h3>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                                Track facility usage fees and payment history for residents.
                            </p>

                            <div className="staff-sub-nav">
                                {['All', 'Swimming Pool', 'Gym & Yoga', 'BBQ Park'].map(cat => (
                                    <div
                                        key={cat}
                                        className={`sub-nav-item ${feeFilter === cat ? 'active' : ''}`}
                                        onClick={() => setFeeFilter(cat)}
                                    >
                                        {cat === 'All' ? 'All Services' : <>{getServiceIcon(cat)} {cat}</>}
                                    </div>
                                ))}
                            </div>

                            {/* [NOTE CHO BACKEND]
                            1. Fetch dữ liệu phí dịch vụ: GET /api/service/fees
                            2. Khi tích hợp Payment (Momo/ZaloPay/Stripe), trạng thái status sẽ tự động cập nhật từ 'Unpaid' -> 'Paid'
                            3. Backend cần lưu vết transaction_id và thời gian thanh toán thực tế.
                        */}

                            <div className="staff-table-scroll">
                                <table className="admin-custom-table bordered">
                                    <thead>
                                        <tr>
                                            <th>Resident</th>
                                            <th>Apartment</th>
                                            <th>Service Used</th>
                                            <th>Amount</th>
                                            <th>Usage Date</th>
                                            <th style={{ textAlign: 'center' }}>Payment Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredFees.map(fee => (
                                            <tr key={fee.id}>
                                                <td><strong>{fee.resident}</strong></td>
                                                <td>{fee.apartment}</td>
                                                <td>
                                                    <div className="service-row-item">
                                                        {getServiceIcon(fee.service)} {fee.service}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: '800', color: '#0f172a', fontSize: '15px' }}>{fee.amount}</td>
                                                <td>{fee.date}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span className={`status-badge ${fee.status.toLowerCase()}`}>
                                                        {fee.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredFees.length === 0 && (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                                                    <FaInfoCircle style={{ marginRight: '10px' }} />
                                                    No fee records found for {feeFilter}.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{
                                marginTop: '30px', padding: '20px', background: '#f8fafc',
                                borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '15px', alignItems: 'center'
                            }}>
                                <div style={{ background: '#3b82f6', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <FaInfoCircle style={{ margin: '0 auto', fontSize: '1.2rem' }} />
                                </div>
                                <span style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                                    <strong>Developer Note:</strong> This statistics dashboard currently uses mock data. Upon backend integration, this view will provide real-time financial analytics synchronized with the central payment processing unit.
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        );
};

export default StaffServiceMainContent;
