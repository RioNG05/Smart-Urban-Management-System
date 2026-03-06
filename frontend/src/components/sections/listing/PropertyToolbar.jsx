function PropertyToolbar({ view, setView }) {
  return (
    <div className="property-toolbar">
      <div className="results">24 Properties Available</div>

      <div className="toolbar-actions">
        <select>
          <option>Sort by Price (Low → High)</option>
          <option>Sort by Price (High → Low)</option>
          <option>Newest</option>
        </select>

        <div className="view-toggle">
          <button
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
          >
            ⬛
          </button>
          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            ☰
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyToolbar;
