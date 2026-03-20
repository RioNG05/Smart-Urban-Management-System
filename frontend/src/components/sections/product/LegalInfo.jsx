const LegalInfo = ({ property }) => {
  return (
    <div className="product-legal">
      <h2 className="section-title">Legal Information</h2>

      <div className="legal-content">
        <div className="legal-item">
          <span className="legal-label">Legal Documents</span>
          <span className="legal-value">{property.legalStatus}</span>
        </div>

        <div className="legal-item">
          <span className="legal-label">Ownership Status</span>
          <span className="legal-value">{property.statusLabel}</span>
        </div>

        <div className="legal-item">
          <span className="legal-label">Loan Support</span>
          <span className="legal-value">Ho tro vay toi da 70%</span>
        </div>
      </div>
    </div>
  );
};

export default LegalInfo;
