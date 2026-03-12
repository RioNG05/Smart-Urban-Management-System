import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import ServiceHero from "../components/sections/service/ServiceHero";
import ServiceList from "../components/sections/service/ServiceList";
import ServiceBenefits from "../components/sections/service/ServiceBenefits";
import ServiceHowItWorks from "../components/sections/service/ServiceHowItWorks";

import "../styles/service.css";

export default function ServicePage() {
  return (
    <>
      <Navbar />

      <ServiceHero />
      <ServiceList />
      <ServiceBenefits />
      <ServiceHowItWorks />

      <Footer />
    </>
  );
}
