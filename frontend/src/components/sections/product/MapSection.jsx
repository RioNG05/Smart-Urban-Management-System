const MapSection = ({ property }) => {
  return (
    <div className="product-map">
      <h2 className="section-title">Location</h2>

      <div className="map-container">
        <iframe
          title="property-location"
          src={`https://www.google.com/maps?q=${encodeURIComponent(property.fullLocation)}&output=embed`}
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MapSection;
