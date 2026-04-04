import { FaBolt, FaTint, FaBuilding, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { formatCurrency, formatDateTime } from "../../../utils/billingUtils";

export default function BookingHistoryTable({ bookings, loading }) {
  if (loading) {
    return (
      <div className="billing-loading-state">
        <div className="spinner-border" />
        <p>Loading your booking history...</p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="billing-empty-state">
        <FaClock style={{ fontSize: "40px", opacity: 0.2, marginBottom: "15px" }} />
        <p>You haven't made any bookings yet.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (Number(status)) {
      case 1:
        return (
          <span className="history-status-badge paid">
            <FaCheckCircle style={{ marginRight: "6px" }} /> Paid
          </span>
        );
      case 0:
        return (
          <span className="history-status-badge unpaid">
            <FaClock style={{ marginRight: "6px" }} /> Unpaid
          </span>
        );
      default:
        return (
          <span className="history-status-badge pending">
             <FaExclamationCircle style={{ marginRight: "6px" }} /> Pending
          </span>
        );
    }
  };

  const getServiceIcon = (serviceName) => {
    const name = serviceName?.toLowerCase() || "";
    if (name.includes("electric")) return <FaBolt />;
    if (name.includes("water") || name.includes("tint")) return <FaTint />;
    return <FaBuilding />;
  };

  return (
    <div className="billing-table-wrapper">
      <table className="billing-history-table">
        <thead>
          <tr>
            <th>SERVICE</th>
            <th>RESOURCE / LOCATION</th>
            <th>BOOK FROM</th>
            <th>BOOK TO</th>
            <th>TOTAL AMOUNT</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
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
              <td>
                <div style={{ fontWeight: "600" }}>
                    {booking.serviceResource?.resourceCode || `Resource #${booking.serviceResource?.id}`}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.6 }}>
                    {booking.serviceResource?.location || "Building Amenity"}
                </div>
              </td>
              <td style={{ fontSize: "13px" }}>{formatDateTime(booking.bookFrom)}</td>
              <td style={{ fontSize: "13px" }}>{formatDateTime(booking.bookTo)}</td>
              <td style={{ fontWeight: "800", color: "#c89b3c" }}>
                {formatCurrency(booking.totalAmount)}
              </td>
              <td>{getStatusBadge(booking.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
