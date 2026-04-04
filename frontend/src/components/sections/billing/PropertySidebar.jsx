import { FaHome, FaBuilding, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";

export default function PropertySidebar({
  apartments,
  selectedSelection, // { type: 'apartment'|'service'|'support', id: string }
  onSelect,
}) {
  return (
    <aside className="property-sidebar">
      {/* SECTION 1: APARTMENT BILLS */}
      <h3 className="property-title">My Properties</h3>

      <div className="property-list">
        {apartments.map((apt) => (
          <button
            key={apt.id}
            className={`property-item ${selectedSelection.type === "apartment" && String(selectedSelection.id) === String(apt.id) ? "active" : ""
              }`}
            onClick={() => onSelect({ type: "apartment", id: String(apt.id) })}
          >
            <div className="property-icon">
              {selectedSelection.type === "apartment" && String(selectedSelection.id) === String(apt.id) ? <FaBuilding /> : <FaHome />}
            </div>
            <span>Apartment {apt.label}</span>
          </button>
        ))}

        {apartments.length === 0 && (
          <div className="billing-empty">No apartments linked.</div>
        )}
      </div>

      {/* SECTION 2: PERSONAL SERVICES */}
      <h3 className="property-title" style={{ marginTop: "32px" }}>Personal Services</h3>

      <div className="property-list">
        <button
          className={`property-item ${selectedSelection.type === "service" ? "active" : ""}`}
          onClick={() => onSelect({ type: "service", id: "all" })}
        >
          <div className="property-icon">
            <FaCalendarAlt />
          </div>
          <span>Service Bookings</span>
        </button>
      </div>

      {/* SECTION 3: HELP & SUPPORT */}
      <h3 className="property-title" style={{ marginTop: "32px" }}>Help & Support</h3>

      <div className="property-list">
        <button
          className={`property-item ${selectedSelection.type === "support" ? "active" : ""}`}
          onClick={() => onSelect({ type: "support", id: "all" })}
        >
          <div className="property-icon">
            <FaExclamationCircle />
          </div>
          <span>Complaints</span>
        </button>
      </div>
    </aside>
  );
}
