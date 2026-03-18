import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ContactSection from "../components/sections/ContactSection";
import ContactDetails from "../components/sections/contact/ContactDetails";
import ContactHero from "../components/sections/contact/ContactHero";
import ContactInfoCards from "../components/sections/contact/ContactInfoCards";

import "../styles/contact.css";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactHero />

      <main className="contact-page">
        <ContactInfoCards />
        <ContactDetails />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
