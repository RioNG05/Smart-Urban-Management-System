const MapSection = () => {
  return (
    <div className="product-map">
      <h2 className="section-title">Vị trí trên bản đồ</h2>

      <div className="map-container">
        <iframe
          title="property-location"
          src="https://www.google.com/maps?q=Vinhomes+Ocean+Park+Gia+Lam&output=embed"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MapSection;
