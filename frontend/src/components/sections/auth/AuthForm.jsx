import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import api from "../../../services/api";

function AuthForm() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.get("/account/auth");

      const users = res.data;

      const user = users.find(
        (u) => u.email === loginData.email && u.password === loginData.password,
      );

      if (user) {
        login({ user });

        toast.success(`Welcome back ${user.username}!`);

        navigate("/");
      } else {
        toast.error("Email hoặc password không đúng");
      }
    } catch (err) {
      toast.error("Không thể kết nối server");
    }
  };
  // REGISTER (demo)
  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.warning("Password không khớp");
      return;
    }

    try {
      const res = await api.post("/accounts", {
        email: registerData.email,
        username: registerData.name,
        password: registerData.password,
      });

      toast.success(res.data.message || "Account created successfully");

      setIsLogin(true);
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Register thất bại");
      }
    }
  };
  return (
    <div className={`auth-box ${isLogin ? "login-mode" : "register-mode"}`}>
      <div className="auth-toggle">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>

        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>

        <div className="auth-slider"></div>
      </div>

      <div className="auth-forms">
        {/* LOGIN */}
        <form className="form login-form" onSubmit={handleLogin}>
          <h2>Welcome Back</h2>

          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />

          <div className="forgot-row">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="primary-btn">
            Sign In
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <button type="button" className="google-btn">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
            />
            Sign in with Google
          </button>
        </form>

        {/* REGISTER */}
        <form className="form register-form" onSubmit={handleRegister}>
          <h2>Create Account</h2>

          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                confirmPassword: e.target.value,
              })
            }
          />

          <button type="submit" className="primary-btn">
            Sign Up
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <button type="button" className="google-btn">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
            />
            Sign up with Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
