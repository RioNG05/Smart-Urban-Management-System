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
        <form className="form login-form" onSubmit={(e) => e.preventDefault()}>
          <h2>Welcome Back</h2>

          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />

          {/* forgot password */}
          <div className="forgot-row">
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="primary-btn">
            Sign In
          </button>

          {/* divider */}
          <div className="divider">
            <span>or continue with</span>
          </div>

          {/* google button */}
          <button type="button" className="google-btn">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
            />
            Sign in with Google
          </button>
        </form>

        {/* REGISTER */}
        <form
          className="form register-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <h2>Create Account</h2>

          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email" />

          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />

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
