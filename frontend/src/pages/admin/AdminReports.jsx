import React from 'react';

const AdminReports = () => {
    const reportCategories = [
        { title: "Monthly Revenue", color: "#3182ce", icon: "💰" },
        { title: "Resident Count", color: "#38a169", icon: "👥" },
        { title: "Payment Rate", color: "#dd6b20", icon: "💳" },
        { title: "Service Usage", color: "#805ad5", icon: "🛠️" }
    ];

    return (
        <div className="admin-reports-container">
            <h2 className="admin-page-title">Analytics & Strategic Reports</h2>
            <div className="reports-grid">
                {reportCategories.map((item) => (
                    <div key={item.title} className="report-stat-card" style={{ borderTop: `4px solid ${item.color}` }}>
                        <div className="card-info">
                            <span className="card-label">{item.title}</span>
                            <h3 className="card-value">--</h3> 
                            <span className="card-trend">Waiting for data...</span>
                        </div>
                        <div className="card-icon-bg">{item.icon}</div>
                    </div>
                ))}
            </div>
            <div className="chart-section-mockup">
                <div className="mockup-header">
                    <h3>Data Visualization Chart</h3>
                </div>
                <div className="mockup-body">
                    <div className="skeleton-chart">
                        <p>Chart Area (Ready for Integration)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AdminReports;