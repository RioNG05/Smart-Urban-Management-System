import { useNavigate } from "react-router-dom";

const SERVICE_HERO_IMAGE =
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80";

export default function ServiceHero() {
  const navigate = useNavigate();

  return (
    <section className="service-hero">
      <img
        className="service-hero-image"
        src={SERVICE_HERO_IMAGE}
        alt="Premium residential amenities and landscaped community space"
      />
      <div className="service-hero-overlay" />
      <div className="service-hero-content">
        <p className="service-hero-badge">Premium resident experience</p>
        <h1>Your City. One Touch Away.</h1>
        <p>
          Book a spa session, reserve the tennis court, or arrange childcare in seconds.
          Welcome to the world’s most intuitive urban service ecosystem.
        </p>
        <button className="service-hero-cta" onClick={() => navigate("/booking")}>
          Booking Now
        </button>
      </div>
    </section>
  );
}
