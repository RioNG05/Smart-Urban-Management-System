function PropertyToolbar({
  view,
  setView,
  resultCount,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="property-toolbar">
      <div className="results">{resultCount} Properties Available</div>

      <div className="toolbar-actions">
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="price-asc">Sort by Price (Low to High)</option>
          <option value="price-desc">Sort by Price (High to Low)</option>
          <option value="newest">Newest</option>
        </select>

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
