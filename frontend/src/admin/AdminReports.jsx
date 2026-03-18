import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Dữ liệu mẫu cho Dịch vụ (Vẽ lên biểu đồ)
const serviceData = [
  { name: 'Electricity', users: 450, revenue: 2400 },
  { name: 'Water', users: 320, revenue: 1398 },
  { name: 'Internet', users: 280, revenue: 9800 },
  { name: 'Gym/Pool', users: 150, revenue: 3908 },
  { name: 'Parking', users: 500, revenue: 4800 },
];

const AdminReports = () => {
    // 1. Giữ nguyên mảng Categories cũ của mày để lấy Icon và Color
    const reportCategories = [
        { title: "Monthly Revenue", color: "#3182ce", icon: "💰", value: "$25,400", trend: "+12.5% from last month" },
        { title: "Resident Count", color: "#38a169", icon: "👥", value: "1,250", trend: "Active residents" },
        { title: "Payment Rate", color: "#dd6b20", icon: "💳", value: "94.2%", trend: "-2.1% fluctuation" },
        { title: "Service Usage", color: "#805ad5", icon: "🛠️", value: "88%", trend: "Stable usage" }
    ];

    return (
        <div className="admin-reports-container">
            <h2 className="admin-page-title">Analytics & Strategic Reports</h2>
            
            {/* --- GIỮ NGUYÊN GRID VÀ CARD CŨ (ĐÃ THÊM SỐ THẬT) --- */}
            <div className="reports-grid">
                {reportCategories.map((item) => (
                    <div key={item.title} className="report-stat-card" style={{ borderTop: `4px solid ${item.color}` }}>
                        <div className="card-info">
                            <span className="card-label">{item.title}</span>
                            <h3 className="card-value">{item.value}</h3> 
                            <span className="card-trend">{item.trend}</span>
                        </div>
                        <div className="card-icon-bg">{item.icon}</div>
                    </div>
                ))}
            </div>

            {/* --- KHU VỰC BIỂU ĐỒ (THAY THẾ SKELETON) --- */}
            <div className="chart-section-mockup" style={{ marginTop: '30px' }}>
                <div className="mockup-header">
                    <h3>Service Usage & Revenue Distribution</h3>
                </div>
                <div className="mockup-body" style={{ height: '400px', padding: '20px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={serviceData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey="users" fill="#6366f1" radius={[5, 5, 0, 0]} name="Users" />
                            <Bar dataKey="revenue" fill="#38a169" radius={[5, 5, 0, 0]} name="Revenue ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* --- BẢNG QUẢN LÝ DỊCH VỤ CHI TIẾT --- */}
            <div className="resident-table-wrapper" style={{ marginTop: '30px' }}>
                <h4 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: '700' }}>Detailed Service Management</h4>
                <table className="admin-custom-table bordered">
                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Current Users</th>
                            <th>Avg. Revenue</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serviceData.map((s, index) => (
                            <tr key={index}>
                                <td><strong>{s.name}</strong></td>
                                <td>{s.users} Residents</td>
                                <td>${(s.revenue / s.users).toFixed(1)} / person</td>
                                <td><span className="status-badge active">Operating</span></td>
                                <td style={{ textAlign: 'center' }}>
                                    <button className="toolbar-add-btn" style={{ padding: '5px 15px', fontSize: '11px' }}>Config</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReports;