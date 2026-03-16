import React from "react";

function AuthLayout({ children }) {
  return (
    <div className="auth-wrapper">
      <div className="auth-overlay"></div>
      <div className="auth-container">{children}</div>
    </div>
  );
}

export default AuthLayout;
