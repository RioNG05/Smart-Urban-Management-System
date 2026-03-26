import { useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { serviceCatalog } from "../data/serviceCatalog";

import "../styles/booking.css";

const visitTimes = ["Morning", "Afternoon", "Evening"];
const householdSizes = ["1-2 people", "3-4 people", "5+ people"];

export default function BookingPage() {
  const [selectedServiceId, setSelectedServiceId] = useState(serviceCatalog[0].id);
  const [survey, setSurvey] = useState({
    fullName: "",
    apartmentCode: "",
    preferredDate: "",
    preferredTime: visitTimes[0],
    householdSize: householdSizes[0],
    note: "",
  });

  const selectedService = useMemo(
    () => serviceCatalog.find((service) => service.id === selectedServiceId) ?? serviceCatalog[0],
    [selectedServiceId]
  );

  const handleSurveyChange = (event) => {
    const { name, value } = event.target;
    setSurvey((current) => ({ ...current, [name]: value }));
  };

  return (
    <>
      <Navbar solid />

      <main className="booking-page">
        <section className="booking-hero">
          <div className="container">
            <p className="booking-eyebrow">Service Booking</p>
            <h1>Choose a service package and preview the exact areas your residents will use.</h1>
            <p className="booking-hero-copy">
              The survey on the left helps us understand your needs, while the visual panel on the
              right updates instantly to show the service zones connected to your selection.
            </p>
          </div>
        </section>

        <section className="booking-layout container">
          <div className="booking-survey-panel">
            <div className="booking-panel-header">
              <span className="booking-step">Step 1</span>
              <h2>Resident survey form</h2>
              <p>Fill in basic details and choose the service you want to book.</p>
            </div>

            <form className="booking-form">
              <div className="booking-field-grid">
                <label className="booking-field">
                  <span>Full name</span>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Nguyen Van A"
                    value={survey.fullName}
                    onChange={handleSurveyChange}
                  />
                </label>

                <label className="booking-field">
                  <span>Apartment code</span>
                  <input
                    type="text"
                    name="apartmentCode"
                    placeholder="S1.12.08"
                    value={survey.apartmentCode}
                    onChange={handleSurveyChange}
                  />
                </label>

                <label className="booking-field">
                  <span>Preferred date</span>
                  <input
                    type="date"
                    name="preferredDate"
                    value={survey.preferredDate}
                    onChange={handleSurveyChange}
                  />
                </label>

                <label className="booking-field">
                  <span>Preferred time</span>
                  <select
                    name="preferredTime"
                    value={survey.preferredTime}
                    onChange={handleSurveyChange}
                  >
                    {visitTimes.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="booking-field">
                  <span>Household size</span>
                  <select
                    name="householdSize"
                    value={survey.householdSize}
                    onChange={handleSurveyChange}
                  >
                    {householdSizes.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="booking-service-picker">
                <div className="booking-picker-header">
                  <span className="booking-step">Step 2</span>
                  <h3>Select your service</h3>
                </div>

                <div className="booking-service-options">
                  {serviceCatalog.map((service) => (
                    <label
                      key={service.id}
                      className={`booking-service-option ${
                        selectedServiceId === service.id ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedService"
                        value={service.id}
                        checked={selectedServiceId === service.id}
                        onChange={() => setSelectedServiceId(service.id)}
                      />
                      <span className="booking-service-title">{service.title}</span>
                      <span className="booking-service-desc">{service.tagline}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="booking-field">
                <span>Special request</span>
                <textarea
                  name="note"
                  rows="4"
                  placeholder="Tell us what kind of support, setup, or experience you want."
                  value={survey.note}
                  onChange={handleSurveyChange}
                />
              </label>

              <div className="booking-summary-box">
                <p className="booking-summary-label">Current selection</p>
                <h3>{selectedService.title}</h3>
                <p>{selectedService.desc}</p>
              </div>
            </form>
          </div>

          <div className="booking-visual-panel">
            <div className="booking-visual-hero">
              <img src={selectedService.image} alt={selectedService.title} />
              <div className="booking-visual-overlay">
                <p className="booking-step">Selected service</p>
                <h2>{selectedService.title}</h2>
                <p>{selectedService.tagline}</p>
              </div>
            </div>

            <div className="booking-areas">
              <div className="booking-picker-header">
                <span className="booking-step">Step 3</span>
                <h3>Service areas that update with your choice</h3>
              </div>

              <div className="booking-area-grid">
                {selectedService.areas.map((area) => (
                  <article key={area.name} className="booking-area-card">
                    <img src={area.image} alt={area.name} />
                    <div className="booking-area-content">
                      <h4>{area.name}</h4>
                      <p>{area.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
