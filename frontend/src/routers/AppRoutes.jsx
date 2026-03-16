import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AdminLayout, AdminDashboard } from "../pages/admin/AdminCore";
import { AdminRoleManager, AdminLockResident } from "../pages/admin/AdminManagement";
import AdminReports from "../pages/admin/AdminReports";
import AdminAccountLock from "../pages/admin/AdminAccountLock";

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

        <Route
          path="/market"
          element={
            <PrivateRoute>
              <MarketPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/product"
          element={
            <PrivateRoute>
              <Product />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="roles" element={<AdminRoleManager />} />
          <Route path="lock-resident" element={<AdminLockResident />} />
          <Route path="reports/revenue" element={<AdminReports />} />
          <Route path="reports/residents" element={<AdminReports />} />
          <Route path="reports/payments" element={<AdminReports />} />
          <Route path="reports/services" element={<AdminReports />} />
          <Route path="account-lock" element={<AdminAccountLock title="General Accounts" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
