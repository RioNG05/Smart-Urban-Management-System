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
import { AdminLayout, Dashboard } from "../admin/AdminCore";
import {
  PermissionManager,
  ResidentAccount,
  CreateContract,
  ViewContracts,
  ApartmentLayout,
  ApartmentTypeManager,
  BookingManager,
  ServiceFeeStats,
  VisitorManager,
  ComplaintManager,
  AccountManager
} from "../admin/AdminManagement";

import StaffApartment from "../staff/StaffApartment";
import StaffSecurity from "../staff/StaffSecurity";
import StaffService from "../staff/StaffService";

function AppRoutes() {
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
        {/* <Route path="/booking" element={<BookingPage />} /> */}
        <Route path="/market" element={<MarketPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/product/:id" element={<Product />} />

        {/* SECURE PAGES */}
        <Route
          path="/market"
          element={
            <PrivateRoute roles={["resident", "staff", "manager"]}>
              <MarketPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PrivateRoute roles={["resident", "staff", "manager"]}>
              <Product />
            </PrivateRoute>
          }
        />
        <Route
          path="/services"
          element={
            <PrivateRoute roles={["resident", "staff", "manager"]}>
              <ServicePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <PrivateRoute roles={["resident", "staff", "manager"]}>
              <BookingPage />
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
        <Route path="/unauthorize" element={<Unauthorized />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* --- ADMIN SYSTEM --- */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["manager"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="roles" element={<PermissionManager />} />
          <Route path="resident-account" element={<ResidentAccount />} />
          <Route path="accounts" element={<AccountManager />} />
          <Route path="contracts/create" element={<CreateContract />} />
          <Route path="contracts/view" element={<ViewContracts />} />
          <Route path="apartment-layout" element={<ApartmentLayout />} />
          <Route path="apartment-types" element={<ApartmentTypeManager />} />

          {/* Service & Security routes */}
          <Route path="bookings" element={<BookingManager />} />
          <Route path="service-fees" element={<ServiceFeeStats />} />
          <Route path="complaints" element={<ComplaintManager />} />
          <Route path="visitors" element={<VisitorManager />} />
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

export default AppRoutes;
