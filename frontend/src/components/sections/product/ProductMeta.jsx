const ProductMeta = ({ property }) => {
  return (
    <div className="product-meta">
      <div className="meta-price-section">
        <div className="meta-price">{property.buyPrice}</div>
        <div className="meta-price-per">Sale Price</div>

        <div className="meta-price" style={{ fontSize: "1.5rem", marginTop: "12px" }}>
          {property.rentPrice}
        </div>
        <div className="meta-price-per">
          {property.rentPrice === "Contact for price"
            ? "Rental price updating"
            : "Rental Price"}
        </div>
      </div>

      <div className="meta-info">
        <div className="meta-item">
          <span className="meta-label">Sale Price / m2</span>
          <strong className="meta-value">
            {property.pricePerSquareMeter === "Contact for price"
              ? "Updating"
              : property.pricePerSquareMeter}
          </strong>
        </div>

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
          <span className="meta-label">Posted Date</span>
          <strong className="meta-value">{property.postedDate}</strong>
        </div>
      </div>
    </div>
  );
};

export default ProductMeta;
