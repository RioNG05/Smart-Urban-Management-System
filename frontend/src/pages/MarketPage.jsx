import { useState } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

import PropertyGrid from "../components/sections/listing/PropertyGrid.jsx";
import PropertyToolbar from "../components/sections/listing/PropertyToolbar.jsx";
import PropertyHero from "../components/sections/listing/PropertyHero.jsx";

function MarketPage() {
  const [view, setView] = useState("grid");

  return (
    <>
      <Navbar />

      <div className="market-page">
        <PropertyHero />

        <div className="market-container">
          <PropertyToolbar view={view} setView={setView} />
          <PropertyGrid view={view} />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MarketPage;
