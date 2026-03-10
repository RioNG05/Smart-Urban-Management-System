import { BrowserRouter, Routes, Route } from "react-router-dom";

import MarketPage from "../pages/MarketPage";
import AuthPage from "../pages/Authpage";
import Product from "../pages/ProductDetailPage";
import NewsPage from "../pages/NewsPage";
import Home from "../pages/Home";
import NewsDetailPage from "../pages/NewsDetailPage";
import Unauthorized from "../pages/Unauthorized";

// Các thành phần bảo mật và giao diện Admin
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminRoleManager from "../pages/admin/AdminRoleManager";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* --- PROTECTED CLIENT ROUTES (Cần Login) --- */}
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
          path="/news"
          element={
            <PrivateRoute>
              <NewsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/news/:id"
          element={
            <PrivateRoute>
              <NewsDetailPage />
            </PrivateRoute>
          }
        />

        {/* --- ADMIN ROUTES (Có Sidebar và cũng cần bảo mật) --- */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="roles" element={<AdminRoleManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}