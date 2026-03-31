import { useNavigate } from "react-router-dom";

export default function ServiceHero() {
  const navigate = useNavigate();

  return (
    <section className="service-hero">
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
