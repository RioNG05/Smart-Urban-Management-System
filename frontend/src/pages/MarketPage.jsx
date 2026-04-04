import React, { useState } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

import PropertyGrid from "../components/sections/listing/PropertyGrid.jsx";
import PropertyToolbar from "../components/sections/listing/PropertyToolbar.jsx";
import PropertyHero from "../components/sections/listing/PropertyHero.jsx";

function MarketPage() {
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("price-asc");
  const [selectedApartmentType, setSelectedApartmentType] = useState("all");
  const [apartmentTypeOptions, setApartmentTypeOptions] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [availableCount, setAvailableCount] = useState(0);
  const [pageMeta, setPageMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    startIndex: 0,
    endIndex: 0,
  });

  return (
    <>
      <Navbar />

      <div className="market-page">
        <PropertyHero totalProperties={resultCount} />

        <div className="market-shell">
          <div className="market-container">
            <PropertyToolbar
              view={view}
              setView={setView}
              resultCount={resultCount}
              availableCount={availableCount}
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedApartmentType={selectedApartmentType}
              setSelectedApartmentType={setSelectedApartmentType}
              apartmentTypeOptions={apartmentTypeOptions}
              pageMeta={pageMeta}
            />
            <PropertyGrid
              view={view}
              sortBy={sortBy}
              selectedApartmentType={selectedApartmentType}
              onCountChange={setResultCount}
              onAvailableCountChange={setAvailableCount}
              onPageMetaChange={setPageMeta}
              onApartmentTypeOptionsChange={setApartmentTypeOptions}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MarketPage;
