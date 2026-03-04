import React, { useState } from "react";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

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
        <form className="form login-form">
          <h2>Welcome Back</h2>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit" className="primary-btn">
            Sign In
          </button>
        </form>

        {/* REGISTER */}
        <form className="form register-form">
          <h2>Create Account</h2>
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit" className="primary-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
