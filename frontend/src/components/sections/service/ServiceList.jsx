import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getServices } from "../../../services/serviceService";

export default function ServiceList() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const serviceData = await getServices();
        setServices(serviceData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Could not load services at this time.");
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="service-container">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="service-section-title">Exclusive Amenities</h2>
          <p className="service-section-subtitle">
            Explore the ecosystem of 5-star utilities tailored for residents, integrating modern
            technology and exceptional living standards.
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="service-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                {service.image ? (
                  <div className="service-image">
                    <img src={service.image} alt={service.title} />
                  </div>
                ) : null}
                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  {service.serviceCode ? <p className="service-desc">Code: {service.serviceCode}</p> : null}
                  <p className="service-desc">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-5">
          {user && role === "RESIDENT" ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/booking")}
              style={{ backgroundColor: "#c89b3c", border: "none" }}
            >
              Book This Service
            </button>
          ) : (
            <div className="service-warning-alert">
              <i className="bi bi-exclamation-circle-fill warning-icon"></i>
              <span>
                <strong>Notice:</strong> You must be a resident to schedule amenity usage.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
