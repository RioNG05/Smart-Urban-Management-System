import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import BookingForm from "../components/sections/booking/BookingForm";

import "../styles/booking.css";

export default function BookingPage() {
  return (
    <>
      <Navbar solid />

      <main className="booking-page">
        {/* Hero */}
        <section className="booking-hero">
          <div className="container">
            <p className="booking-eyebrow">Service Booking</p>
            <h1>
              Reserve premium resident services with confidence, speed, and seamless support.
            </h1>
            <p className="booking-hero-copy">
              Choose your preferred service, pick an available resource, then select a date and
              time slot — all in just a few easy steps.
            </p>
          </div>
        </section>

        <BookingForm />
      </main>

      <Footer />
    </>
  );
}
