import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- USER PAGES (pages folder) ---
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
import ContactPage from "../pages/ContactPage";
import PrivateRoute from "./PrivateRoute";
import BillingPage from "../pages/BillingPage";
import BookingPage from "../pages/BookingPage";

// --- ADMIN SYSTEM ---
import { AdminLayout, AdminDashboard } from "../admin/AdminCore";
import {
  AdminRoleManager,
  AdminLockResident,
  AdminCreateContract,
  AdminPropertyManager,
} from "../admin/AdminManagement";
import AdminReports from "../admin/AdminReports";
import AdminAccountLock from "../admin/AdminAccountLock";

import StaffApartment from "../staff/StaffApartment";
import StaffSecurity from "../staff/StaffSecurity";
import StaffService from "../staff/StaffService";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- USER ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route
          path="/billing"
          element={
            <PrivateRoute roles={["resident"]}>
              <BillingPage />
            </PrivateRoute>
          }
        />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/product/:id" element={<Product />} />

        {/* SECURE PAGES */}
        <Route
          path="/market"
          element={
            <PrivateRoute roles={["resident", "staff", "admin"]}>
              <MarketPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PrivateRoute roles={["resident", "staff", "admin"]}>
              <Product />
            </PrivateRoute>
          }
        />
        <Route
          path="/services"
          element={
            <PrivateRoute roles={["resident", "staff", "admin"]}>
              <ServicePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute roles={["resident", "staff", "admin", "user"]}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* --- ADMIN SYSTEM --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="roles" element={<AdminRoleManager />} />
          <Route path="lock-resident" element={<AdminLockResident />} />
          <Route path="contracts/create" element={<AdminCreateContract />} />
          <Route path="contracts/view" element={<AdminPropertyManager />} />
          <Route path="reports/revenue" element={<AdminReports />} />
          <Route path="reports/residents" element={<AdminReports />} />
          <Route path="reports/payments" element={<AdminReports />} />
          <Route
            path="account-lock"
            element={<AdminAccountLock title="General Accounts" />}
          />
        </Route>

        {/* --- STAFF SYSTEM --- */}
        <Route path="/staff">
          <Route path="apartment" element={<StaffApartment />} />
          <Route path="service" element={<StaffService />} />
          <Route path="security" element={<StaffSecurity />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
