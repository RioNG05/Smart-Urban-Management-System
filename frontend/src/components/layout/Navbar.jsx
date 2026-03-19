import { useState, useCallback, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useScrollEffect from "../../hooks/useScrollEffect";
import { useAuth } from "../../components/sections/auth/AuthContext";
import logoImg from "../../assets/logo.jpg";

export default function Navbar({ solid = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const menuRef = useRef(null);

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
          <span className="nav-logoText">VINAHOUSE</span>
        </div>

        <ul className="nav-links">
          <li onClick={() => handleNavigation("/")}>Home</li>
          <li onClick={() => handleNavigation("/about")}>About</li>
          <li onClick={() => handleNavigation("/market")}>Projects</li>
          <li onClick={() => handleNavigation("/services")}>Services</li>
          <li onClick={() => handleNavigation("/news")}>News</li>
          <li onClick={() => handleNavigation("/contact")}>Contact</li>
        </ul>

        <div className="nav-actions">
          <div className="user-menu" ref={menuRef}>
            <FaUserCircle
              className="user-icon"
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

                    {role === "RESIDENT" && (
                      <>
                        <div
                          className="dropdown-item"
                          onClick={() => navigate("/dashboard")}
                        >
                          Dashboard
                        </div>
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
