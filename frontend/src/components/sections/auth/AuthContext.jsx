import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../../../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const normalizedRole = user?.role?.roleName?.toUpperCase() || null;

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        clearAuth();
      }
    } catch {
      clearAuth();
    }
  }, [token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (!tokenFromUrl) return;

    const bootstrapGoogleLogin = async () => {
      try {
        localStorage.setItem("token", tokenFromUrl);
        setToken(tokenFromUrl);

        const userRes = await api.get("/auth/accounts/me", {
          headers: {
            Authorization: `Bearer ${tokenFromUrl}`,
          },
        });

        const userData = userRes.data.result;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } catch {
        clearAuth();
      } finally {
        params.delete("token");
        const nextQuery = params.toString();
        const nextUrl = `${window.location.pathname}${
          nextQuery ? `?${nextQuery}` : ""
        }${window.location.hash}`;
        window.history.replaceState({}, document.title, nextUrl);
      }
    };

    bootstrapGoogleLogin();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    clearAuth();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: normalizedRole,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
