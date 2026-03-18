import React, { useState } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

import PropertyGrid from "../components/sections/listing/PropertyGrid.jsx";
import PropertyToolbar from "../components/sections/listing/PropertyToolbar.jsx";
import PropertyHero from "../components/sections/listing/PropertyHero.jsx";

function MarketPage() {
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("price-asc");
  const [resultCount, setResultCount] = useState(0);

  return (
    <>
      <Navbar />

      <div className="market-page">
        <PropertyHero />

        <div className="market-container">
          <PropertyToolbar
            view={view}
            setView={setView}
            resultCount={resultCount}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <PropertyGrid
            view={view}
            sortBy={sortBy}
            onCountChange={setResultCount}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MarketPage;
