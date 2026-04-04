import { FaBolt, FaTint, FaBuilding } from "react-icons/fa";

export default function BillingPricingTable({ rates, formatCurrency }) {
  const getIcon = (key) => {
    switch (key?.toLowerCase()) {
      case "electricity":
        return <FaBolt className="rate-icon electricity" />;
      case "water":
        return <FaTint className="rate-icon water" />;
      default:
        return <FaBuilding className="rate-icon management" />;
    }
  };

  return (
    <div className="billing-rate-container">
      <p className="billing-panel-subtitle">
        Official unit prices for utility services and facilities.
      </p>


      
      <div className="rate-list">
        {rates.length ? (
          rates.map((rate) => (
            <div key={rate.key} className="rate-card-item">
              <div className="rate-card-main">
                <div className="rate-icon-wrapper">
                  {getIcon(rate.key)}
                </div>
                <div className="rate-info">
                  <div className="rate-label">{rate.label}</div>
                  <div className="rate-unit-badge">{rate.unitType || "Fixed"}</div>
                </div>
              </div>
              
              <div className="rate-card-side">
                <div className="rate-price">
                  {rate.unitPrice === null
                    ? "N/A"
                    : formatCurrency(rate.unitPrice)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="billing-empty">
            No active rates found.
          </div>
        )}
      </div>
    </div>
  );
}


