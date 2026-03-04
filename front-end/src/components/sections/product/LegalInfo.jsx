const LegalInfo = () => {
  return (
    <div className="product-legal">
      <h2 className="section-title">Thông tin pháp lý</h2>

      <div className="legal-content">
        <div className="legal-item">
          <span className="legal-label">Giấy tờ pháp lý</span>
          <span className="legal-value">Sổ đỏ chính chủ</span>
        </div>

        <div className="legal-item">
          <span className="legal-label">Tình trạng sở hữu</span>
          <span className="legal-value">Lâu dài</span>
        </div>

        <div className="legal-item">
          <span className="legal-label">Hỗ trợ vay</span>
          <span className="legal-value">Ngân hàng hỗ trợ 70%</span>
        </div>
      </div>
    </div>
  );
};

export default LegalInfo;
