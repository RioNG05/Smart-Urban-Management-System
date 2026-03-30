import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ServicesSection({ services = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (services.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % services.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [services]);

  useEffect(() => {
    if (activeIndex >= services.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, services.length]);

  if (!services.length) {
    return null;
  }

  const activeService = services[activeIndex];

  return (
    <section className="section home-services-section">
      <div className="home-section-heading">
        <span className="home-section-kicker">Resident Services</span>
        <h2>Service spotlight slider for the homepage</h2>
        <p>Using temporary fake data for now, ready to swap to backend services later.</p>
      </div>

      <div className="home-service-slider">
        <div className="home-service-slider__visual">
          <img src={activeService.image} alt={activeService.title} />
          <div className="home-service-slider__overlay">
            <span className="home-service-slider__badge">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <h3>{activeService.title}</h3>
          </div>
        </div>

        <div className="home-service-slider__panel">
          <p>{activeService.desc}</p>

          <div className="home-service-slider__controls">
            <button
              type="button"
              className="home-service-slider__button"
              onClick={() =>
                setActiveIndex(
                  (activeIndex - 1 + services.length) % services.length,
                )
              }
            >
              Prev
            </button>

            <button
              type="button"
              className="home-service-slider__button"
              onClick={() => setActiveIndex((activeIndex + 1) % services.length)}
            >
              Next
            </button>
          </div>

          <div className="home-service-slider__thumbs">
            {services.map((service, index) => (
              <button
                key={service.id}
                type="button"
                className={`home-service-slider__thumb ${
                  index === activeIndex ? "is-active" : ""
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <img src={service.image} alt={service.title} />
                <span>{service.title}</span>
              </button>
            ))}
          </div>

          <Link to="/service" className="home-section-link">
            Explore all services
          </Link>
        </div>
      </div>
    </section>
  );
}
