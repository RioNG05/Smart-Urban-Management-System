function PropertyHero() {
  return (
    <div className="market-hero">
      <div className="hero-overlay">
        <h1 className="fade-up">Find Your Dream Property</h1>
        <p className="fade-up delay-1">Luxury residences across Vietnam</p>

        <div className="hero-search">
          <input type="text" placeholder="Search by location or project..." />
          <button>Search</button>
        </div>
      </div>
    </div>
  );
}

export default PropertyHero;
