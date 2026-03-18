import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- CÁC TRANG USER (GIỮ NGUYÊN) ---
import MarketPage from "../pages/MarketPage";
import AuthPage from "../pages/Authpage";
import Product from "../pages/ProductDetailPage";
import NewsPage from "../pages/NewsPage";
import Home from "../pages/Home";
import NewsDetailPage from "../pages/NewsDetailPage";
import Unauthorized from "../pages/Unauthorized";

// --- IMPORT ADMIN (GIỮ 100% CODE GỐC) ---
import { AdminLayout, AdminDashboard } from "../admin/AdminCore";
import {
  AdminRoleManager,
  AdminLockResident,
  AdminCreateContract,
  AdminPropertyManager
} from "../admin/AdminManagement";
import AdminReports from "../admin/AdminReports";
import AdminAccountLock from "../admin/AdminAccountLock";

// --- IMPORT STAFF (PHẦN MỚI TÁCH RIÊNG) ---
import StaffApartment from "../staff/StaffApartment";

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

        {/* --- HỆ THỐNG ADMIN (GIỮ NGUYÊN) --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="roles" element={<AdminRoleManager />} />
          <Route path="lock-resident" element={<AdminLockResident />} />
          <Route path="contracts/create" element={<AdminCreateContract />} />
          <Route path="contracts/view" element={<AdminPropertyManager />} />
          <Route path="reports/revenue" element={<AdminReports />} />
          <Route path="reports/residents" element={<AdminReports />} />
          <Route path="reports/payments" element={<AdminReports />} />
          <Route path="reports/services" element={<AdminReports />} />
          <Route path="account-lock" element={<AdminAccountLock title="General Accounts" />} />
        </Route>

        {/* --- HỆ THỐNG STAFF (MÀY GÕ /staff/apartment ĐỂ CHẠY) --- */}
        <Route path="/staff">
          <Route path="apartment" element={<StaffApartment />} />
          {/* Các route service và security mày làm sau thì vứt vào đây */}
          <Route path="service" element={<div style={{ padding: '50px' }}>Staff Service - Coming Soon</div>} />
          <Route path="security" element={<div style={{ padding: '50px' }}>Staff Security - Coming Soon</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}