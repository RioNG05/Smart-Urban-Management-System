import React, { useState } from "react";
// Nhớ import file CSS đã sửa ở trên
import "../../styles/admin.css";

const AdminRoleManager = () => {
    // Dữ liệu mẫu (sẽ thay bằng API sau)
    const [roles, setRoles] = useState([
        { id: 1, name: "ADMIN", permissions: ["READ", "CREATE", "UPDATE", "DELETE"] },
        { id: 2, name: "USER", permissions: ["READ"] },
        { id: 3, name: "MANAGER", permissions: ["READ", "CREATE", "UPDATE"] }
    ]);

    const [newRoleName, setNewRoleName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [error, setError] = useState("");

    // Các quyền hạn chuẩn bằng tiếng Anh
    const permissionOptions = ["READ", "CREATE", "UPDATE", "DELETE"];

    // Logic: Tạo Role mới (Chống trùng tên)
    const handleCreateRole = () => {
        // 1. Kiểm tra trùng tên (Báo lỗi bằng tiếng Anh)
        const isExist = roles.some(role => role.name.toUpperCase() === newRoleName.toUpperCase());
        if (isExist) {
            setError("This Role name already exists, please choose another!");
            return;
        }

        if (!newRoleName) return; // Nếu chưa nhập tên thì không làm gì

        // 2. Tạo đối tượng Role mới
        const newRole = {
            id: Date.now(),
            name: newRoleName.toUpperCase(),
            permissions: selectedPermissions,
        };

        // 3. Cập nhật state (Hiển thị ngay trên giao diện)
        setRoles([...roles, newRole]);
        setNewRoleName(""); // Xóa form
        setSelectedPermissions([]);
        setError(""); // Xóa lỗi
    };

    const togglePermission = (perm) => {
        setSelectedPermissions(prev =>
            prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
        );
    };

    return (
        // Class .role-manager-container
        <div className="role-manager-container">

            {/* SECTION TẠO ROLE - CÓ HÌNH NỀN CHÌM */}
            {/* Bạn có thể thay đổi link ảnh nhà cửa ở style inline này */}
            <section className="create-role-section" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=1000')" }}>
                <div className="create-role-content">
                    {/* Tiêu đề tiếng Anh nổi bật */}
                    <h3>System Role Configuration (RBAC)</h3>

                    <div className="role-input-group">
                        <label>Role Name:</label>
                        <input
                            type="text"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            placeholder="E.g., MANAGER, EDITOR, STAFF"
                            className={`role-name-input ${error ? "input-error" : ""}`}
                        />
                        {error && <p style={{ color: '#feb2b2', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
                    </div>

                    <div className="permission-checkbox-list">
                        <label>Assign Permissions:</label>
                        <div className="checkbox-group">
                            {permissionOptions.map(perm => (
                                <button
                                    key={perm}
                                    type="button"
                                
                                    className={`btn-perm ${selectedPermissions.includes(perm) ? "active" : ""}`}
                                    onClick={() => togglePermission(perm)}
                                >
                                    {perm}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Nút submit chuyên nghiệp (Hết Default) */}
                    <button className="btn-submit-role" onClick={handleCreateRole}>
                        Create New Role
                    </button>
                </div>
            </section>

            {/* BẢNG DANH SÁCH ROLE */}
            <section className="role-list-section">
                <h4>Role & Permissions Matrix</h4>
                <table className="admin-data-table">
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Permissions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(role => (
                            <tr key={role.id}>
                                {/* Tên Role in đậm */}
                                <td><strong>{role.name}</strong></td>
                                <td>
                                    {/* Hiển thị Permissions bằng Badges màu sắc */}
                                    {role.permissions.map(p => (
                                        <span key={p} className={`badge badge-${p.toLowerCase()}`}>{p}</span>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

        </div>
    );
};

export default AdminRoleManager;