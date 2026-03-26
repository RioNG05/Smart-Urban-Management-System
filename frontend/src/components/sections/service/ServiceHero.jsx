import { useNavigate } from "react-router-dom";

export default function ServiceHero() {
  const navigate = useNavigate();

  return (
    <section className="service-hero">
      <div className="service-hero-content">
        <p className="service-hero-badge">Premium resident experience</p>
        <h1>Book standout services that make your urban lifestyle feel effortless.</h1>
        <p>
          Discover curated wellness, recreation, and family-friendly amenities designed to turn
          every day at your residence into a premium living experience.
        </p>
        <button className="service-hero-cta" onClick={() => navigate("/booking")}>
          Booking Now
        </button>
      </div>
    </section>
  );
}
