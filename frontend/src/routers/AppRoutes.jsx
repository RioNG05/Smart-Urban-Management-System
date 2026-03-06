import { BrowserRouter, Routes, Route } from "react-router-dom";
import MarketPage from "../pages/MarketPage";
import AuthPage from "../pages/Authpage";
import Home from "../pages/Home";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/market" element={<MarketPage />} />
      </Routes>
    </BrowserRouter>
  );
}
