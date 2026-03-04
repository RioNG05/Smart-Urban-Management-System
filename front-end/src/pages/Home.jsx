import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Hero from "../components/sections/Hero";
import AboutSection from "../components/sections/AboutSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import NewsSection from "../components/sections/NewsSection";
import ContactSection from "../components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />
      <AboutSection />
      <ProjectsSection />
      <NewsSection />
      <ContactSection />

      <Footer />
    </>
  );
}
