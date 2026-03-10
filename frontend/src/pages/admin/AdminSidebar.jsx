import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserShield, FaBuilding, FaNewspaper, FaBars } from 'react-icons/fa';

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <FaBars className="menu-toggle-icon" onClick={() => setIsOpen(!isOpen)} />
                {isOpen && <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>VinaHouse CMS</span>}
            </div>
            <nav className="sidebar-nav">
                <Link to="/admin"><FaHome /> {isOpen && "Bảng điều khiển"}</Link>
                <Link to="/admin/roles"><FaUserShield /> {isOpen && "Quản lý Quyền"}</Link>
                <Link to="/market"><FaBuilding /> {isOpen && "Sửa Bất Động Sản"}</Link>
                <Link to="/news"><FaNewspaper /> {isOpen && "Quản lý Tin tức"}</Link>
            </nav>
        </div>
    );
};
export default AdminSidebar;