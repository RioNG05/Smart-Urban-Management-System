import React from 'react';
// Nếu bạn dùng AdminLayout thì file này không cần import Sidebar nữa
// import AdminSidebar from './AdminSidebar'; 

const AdminDashboard = () => {
    return (
        <div className="dashboard-content">
            <header className="content-header" style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2.5rem', color: '#1a202c' }}>Tổng quan Hệ thống Quản trị</h2>
                <p style={{ fontSize: '1.2rem', color: '#718096' }}>Admin:</p>
            </header>

            {/* Class này phải khớp với .admin-visual-grid trong CSS */}
            <div className="admin-visual-grid">

                {/* CARD 1 - SỬA TRANG CHỦ */}
                {/* Class .house-card và style inline để lấy ảnh nền */}
                <div className="house-card" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000')" }}>
                    {/* Class .card-inner - Nơi chứa chữ nổi */}
                    <div className="card-inner">
                        <h3>Sửa đổi giao diện Trang Chủ</h3>
                        <p>Chỉnh sửa banner, các khu vực nổi bật và thông tin liên hệ.</p>
                        {/* Thẻ button này sẽ ăn theo style .card-inner button */}
                        <button onClick={() => window.location.href = '/'}>Đi đến trang Home</button>
                    </div>
                </div>

                {/* CARD 2 - SỬA SẢN PHẨM */}
                <div className="house-card" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000')" }}>
                    <div className="card-inner">
                        <h3>Quản lý Sàn Giao Dịch</h3>
                        <p>Cập nhật giá, hình ảnh và trạng thái các căn hộ VinaHouse.</p>
                        <button onClick={() => window.location.href = '/market'}>Chỉnh sửa Sản phẩm</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;