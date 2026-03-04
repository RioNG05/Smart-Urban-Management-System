import { useState, useCallback } from "react";
import useScrollEffect from "../../hooks/useScrollEffect";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useScrollEffect(handleScroll);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        <div className="logo">VINAHOUSES</div>

        <ul className="nav-links">
          <li>Home</li>

          <li>Projects</li>
          <li>About</li>
          <li>News</li>
          <li>Contact</li>
        </ul>

        <button className="nav-btn">Explore</button>
      </div>
    </nav>
  );
}
