const ProductMeta = () => {
  return (
    <div className="product-meta">
      {/* PRICE */}
      <div className="meta-price-section">
        <div className="meta-price">2,35 tỷ</div>
        <div className="meta-price-per">~31,3 triệu/m²</div>
      </div>

      {/* QUICK INFO */}
      <div className="meta-info">
        <div className="meta-item">
          <span className="meta-label">Diện tích</span>
          <strong className="meta-value">75 m²</strong>
        </div>

        <div className="meta-item">
          <span className="meta-label">Phòng ngủ</span>
          <strong className="meta-value">2</strong>
        </div>

        <div className="meta-item">
          <span className="meta-label">Phòng tắm</span>
          <strong className="meta-value">2</strong>
        </div>

        <div className="meta-item">
          <span className="meta-label">Hướng nhà</span>
          <strong className="meta-value">Đông Nam</strong>
        </div>

        <div className="meta-item">
          <span className="meta-label">Pháp lý</span>
          <strong className="meta-value">Sổ đỏ</strong>
        </div>
      </div>
    </div>
  );
};

export default ProductMeta;
