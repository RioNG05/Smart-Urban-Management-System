import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import "../../styles/admin.css";

const AdminLayout = () => {
    return (
        <div className="admin-page-wrapper">
            <AdminSidebar />
            <div className="admin-main-container">
                <div className="admin-topbar">
                    <span>Hệ thống Quản trị VinaHouse CMS</span>
                </div>
                <div className="admin-content-area">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
export default AdminLayout;