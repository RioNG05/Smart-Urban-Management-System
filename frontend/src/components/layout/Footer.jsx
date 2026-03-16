import { FaFacebookF, FaInstagram, FaArrowUp } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* BRAND */}
        <div className="footer-col brand">
          <h2 className="footer-logo">VINAHOUSE</h2>

          <p>
            We provide premium living spaces designed for modern lifestyles,
            combining luxury, convenience and community.
          </p>

          <div className="socials">
            <div className="social-icon">
              <FaFacebookF />
            </div>

            <div className="social-icon">
              <FaInstagram />
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h4>Quick Links</h4>

          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/market")}>Apartments</span>
          <span onClick={() => navigate("/services")}>Services</span>
          <span onClick={() => navigate("/news")}>News</span>
        </div>

        {/* SUPPORT */}
        <div className="footer-col">
          <h4>Support</h4>

          <span onClick={() => navigate("/faq")}>FAQ</span>
          <span onClick={() => navigate("/terms")}>Terms of Service</span>
          <span onClick={() => navigate("/privacy")}>Privacy Policy</span>
          <span onClick={() => navigate("/contact")}>Contact Support</span>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h4>Contact Us</h4>

          <p>
            <FiMapPin /> Vina City, Ha Noi, Viet Nam
          </p>

          <p>
            <FiPhone /> 0123 456 789
          </p>

          <p>
            <FiMail /> admin@citysmart.com
          </p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        © 2026 Smart Urban System. All rights reserved.
      </div>

      {/* SCROLL TOP BUTTON */}
      <button className="scroll-top" onClick={scrollTop}>
        <FaArrowUp />
      </button>
    </footer>
  );
}
