import { 
  FaBolt, FaTint, FaBuilding, FaUmbrella, FaTools, FaParking, FaLeaf, 
  FaShoppingCart, FaChild, FaDumbbell, FaGraduationCap, FaHamburger, 
  FaTableTennis, FaGolfBall, FaSpa, FaUsers, FaClock, FaCheckCircle, FaTimesCircle,
  FaCheckSquare, FaRegSquare 
} from "react-icons/fa";
import { formatCurrency, formatDateTime, getServiceIcon } from "../../../utils/billingUtils";

const IconMap = {
  FaBolt, FaTint, FaBuilding, FaUmbrella, FaTools, FaParking, FaLeaf, 
  FaShoppingCart, FaChild, FaDumbbell, FaGraduationCap, FaHamburger, 
  FaTableTennis, FaGolfBall, FaSpa, FaUsers
};

export default function ServiceActivity({ bookings, selectedIds = [], onToggleBill, onToggleAll }) {
  const renderIcon = (serviceName) => {
    const iconName = getServiceIcon(serviceName);
    const IconComp = IconMap[iconName] || FaBuilding;
    return <IconComp />;
  };

  const getBookingStatusBadge = (statusKey, label) => {
    const classMap = {
      approved: "status-badge-mini paid",
      denied: "status-badge-mini overdue",
      pending: "status-badge-mini pending"
    };
    const iconMap = {
      approved: <FaCheckCircle />,
      denied: <FaTimesCircle />,
      pending: <FaClock />
    };
    return (
      <div className={classMap[statusKey] || "status-badge-mini"}>
        {iconMap[statusKey]}
        <span>{label}</span>
      </div>
    );
  };

  const getPaymentStatusBadge = (statusKey, label) => {
    const classMap = {
      paid: "status-badge-mini paid",
      unpaid: "status-badge-mini pending"
    };
    const iconMap = {
      paid: <FaCheckCircle />,
      unpaid: <FaClock />
    };
    return (
      <div className={classMap[statusKey] || "status-badge-mini"}>
        {iconMap[statusKey]}
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="service-activity-container">
      <div className="history-table-wrapper" style={{ borderRadius: '16px', border: '1px solid #f1f5f9', maxHeight: '420px', overflowY: 'auto' }}>
        <table className="history-detail-table" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 20, background: '#f8fafc', boxShadow: '0 1px 0 #e2e8f0' }}>
            <tr>
              <th style={{ width: '30px', textAlign: 'center' }}>
                <div 
                  className="header-checkbox" 
                  style={{ 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#94a3b8',
                    fontSize: '1rem'
                  }}
                  onClick={onToggleAll}
                  title="Select All Unpaid"
                >
                  {(() => {
                    const eligible = bookings.filter(b => b.paymentStatusKey === "unpaid" && b.bookingStatusKey === "approved");
                    const allSel = eligible.length > 0 && eligible.every(b => selectedIds.includes(`${b.id}:service`));
                    return allSel ? <FaCheckSquare style={{ color: 'var(--primary-color)' }} /> : <FaRegSquare />;
                  })()}
                </div>
              </th>
              <th style={{ width: '18%' }}>SERVICE</th>
              <th style={{ width: '12%' }}>UNIT PRICE</th>
              <th style={{ width: '15%' }}>BOOK AT</th>
              <th style={{ width: '13%' }}>BOOK FROM</th>
              <th style={{ width: '13%' }}>BOOK TO</th>
              <th style={{ width: '12%' }}>TOTAL AMOUNT</th>
              <th style={{ width: '9%', textAlign: 'center' }}>BOOKING</th>
              <th style={{ width: '9%', textAlign: 'center' }}>PAYMENT</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((item) => {
                const isPayable = item.paymentStatusKey === "unpaid" && item.bookingStatusKey === "approved";
                const isSelected = selectedIds.includes(`${item.id}:service`);
                
                return (
                  <tr key={item.id} className={`history-detail-row ${isSelected ? "row-selected" : ""}`}>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', width: '30px' }}>
                        <div 
                          style={{ 
                            cursor: !isPayable ? "not-allowed" : "pointer",
                            color: isSelected ? "var(--primary-color)" : "#ccc",
                            opacity: !isPayable ? 0.4 : 1,
                            fontSize: "1.1rem",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                          onClick={() => isPayable && onToggleBill(item.id, ["service"])}
                        >
                          {isSelected ? <FaCheckSquare /> : <FaRegSquare />}
                        </div>
                    </td>
                    <td>
                    <div className="history-category-info">
                      <div>
                        <div className="history-category-name" style={{ fontWeight: '700', color: '#1e293b' }}>
                          {typeof item.name === 'string' ? item.name.toUpperCase() : "SERVICE"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="history-unit-price">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{formatCurrency(item.unitPrice)}</span>
                      {typeof item.unitType === 'string' && item.unitType && (
                        <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                          / {item.unitType.toLowerCase()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="history-book-at" style={{ fontSize: '11px', color: '#64748b' }}>{formatDateTime(item.createdAt)}</td>
                  <td className="history-usage-date" style={{ fontSize: '11px' }}>{formatDateTime(item.bookFrom || item.usageDate)}</td>
                  <td className="history-usage-date" style={{ fontSize: '11px' }}>{formatDateTime(item.bookTo || item.dueDate)}</td>
                  <td className="history-amount-cell" style={{ textAlign: 'left' }}>{formatCurrency(item.amount)}</td>
                  <td style={{ textAlign: 'center' }}>
                    {getBookingStatusBadge(item.bookingStatusKey, item.bookingStatusLabel)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {getPaymentStatusBadge(item.paymentStatusKey, item.paymentStatusLabel)}
                  </td>
                </tr>
              );
            })
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                   No service activity records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
