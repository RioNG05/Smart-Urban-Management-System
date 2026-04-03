import { FaCreditCard, FaClock, FaCheckCircle, FaExclamationCircle, FaBuilding, FaBolt, FaTint } from "react-icons/fa";
import { formatCurrency, formatDateTime } from "../../../utils/billingUtils";

export default function BookingPaymentList({ bookings, loading, onPaymentSuccess }) {
  
  const unpaidBookings = (bookings || []).filter(b => Number(b.status) === 0);

  if (loading) {
    return (
      <div className="billing-loading-state">
        <div className="spinner-border" />
        <p>Loading pending payments...</p>
      </div>
    );
  }

  if (unpaidBookings.length === 0) {
    return (
      <div className="billing-empty-state">
        <FaCheckCircle style={{ fontSize: "40px", color: "#059669", opacity: 0.5, marginBottom: "15px" }} />
        <h4>All settled!</h4>
        <p>You have no pending service booking payments at this time.</p>
      </div>
    );
  }

  const getServiceIcon = (serviceName) => {
    const name = serviceName?.toLowerCase() || "";
    if (name.includes("electric")) return <FaBolt />;
    if (name.includes("water")) return <FaTint />;
    return <FaBuilding />;
  };

  return (
    <div className="billing-panel">
      <div className="billing-panel-header">
        <div>
          <h3 className="section-title">Pending Booking Payments</h3>
          <p className="billing-panel-subtitle">Settle your amenity reservations securely and quickly.</p>
        </div>
      </div>

      <div className="billing-table-wrapper">
        <table className="billing-history-table">
          <thead>
            <tr>
              <th>SERVICE</th>
              <th>LOCATION</th>
              <th>SCHEDULED</th>
              <th>AMOUNT DUE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {unpaidBookings.map((booking) => (
              <tr key={booking.id} className="history-detail-row">
                <td>
                  <div className="history-category-info">
                    <div className="history-category-icon-box service">
                      {getServiceIcon(booking.serviceResource?.service?.serviceName)}
                    </div>
                    <div className="history-category-name" style={{ fontWeight: "700" }}>
                      {booking.serviceResource?.service?.serviceName || "Service"}
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: "600" }}>
                  {booking.serviceResource?.resourceCode || "Building Amenity"}
                </td>
                <td style={{ fontSize: "12px" }}>
                  {formatDateTime(booking.bookFrom)}
                </td>
                <td style={{ fontWeight: "800", color: "#c98b3c" }}>
                  {formatCurrency(booking.totalAmount)}
                </td>
                <td>
                  <button 
                    className="billing-btn" 
                    style={{ background: "linear-gradient(135deg, #c98b3c 0%, #e4bf55 100%)", color: "#1f1b10" }}
                    onClick={() => {
                        // Simulation for payment
                        alert("Proceeding to secure payment for: " + (booking.serviceResource?.service?.serviceName || "Service"));
                    }}
                  >
                    <FaCreditCard style={{ marginRight: "8px" }} /> Pay Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
