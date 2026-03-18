const ProductMeta = ({ property }) => {
  return (
    <div className="product-meta">
      <div className="meta-price-section">
        <div className="meta-price">{property.price}</div>
        <div className="meta-price-per">
          {property.pricePerSquareMeter === "Lien he"
            ? "Gia/m2 dang cap nhat"
            : `${property.pricePerSquareMeter}/m2`}
        </div>
      </div>

      <div className="meta-info">
        <div className="meta-item">
          <span className="meta-label">Area</span>
          <strong className="meta-value">{property.area} m2</strong>
        </div>

        <div className="meta-item">
          <span className="meta-label">Bedrooms</span>
          <strong className="meta-value">{property.bedrooms}</strong>
        </div>

        <div className="meta-item">
          <span className="meta-label">Bathrooms</span>
          <strong className="meta-value">{property.bathrooms}</strong>
        </div>

        <div className="meta-item">
          <span className="meta-label">Direction</span>
          <strong className="meta-value">{property.direction}</strong>
        </div>

        <div className="meta-item">
          <span className="meta-label">Legal Status</span>
          <strong className="meta-value">{property.legalStatus}</strong>
        </div>
      </div>
    </div>
  );
};

export default ProductMeta;
