import { FaHome, FaBuilding } from "react-icons/fa";

export default function PropertySidebar({
  apartments,
  selectedApartmentId,
  onSelectApartment,
}) {
  return (
    <aside className="property-sidebar">
      <h3 className="property-title">My Properties</h3>
      
      <div className="property-list">
        {apartments.map((apt) => (
          <button
            key={apt.id}
            className={`property-item ${
              String(selectedApartmentId) === String(apt.id) ? "active" : ""
            }`}
            onClick={() => onSelectApartment(String(apt.id))}
          >
            <div className="property-icon">
              {String(selectedApartmentId) === String(apt.id) ? <FaBuilding /> : <FaHome />}
            </div>
            <span>Apartment {apt.label}</span>
          </button>
        ))}
        
        {apartments.length === 0 && (
          <div className="billing-empty">No apartments linked.</div>
        )}
      </div>
    </aside>
  );
}
