export default function PropertySidebar({
  apartments,
  selectedApartmentId,
  onSelectApartment,
}) {
  return (
    <div className="property-sidebar">
      <h3 className="property-title">Properties</h3>

      {apartments.length > 0 ? (
        apartments.map((apartment) => (
          <button
            key={apartment.id}
            type="button"
            className={`property-item ${
              apartment.id === selectedApartmentId ? "active" : ""
            }`}
            onClick={() => onSelectApartment(String(apartment.id))}
          >
            Apartment {apartment.label}
          </button>
        ))
      ) : (
        <div className="billing-empty">No linked apartment found.</div>
      )}
    </div>
  );
}
