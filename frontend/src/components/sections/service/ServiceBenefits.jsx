import React from "react";
import { FaStar, FaShieldAlt, FaHome } from "react-icons/fa";

const benefits = [
  {
    id: 1,
    title: "Exclusive Access",
    desc: "Only residents have priority access and discounted rates to all premium amenities within the ecosystem.",
    icon: <FaStar className="benefit-icon" />
  },
  {
    id: 2,
    title: "24/7 Smart Security",
    desc: "Experience peace of mind with our integrated AI surveillance and round-the-clock professional security guard team.",
    icon: <FaShieldAlt className="benefit-icon" />
  },
  {
    id: 3,
    title: "Convenient Living",
    desc: "Everything you need from healthcare to education and shopping is just a few steps away from your front door.",
    icon: <FaHome className="benefit-icon" />
  }
];

export default function ServiceBenefits() {
  return (
    <section className="service-benefits-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="service-section-title">Why Choose Our Ecosystem?</h2>
          <p className="service-section-subtitle">
            Living here means embracing a lifestyle where every need is anticipated and fulfilled.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="benefit-card">
              <div className="benefit-icon-wrapper">
                {benefit.icon}
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-desc">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
