import { 
  FaBolt, 
  FaTint, 
  FaBuilding, 
  FaUmbrella, 
  FaTools, 
  FaParking, 
  FaLeaf, 
  FaShoppingCart, 
  FaChild, 
  FaDumbbell, 
  FaGraduationCap, 
  FaHamburger, 
  FaTableTennis, 
  FaGolfBall, 
  FaSpa, 
  FaUsers 
} from "react-icons/fa";
import { formatCurrency } from "../../../utils/billingUtils";

export default function BookingPricingTable({ rates }) {
  const getIcon = (serviceName) => {
    const name = serviceName?.toLowerCase() || "";
    
    // Most Specific Services First
    if (name.includes("parking")) return <FaParking className="rate-icon management" />;
    if (name.includes("bbq")) return <FaHamburger className="rate-icon management" />;
    if (name.includes("electric")) return <FaBolt className="rate-icon electricity" />;
    if (name.includes("water")) return <FaTint className="rate-icon water" />;
    
    // Facilities & Buildings
    if (name.includes("shopping") || name.includes("mall")) return <FaShoppingCart className="rate-icon management" />;
    if (name.includes("playground") || name.includes("children")) return <FaChild className="rate-icon management" />;
    if (name.includes("gym") || name.includes("yoga") || name.includes("fitness")) return <FaDumbbell className="rate-icon management" />;
    if (name.includes("education") || name.includes("school") || name.includes("system")) return <FaGraduationCap className="rate-icon management" />;
    if (name.includes("hall") || name.includes("community")) return <FaUsers className="rate-icon management" />;
    
    // Sports & Leisure
    if (name.includes("pool") || name.includes("swim")) return <FaUmbrella className="rate-icon management" />;
    if (name.includes("tennis") || name.includes("sport")) return <FaTableTennis className="rate-icon management" />;
    if (name.includes("golf")) return <FaGolfBall className="rate-icon management" />;
    if (name.includes("sauna") || name.includes("spa")) return <FaSpa className="rate-icon management" />;
    
    // General Greenery/Parks (Lower priority)
    if (name.includes("park") || name.includes("garden") || name.includes("green")) return <FaLeaf className="rate-icon management" />;
    
    if (name.includes("repair") || name.includes("fix")) return <FaTools className="rate-icon management" />;

    return <FaBuilding className="rate-icon management" />;
  };

  return (
    <div className="billing-rate-container">
      <p className="billing-panel-subtitle" style={{ marginTop: "-12px", marginBottom: "30px" }}>
        Official unit prices for amenities and on-demand services.
      </p>

      <div className="rate-grid">
        {rates.length ? (
          rates.map((rate) => (
            <div key={rate.id} className="rate-card-grid-item">
                <div className="rate-card-icon-box">
                  {getIcon(rate.serviceName)}
                </div>
                
                <div className="rate-card-content">
                  <div className="rate-card-label">{rate.serviceName}</div>
                  <div className="rate-card-unit">{rate.unitType || "Session"}</div>
                  
                  <div className="rate-card-price-tag">
                    {rate.feePerUnit === null || rate.feePerUnit === 0
                      ? <span className="free-tag">FREE</span>
                      : formatCurrency(rate.feePerUnit)}
                  </div>
                </div>
            </div>
          ))
        ) : (
          <div className="billing-empty-info" style={{ gridColumn: "1 / -1", padding: "60px 0" }}>
            No active service rates found.
          </div>
        )}
      </div>
    </div>
  );
}
