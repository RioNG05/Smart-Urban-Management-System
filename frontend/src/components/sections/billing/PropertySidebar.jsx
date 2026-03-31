import { FaBuilding, FaFileInvoiceDollar, FaExclamationCircle } from "react-icons/fa";

export default function PropertySidebar({
  apartments,
  selectedApartmentId,
  onSelectApartment,
  activeMainTab,
  onSelectMainTab,
}) {
  return (
    <div className="property-sidebar d-flex flex-column gap-3 p-3 bg-white rounded shadow-sm" style={{ minWidth: "260px" }}>
      <h3 className="property-title fs-5 fw-bold mb-3 border-bottom pb-2">Dashboard Menu</h3>

      <ul className="nav nav-pills flex-column gap-2 mb-2">
        <li className="nav-item">
          <button
            className={`nav-link text-start w-100 d-flex align-items-center gap-2 ${activeMainTab === "billing" ? "fw-bold shadow-sm" : "text-dark"}`}
            onClick={() => onSelectMainTab("billing")}
            style={{ 
              fontWeight: "500",
              backgroundColor: activeMainTab === "billing" ? "#2e7d32" : "transparent",
              color: activeMainTab === "billing" ? "#fff" : "inherit"
            }}
          >
            <FaFileInvoiceDollar /> Billing & Properties
          </button>
        </li>
      </ul>

      {/* Properties Sub-list, only visible when billing is active */}
      {activeMainTab === "billing" && (
        <div className="ps-3 pe-1 d-flex flex-column gap-2 mb-3 border-start border-2 ms-2">
          <h4 className="fs-6 text-muted mb-1 small text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>
            Select Property
          </h4>
          {apartments.length > 0 ? (
            apartments.map((apartment) => (
              <button
                key={apartment.id}
                type="button"
                className={`property-item text-start d-flex align-items-center gap-2 border-0 bg-transparent p-2 rounded ${
                  apartment.id === selectedApartmentId ? "fw-bold shadow-sm" : "text-secondary"
                }`}
                onClick={() => onSelectApartment(String(apartment.id))}
                style={{
                  transition: "background 0.2s",
                  backgroundColor: apartment.id === selectedApartmentId ? "#e8f5e9" : "transparent",
                  color: apartment.id === selectedApartmentId ? "#2e7d32" : "inherit",
                  borderLeft: apartment.id === selectedApartmentId ? "4px solid #2e7d32" : "4px solid transparent"
                }}
                onMouseOver={(e) => {
                  if (apartment.id !== selectedApartmentId) e.currentTarget.style.backgroundColor = "#f8f9fa";
                }}
                onMouseOut={(e) => {
                  if (apartment.id !== selectedApartmentId) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <FaBuilding /> Apartment {apartment.label}
              </button>
            ))
          ) : (
            <div className="billing-empty small text-muted fst-italic">No apartment found.</div>
          )}
        </div>
      )}

      <ul className="nav nav-pills flex-column gap-2 mt-2 pt-2 border-top">
        <li className="nav-item">
          <button
            className={`nav-link text-start w-100 d-flex align-items-center gap-2 ${activeMainTab === "complaints" ? "fw-bold shadow-sm" : "text-dark"}`}
            onClick={() => onSelectMainTab("complaints")}
            style={{ 
              fontWeight: "500",
              backgroundColor: activeMainTab === "complaints" ? "#2e7d32" : "transparent",
              color: activeMainTab === "complaints" ? "#fff" : "inherit"
            }}
          >
            <FaExclamationCircle /> My Complaints
          </button>
        </li>
      </ul>
    </div>
  );
}
