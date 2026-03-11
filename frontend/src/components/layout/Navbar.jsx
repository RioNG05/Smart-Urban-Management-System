import { useState, useCallback, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useScrollEffect from "../../hooks/useScrollEffect";
import { useAuth } from "../../components/sections/auth/AuthContext";
import logoImg from "../../assets/logo.jpg"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef();

  // lấy user từ AuthContext
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useScrollEffect(handleScroll);

  // click ngoài dropdown -> đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setOpenMenu(false);

    setTimeout(() => {
      window.location.href = "/";
    }, 200);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        {/* LOGO */}
        <div className="nav-logo" onClick={() => navigate("/")}>
          <img src={logoImg} alt="VINAHOUSES Logo" className="nav-logoImg"/>
          <span className="nav-logoText">VINAHOUSES</span>
        </div>

        {/* MENU */}
        <ul className="nav-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/market")}>Projects</li>
          <li onClick={() => navigate("/about")}>About</li>
          <li onClick={() => navigate("/news")}>News</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
        </ul>

        {/* ACTION */}
        <div className="nav-actions">
          {/* USER */}
          <div className="user-menu" ref={menuRef}>
            <FaUserCircle
              className="user-icon"
              onClick={() => setOpenMenu(!openMenu)}
            />

            {openMenu && (
              <div className="dropdown">
                {isLoggedIn ? (
                  <>
                    <div
                      className="dropdown-item"
                      onClick={() => navigate("/profile")}
                    >
                      {user.username || "Profile"}
                    </div>

                    <div className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="dropdown-item"
                      onClick={() => navigate("/auth")}
                    >
                      Login
                    </div>

                    <div
                      className="dropdown-item"
                      onClick={() => navigate("/auth")}
                    >
                      Register
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button className="nav-btn" onClick={() => navigate("/projects")}>
            Explore
          </button>
        </div>
      </div>
    </nav>
  );
}
