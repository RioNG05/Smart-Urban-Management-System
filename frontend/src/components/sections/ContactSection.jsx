import React, { useState } from "react";
import "../../styles/contact.css";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // [BACKEND API INTEGRATION POINT] 

    console.log("Form data to be sent to API:", formData);
    setStatus("loading");

    // Giả lập thời gian gửi
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 1500);
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        
        <div className="contact-header">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle">
            Have questions about our smart urban solutions? Reach out to us and our team will get back to you shortly.
          </p>
        </div>

        <div className="contact-form-card">
          <form onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  className="contact-input"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="contact-form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  className="contact-input"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="contact-form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                className="contact-input"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+84 123 456 789"
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="message">Message</label>
              <textarea
                className="contact-input"
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <div className="contact-alert contact-alert-success">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            {status === "error" && (
              <div className="contact-alert contact-alert-error">
                Something went wrong. Please try again later.
              </div>
            )}
          </form>
        </div>
        
      </div>
    </section>
  );
}
