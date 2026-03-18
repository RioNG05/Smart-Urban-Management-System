import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";


// Dữ liệu mẫu (xóa khi dùng API thật)
const dummyServices = [
  {
    id: 1,
    title: "Green Park",
    desc: "Extensive green parks with lush landscapes, walking trails, and serene environments for relaxation and community gathering.",
    image: "https://img.freepik.com/free-photo/beautiful-park_1417-1417.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    id: 2,
    title: "Swimming Pools",
    desc: "Olympic-sized swimming pools and resort-style infinity pools open exclusively for residents all year round.",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7",
  },
  {
    id: 3,
    title: "Gym & Yoga Facilities",
    desc: "High-end fitness centers equipped with modern machinery and dedicated yoga studios for your health and wellness journey.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
  },
  {
    id: 4,
    title: "Shopping Center",
    desc: "A sprawling commercial complex housing top global brands, boutique shops, and diverse retail experiences right at your doorstep.",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/06/a3/68/field-s-shopping-center.jpg?w=800&h=500&s=1",
  },
  {
    id: 5,
    title: "Children’s Playground",
    desc: "Safe, interactive outdoor and indoor playgrounds designed to foster creativity and physical activity for kids of all ages.",
    image: "https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/PlaygroundHero.jpg",
  },
  {
    id: 6,
    title: "Education System",
    desc: "A comprehensive premium K-12 education system offering international standard curriculums for the next generation.",
    image: "https://vcdn1-vnexpress.vnecdn.net/2023/12/13/v1-5551-1702452332.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=vTDtn5c45HktGxyMQtP20w",
  },
  {
    id: 7,
    title: "Smart Parking",
    desc: "Automated parking systems with real-time slot tracking, 24/7 security, and integrated fast-charging EV stations.",
    image: "https://sliving.vn/static/bg-parking-55d4ba544730bb343bfb7709c4c8e50b.jpg",
  },
  {
    id: 8,
    title: "BBQ Park",
    desc: "Dedicated outdoor BBQ areas equipped with grills, seating, and scenic views—perfect for weekend family and friend gather-ups.",
    image: "https://vinhomebysalereal.vn/wp-content/uploads/2024/08/khu-bbq-garden-vinhomes-ocean-park-3.jpg",
  },
  {
    id: 9,
    title: "Tennis Court",
    desc: "Professional-grade tennis courts with high-quality surfaces and night lighting for enthusiasts and casual players.",
    image: "https://congchungnguyenhue.com/Uploaded/Images/Original/2024/01/21/khu-do-thi-viet-hung-5_2101080916.jpg",
  },
  {
    id: 10,
    title: "Golf Course",
    desc: "Premium mini-golf courses and putting greens designed for both practice and leisure in a beautifully landscaped setting.",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b",
  },
  {
    id: 11,
    title: "Sauna & Spa",
    desc: "Relax and rejuvenate with our luxury sauna and spa facilities, offering a range of wellness treatments and tranquil environments.",
    image: "https://vccinews.vn/upload/photos/2026/1/large/vbf-202612210123d2y.jpg",
  },
  {
    id: 12,
    title: "Community Hall",
    desc: "Spacious and versatile community halls for meetings, cultural events, and social gatherings among residents.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
  }
];

export default function ServiceList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // [BACKEND API INTEGRATION POINT]
    // Gọi API lấy danh sách dịch vụ: GET /api/services

    const fetchServices = async () => {
      try {
        setIsLoading(true);

        // Bỏ khi có API:
        /*
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
        */

        // Lấy dữ liệu mẫu
        setServices(dummyServices);
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
            Explore the ecosystem of 5-star utilities tailored for residents, integrating modern technology and exceptional living standards.
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
                <div className="service-image">
                  <img src={service.image} alt={service.title} />
                </div>
                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-desc">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-5">
          {user && user.role === "resident" ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/dashboard")}
              style={{ backgroundColor: "#c89b3c", border: "none" }}
            >
              Go to Dashboard To Book
            </button>
          ) : (
            <div className="service-warning-alert">
              <i className="bi bi-exclamation-circle-fill warning-icon"></i>
              <span><strong>Notice:</strong> You must be a resident to schedule amenity usage.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
