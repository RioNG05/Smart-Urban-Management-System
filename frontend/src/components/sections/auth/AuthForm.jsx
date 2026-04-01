import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import api from "../../../services/api";

function AuthForm() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // SHOW PASSWORD

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/token", {
        username: loginData.username,
        password: loginData.password,
      });

      const token = res.data.result.token;

      const userRes = await api.get("/auth/accounts/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const user = userRes.data.result;

      // truyền token + user
      login(token, user);

      toast.success("Login success!");

      navigate("/");
    } catch (err) {
      console.log(err);

      if (err.response) {
        toast.error(err.response.data.message || "Login failed");
      } else {
        toast.error("Không thể kết nối server");
      }
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
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
          />
          <div className="position-relative">
            <input
              className=""
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            <span className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ cursor: "pointer" }} onClick={handleShowPassword}>
              {showPassword ? (
                <LuEyeOff size={20} />
              ) : (
                <LuEye size={20} />
              )}
            </span>
          </div>

          <div className="forgot-row">
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="primary-btn">
            Sign In
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <button
            type="button"
            className="google-btn"
            onClick={() => {
              window.location.href =
                "http://localhost:8080/oauth2/authorization/google";
            }}
          >
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
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
            <span className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ cursor: "pointer" }} onClick={handleShowPassword}>
              {showPassword ? (
                <LuEyeOff size={20} />
              ) : (
                <LuEye size={20} />
              )}
            </span>
          </div>
          <div className="position-relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  confirmPassword: e.target.value,
                })
              }
            />
            <span className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ cursor: "pointer" }} onClick={handleShowConfirmPassword}>
              {showConfirmPassword ? (
                <LuEyeOff size={20} />
              ) : (
                <LuEye size={20} />
              )}
            </span>
          </div>

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
