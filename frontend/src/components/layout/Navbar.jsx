import { useState, useCallback, useRef, useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useScrollEffect from "../../hooks/useScrollEffect";
import { useAuth } from "../../components/sections/auth/AuthContext";
import {
  getNotificationsByUser,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationService";
import {
  canAccessAdminSection,
  getDefaultAdminPath,
} from "../../admin/adminAccess";
import logoImg from "../../assets/logo.jpg";

export default function Navbar({ solid = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const menuRef = useRef(null);
  const hasLoadedNotificationsRef = useRef(false);
  const notifiedIdsRef = useRef(new Set());

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
        setOpenNotifications(false);
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
    setOpenNotifications(false);
    navigate("/");
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      hasLoadedNotificationsRef.current = false;
      notifiedIdsRef.current = new Set();
      return;
    }

    let active = true;

    const loadNotifications = async ({ silent = false } = {}) => {
      if (!silent) {
        setLoadingNotifications(true);
      }

      try {
        const [notificationItems, unreadTotal] = await Promise.all([
          getNotificationsByUser(user.id),
          getUnreadNotificationCount(user.id),
        ]);

        if (!active) return;

        setNotifications(notificationItems);
        setUnreadCount(unreadTotal);

        if (hasLoadedNotificationsRef.current) {
          notificationItems
            .filter(
              (item) => !item.isRead && !notifiedIdsRef.current.has(item.id),
            )
            .slice(0, 3)
            .forEach((item) => {
              notifiedIdsRef.current.add(item.id);
              toast.info(item.title, { autoClose: 2200 });
            });
        } else {
          notificationItems.forEach((item) => {
            if (!item.isRead) {
              notifiedIdsRef.current.add(item.id);
            }
          });
          hasLoadedNotificationsRef.current = true;
        }
      } catch (error) {
        if (!silent) {
          console.error("Failed to load notifications", error);
        }
      } finally {
        if (active) {
          setLoadingNotifications(false);
        }
      }
    };

    loadNotifications();

    const intervalId = window.setInterval(() => {
      loadNotifications({ silent: true });
    }, 15000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated, user?.id]);

  const handleNotificationClick = async (notification) => {
    if (!notification?.id) return;

    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id ? { ...item, isRead: true } : item,
          ),
        );
        setUnreadCount((current) => Math.max(0, current - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    } finally {
      setOpenNotifications(false);
      if (notification.relatedUrl) {
        navigate(notification.relatedUrl);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id || unreadCount === 0) return;

    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true })),
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  const formatNotificationTime = (value) => {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      return "";
    }

    return value.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <nav className={`navbar ${scrolled || solid ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        {/* LOGO */}
        <div className="nav-logo" onClick={() => handleNavigation("/")}>
          <img src={logoImg} alt="VINAHOUSES Logo" className="nav-logoImg" />
          <span
            className="nav-logoText"
            style={isBillingPage ? { color: "#111" } : {}}
          >
            VINAHOUSE
          </span>
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
            {isAuthenticated && (
              <div className="notification-menu">
                <button
                  type="button"
                  className="notification-trigger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(false);
                    setOpenNotifications((prev) => !prev);
                  }}
                >
                  <FaBell className="notification-icon" />
                  {unreadCount > 0 && (
                    <span className="notification-badge">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {openNotifications && (
                  <div className="notification-dropdown fade-slide">
                    <div className="notification-dropdown__header">
                      <div>
                        <strong>Notifications</strong>
                        <span>{unreadCount} unread</span>
                      </div>
                      <button
                        type="button"
                        className="notification-link-btn"
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="notification-dropdown__list">
                      {loadingNotifications ? (
                        <div className="notification-empty">
                          Loading notifications...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="notification-empty">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 8).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className={`notification-item ${item.isRead ? "" : "is-unread"}`}
                            onClick={() => handleNotificationClick(item)}
                          >
                            <div className="notification-item__top">
                              <strong>{item.title}</strong>
                              {!item.isRead && (
                                <span className="notification-dot" />
                              )}
                            </div>
                            <p>{item.message}</p>
                            <span>
                              {formatNotificationTime(item.createdDate)}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <FaUserCircle
              className="user-icon"
              style={isBillingPage ? { color: "#c89b3c" } : {}}
              onClick={(e) => {
                e.stopPropagation();

                if (!isAuthenticated) {
                  navigate("/auth");
                } else {
                  setOpenNotifications(false);
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

                    {canAccessAdminSection(role, "dashboard") && (
                      <div
                        className="dropdown-item"
                        onClick={() => navigate(getDefaultAdminPath(role))}
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

          <button
            className="nav-btn"
            onClick={() => handleNavigation("/market")}
          >
            Explore
          </button>
        </div>
      </div>
    </nav>
  );
}
