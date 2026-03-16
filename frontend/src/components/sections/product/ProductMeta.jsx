const ProductMeta = () => {
  return (
    <div className="product-meta">
      {/* PRICE */}
      <div className="meta-price-section">
        <div className="meta-price">2.35 billion VND</div>
        <div className="meta-price-per">~31.3 million VND/m²</div>
      </div>

      {/* QUICK INFO */}
      <div className="meta-info">
        <div className="meta-item">
          <span className="meta-label">Area</span>
          <strong className="meta-value">75 m²</strong>
        </div>

        <div className="meta-item">
          <span className="meta-label">Bedrooms</span>
          <strong className="meta-value">2</strong>
        </div>

        <div className="meta-item">
          <span className="meta-label">Bathrooms</span>
          <strong className="meta-value">2</strong>
        </div>

        <div className="meta-item">
          <span className="meta-label">Direction</span>
          <strong className="meta-value">Southeast</strong>
        </div>

        <div className="meta-item">
          <span className="meta-label">Legal Status</span>
          <strong className="meta-value">Red Book</strong>
        </div>
      </div>
    </div>
  );
};

export default ProductMeta;
