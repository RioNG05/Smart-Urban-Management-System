import React from 'react';

const AdminAccountLock = ({ title }) => {
    return (
        <div className="admin-reports-container">
            <h2 className="admin-page-title">Management: {title}</h2>
            <div className="admin-table-wrapper">
                <table className="admin-custom-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email / Username</th>
                            <th>Role / Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#001</td>
                            <td>Trần Phu Thanh Hung</td>
                            <td>hungtpth.admin</td>
                            <td>System Admin</td>
                            <td><span className="status-badge active">Active</span></td>
                            <td>
                                <button className="btn-lock">Lock Account</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminAccountLock;