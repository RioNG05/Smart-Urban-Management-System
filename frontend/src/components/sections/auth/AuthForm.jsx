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
        toast.error("Login failed. Please check your credentials.");
      } else {
        toast.error("Cannot connect to server");
      }
    }
  };
  // REGISTER (demo)
  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/accounts", {
        email: registerData.email,
        username: registerData.name,
        password: registerData.password,
      });

      toast.success("Account created successfully");

      setIsLogin(true);
    } catch (err) {
      toast.error(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character. Password cannot contain spaces. Password must be at least 8 characters long."
      );
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
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3"
              style={{ cursor: "pointer" }}
              onClick={handleShowPassword}
            >
              {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
            </span>
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
            placeholder="Username"
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
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3"
              style={{ cursor: "pointer" }}
              onClick={handleShowPassword}
            >
              {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
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
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3"
              style={{ cursor: "pointer" }}
              onClick={handleShowConfirmPassword}
            >
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
