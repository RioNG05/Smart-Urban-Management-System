import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- CÁC TRANG USER (Folder pages) ---
import MarketPage from "../pages/MarketPage";
import AuthPage from "../pages/Authpage";
import Product from "../pages/ProductDetailPage";
import NewsPage from "../pages/NewsPage";
import Home from "../pages/Home";
import AboutPage from "../pages/AboutPage";
import NewsDetailPage from "../pages/NewsDetailPage";
import Unauthorized from "../pages/Unauthorized";
import Profile from "../pages/ProfilePage";
import ServicePage from "../pages/ServicePage";
import PrivateRoute from "./PrivateRoute"; 

// --- IMPORT ADMIN (Đường dẫn đã đưa ra ngoài pages) ---
import { AdminLayout, AdminDashboard } from "../admin/AdminCore";
import { 
  AdminRoleManager, 
  AdminLockResident, 
  AdminCreateContract, 
  AdminPropertyManager 
} from "../admin/AdminManagement";
import AdminReports from "../admin/AdminReports";
import AdminAccountLock from "../admin/AdminAccountLock";

// --- IMPORT STAFF (Đường dẫn đã đưa ra ngoài pages) ---
import StaffApartment from "../staff/StaffApartment";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- ROUTES NGƯỜI DÙNG --- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />

        {/* CÁC TRANG CÓ BẢO MẬT */}
        <Route path="/market" element={<PrivateRoute><MarketPage /></PrivateRoute>} />
        <Route path="/product" element={<PrivateRoute><Product /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* --- HỆ THỐNG ADMIN --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="roles" element={<AdminRoleManager />} />
          <Route path="lock-resident" element={<AdminLockResident />} />
          
          {/* Các tính năng mở rộng của Hùng */}
          <Route path="contracts/create" element={<AdminCreateContract />} />
          <Route path="contracts/view" element={<AdminPropertyManager />} />
          
          <Route path="reports/revenue" element={<AdminReports />} />
          <Route path="reports/residents" element={<AdminReports />} />
          <Route path="reports/payments" element={<AdminReports />} />
          <Route path="reports/services" element={<AdminReports />} />
          <Route path="account-lock" element={<AdminAccountLock title="General Accounts" />} />
        </Route>

        {/* --- HỆ THỐNG STAFF --- */}
        <Route path="/staff">
          <Route path="apartment" element={<StaffApartment />} />
          <Route path="service" element={<div style={{ padding: '50px' }}>Staff Service - Coming Soon</div>} />
          <Route path="security" element={<div style={{ padding: '50px' }}>Staff Security - Coming Soon</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}