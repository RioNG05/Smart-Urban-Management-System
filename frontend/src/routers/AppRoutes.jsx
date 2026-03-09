import { BrowserRouter, Routes, Route } from "react-router-dom";

import MarketPage from "../pages/MarketPage";
import AuthPage from "../pages/Authpage";
import Product from "../pages/ProductDetailPage";
import NewsPage from "../pages/NewsPage";
import Home from "../pages/Home";
import NewsDetailPage from "../pages/NewsDetailPage";
import Unauthorized from "../pages/Unauthorized";

import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/auth" element={<AuthPage />} />

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

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}
