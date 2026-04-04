function PropertyToolbar({
  view,
  setView,
  resultCount,
  availableCount,
  sortBy,
  setSortBy,
  selectedApartmentType,
  setSelectedApartmentType,
  apartmentTypeOptions,
  pageMeta,
}) {
  const { currentPage, totalPages, startIndex, endIndex } = pageMeta;

  return (
    <div className="property-toolbar">
      <div className="toolbar-copy">
        <div className="toolbar-kicker">Market Overview</div>
        <div className="results">{availableCount} properties available</div>
        <p className="toolbar-subtext">
          Showing {startIndex}-{endIndex} of {resultCount} listings on page{" "}
          {currentPage} of {totalPages}.
        </p>
      </div>

      <div className="toolbar-actions">
        <label className="toolbar-select">
          <span>Apartment type</span>
          <select
            value={selectedApartmentType}
            onChange={(event) => setSelectedApartmentType(event.target.value)}
          >
            <option value="all">All apartment types</option>
            {apartmentTypeOptions.map((apartmentType) => (
              <option key={apartmentType.id} value={String(apartmentType.id)}>
                {apartmentType.name}
              </option>
            ))}
          </select>
        </label>

        <label className="toolbar-select">
          <span>Sort by</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </label>

        <div className="view-toggle">
          <button
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
            type="button"
          >
            Grid
          </button>
          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
            type="button"
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyToolbar;
