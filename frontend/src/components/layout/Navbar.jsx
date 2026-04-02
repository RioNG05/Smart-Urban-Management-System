import { useState, useCallback, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import useScrollEffect from "../../hooks/useScrollEffect";
import { useAuth } from "../../components/sections/auth/AuthContext";
import logoImg from "../../assets/logo.jpg";

export default function Navbar({ solid = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const menuRef = useRef(null);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isBillingPage = location.pathname.startsWith("/billing");

  const getLinkStyle = (path) => {
    if (isActive(path)) return { color: "#c89b3c", fontWeight: "600" };
    if (isBillingPage) return { color: "#111" };
    return {};
  };

  const { token, user, role, logout, isAuthenticated } = useAuth();
  const displayRole = user?.role?.roleName || role;

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useScrollEffect(handleScroll);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingUser(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setOpenMenu(false);
    navigate("/");
  };

  return (
    <nav className={`navbar ${scrolled || solid ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        {/* LOGO */}
        <div className="nav-logo" onClick={() => handleNavigation("/")}>
          <img src={logoImg} alt="VINAHOUSES Logo" className="nav-logoImg" />
          <span className="nav-logoText" style={isBillingPage ? { color: "#111" } : {}}>VINAHOUSE</span>
        </div>

        <ul className="nav-links">
          {[
            { path: "/", label: "Home" },
            { path: "/about", label: "About" },
            { path: "/market", label: "Projects" },
            { path: "/services", label: "Services" },
            { path: "/news", label: "News" },
            { path: "/contact", label: "Contact" },
          ].map((item) => (
            <li
              key={item.path}
              className={isActive(item.path) ? "active-nav-link" : ""}
              onClick={() => handleNavigation(item.path)}
              style={getLinkStyle(item.path)}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <div className="user-menu" ref={menuRef}>
            <FaUserCircle
              className="user-icon"
              style={isBillingPage ? { color: "#c89b3c" } : {}}
              onClick={(e) => {
                e.stopPropagation();

                if (!isAuthenticated) {
                  navigate("/auth");
                } else {
                  setOpenMenu((prev) => !prev);
                }
              }}
            />

            {openMenu && isAuthenticated && (
              <div className="dropdown fade-slide">
                {loadingUser ? (
                  <div className="dropdown-skeleton">
                    <div className="skeleton-item"></div>
                    <div className="skeleton-item"></div>
                  </div>
                ) : (
                  <>
                    <div
                      className="dropdown-item username"
                      onClick={() => navigate("/profile")}
                    >
                      <span>{user?.username}</span>

                      {role && (
                        <span className={`role-badge ${role}`}>
                          {displayRole}
                        </span>
                      )}
                    </div>

                    {role === "MANAGER" && (
                      <div
                        className="dropdown-item"
                        onClick={() => navigate("/admin")}
                      >
                        Dashboard
                      </div>
                    )}

                    {role === "RESIDENT" && (
                      <>
                        <div
                          className="dropdown-item"
                          onClick={() => navigate("/billing")}
                        >
                          My Home
                        </div>
                      </>
                    )}

                    <div
                      className="dropdown-item"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </div>

                    <div
                      className="dropdown-item logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button className="nav-btn" onClick={() => handleNavigation("/projects")}>
            Explore
          </button>
        </div>
      </div>
    </nav>
  );
}
