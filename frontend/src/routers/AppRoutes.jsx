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
import AdminRouteGuard from "../admin/AdminRouteGuard";
import { ADMIN_PORTAL_ROLES } from "../admin/adminAccess";
import {
  PermissionManager,
  ResidentAccount,
  ContractManagement,
  ApartmentLayout,
  ApartmentTypeManager,
  BookingManager,
  ServiceManager,
  NewsManager,
  ServiceFeeStats,
  VisitorManager,
  ComplaintManager,
  AccountManager,
  UtilitiesInvoiceManager,
  StayHistoryManager
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
            <PrivateRoute roles={ADMIN_PORTAL_ROLES}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminRouteGuard section="dashboard"><Dashboard /></AdminRouteGuard>} />
          <Route path="roles" element={<AdminRouteGuard section="roles"><PermissionManager /></AdminRouteGuard>} />
          <Route path="resident-account" element={<AdminRouteGuard section="residentAccount"><ResidentAccount /></AdminRouteGuard>} />
          <Route path="stay-history" element={<AdminRouteGuard section="stayHistory"><StayHistoryManager /></AdminRouteGuard>} />
          <Route path="accounts" element={<AdminRouteGuard section="accounts"><AccountManager /></AdminRouteGuard>} />
          <Route path="contracts" element={<AdminRouteGuard section="contracts"><ContractManagement /></AdminRouteGuard>} />
          <Route path="apartment-layout" element={<AdminRouteGuard section="apartmentLayout"><ApartmentLayout /></AdminRouteGuard>} />
          <Route path="apartment-types" element={<AdminRouteGuard section="apartmentTypes"><ApartmentTypeManager /></AdminRouteGuard>} />
          <Route path="utilities-invoices" element={<AdminRouteGuard section="utilitiesInvoices"><UtilitiesInvoiceManager /></AdminRouteGuard>} />

          {/* Service & Security routes */}
          <Route path="services" element={<AdminRouteGuard section="services"><ServiceManager /></AdminRouteGuard>} />
          <Route path="news" element={<AdminRouteGuard section="news"><NewsManager /></AdminRouteGuard>} />
          <Route path="bookings" element={<AdminRouteGuard section="bookings"><BookingManager /></AdminRouteGuard>} />
          <Route path="service-fees" element={<AdminRouteGuard section="serviceFees"><ServiceFeeStats /></AdminRouteGuard>} />
          <Route path="complaints" element={<AdminRouteGuard section="complaints"><ComplaintManager /></AdminRouteGuard>} />
          <Route path="visitors" element={<AdminRouteGuard section="visitors"><VisitorManager /></AdminRouteGuard>} />
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
