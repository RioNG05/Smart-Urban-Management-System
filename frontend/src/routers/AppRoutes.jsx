import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- CÁC TRANG USER (GIỮ NGUYÊN) ---
import MarketPage from "../pages/MarketPage";
import AuthPage from "../pages/Authpage";
import Product from "../pages/ProductDetailPage";
import NewsPage from "../pages/NewsPage";
import Home from "../pages/Home";
import NewsDetailPage from "../pages/NewsDetailPage";
import Unauthorized from "../pages/Unauthorized";

// --- IMPORT TỪ 4 FILE GỘP (GIỮ 100% CODE GỐC) ---
// 1. Gộp Layout, Sidebar, Dashboard (Sử dụng Destructuring {})
import { AdminLayout, AdminDashboard } from "../pages/admin/AdminCore";

// 2. Gộp Role Manager và Lock Resident (Sử dụng Destructuring {})
import { AdminRoleManager, AdminLockResident } from "../pages/admin/AdminManagement";

// 3. File Báo cáo (Default Import)
import AdminReports from "../pages/admin/AdminReports";

// 4. File Khóa tài khoản lẻ (Default Import)
import AdminAccountLock from "../pages/admin/AdminAccountLock";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- ROUTES NGƯỜI DÙNG --- */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/market" element={<MarketPage />} />
        <Route path="/product" element={<Product />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />

        {/* --- HỆ THỐNG ADMIN (GHÉP CHUẨN TỪ CÁC FILE GỘP) --- */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Trang chủ quản trị (Ảnh nhà cửa, Overview) */}
          <Route index element={<AdminDashboard />} />
          
          {/* Quản lý quyền (Bảng Permissions Matrix) */}
          <Route path="roles" element={<AdminRoleManager />} />
          
          {/* Quản lý cư dân (Banner tím, Form nhập) */}
          <Route path="lock-resident" element={<AdminLockResident />} />
          
          {/* Các trang báo cáo và thống kê (Sử dụng chung AdminReports) */}
          <Route path="reports/revenue" element={<AdminReports />} />
          <Route path="reports/residents" element={<AdminReports />} />
          <Route path="reports/payments" element={<AdminReports />} />
          <Route path="reports/services" element={<AdminReports />} />

          {/* Trang khóa tài khoản chung */}
          <Route path="account-lock" element={<AdminAccountLock title="General Accounts" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}