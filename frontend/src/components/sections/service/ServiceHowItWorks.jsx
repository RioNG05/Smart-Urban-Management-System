import React from "react";

const steps = [
  {
    step: "01",
    title: "Become a Resident",
    desc: "Purchase or rent an apartment to officially become a resident of our urban ecosystem.",
  },
  {
    step: "02",
    title: "Access Dashboard",
    desc: "Log in to the Resident Dashboard using your verified account credentials.",
  },
  {
    step: "03",
    title: "Book Services",
    desc: "Browse and book amenities like BBQ stations, tennis courts, golf courses, and spa facilities instantly.",
  },
  {
    step: "04",
    title: "Enjoy the Lifestyle",
    desc: "Experience 5-star living standards with priority support and exclusive benefits.",
  }
];

export default function ServiceHowItWorks() {
  return (
    <section className="service-how-it-works-section">
      <div className="container">
        <h2 className="service-section-title text-center mb-5">Do you want to use all services?</h2>

        <div className="how-it-works-grid">
          {steps.map((item, index) => (
            <div key={index} className="how-it-works-step">
              <div className="step-number">{item.step}</div>
              <h3 className="step-title">{item.title}</h3>
              <p className="step-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
