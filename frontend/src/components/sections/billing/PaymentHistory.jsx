import { useState, useMemo } from "react";
import { FaChevronDown, FaChevronUp, FaBolt, FaTint, FaBuilding, FaHistory, FaCheckCircle, FaExclamationTriangle, FaClock } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { MONTH_FORMATTER } from "../../../utils/billingUtils";

export default function PaymentHistory({ payments, formatCurrency }) {
  const [expandedMonths, setExpandedMonths] = useState({});

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  const groupedPayments = useMemo(() => {
    const groups = {};
    payments.forEach((p) => {
      const dateObj = p.dueDate ? new Date(p.dueDate) : new Date();
      const monthLabel = MONTH_FORMATTER.format(dateObj);
      if (!groups[monthLabel]) {
        groups[monthLabel] = {
          label: monthLabel,
          items: [],
          total: 0,
          statusKey: p.statusKey,
          statusLabel: p.statusLabel,
          sortAt: dateObj.getTime(),
        };
      }
      groups[monthLabel].items.push(p);
      groups[monthLabel].total += Number(p.amount || 0);
      
      // If any item in the month is unpaid, mark the whole month as unpaid/pending if needed
      // But usually month-grouped payments represent a single invoice anyway
      if (p.statusKey !== 'paid') {
        groups[monthLabel].statusKey = p.statusKey;
        groups[monthLabel].statusLabel = p.statusLabel;
      }
    });

    return Object.values(groups).sort((a, b) => b.sortAt - a.sortAt);
  }, [payments]);

  const getStatusIcon = (statusKey) => {
    if (statusKey === 'paid') return <FaCheckCircle className="status-icon paid" />;
    if (statusKey === 'overdue') return <FaExclamationTriangle className="status-icon overdue" />;
    return <FaClock className="status-icon pending" />;
  };

  const renderDetailedRows = (bill) => {
    const rows = [];

    if (bill.source === "utility") {
      const elec = bill.utilityDetails?.electricity;
      const wat = bill.utilityDetails?.water;
      const mng = bill.utilityDetails?.management;

      if (elec && Number(elec.amount) > 0) {
        rows.push({
          id: `${bill.id}-elec`,
          category: "ELECTRICITY",
          icon: <FaBolt />,
          iconClass: "electricity",
          subLabel: `Prev: ${elec.previousReading?.toLocaleString() ?? 0} kWh | Curr: ${elec.currentReading?.toLocaleString() ?? 0} kWh`,
          unitPriceLabel: `${formatCurrency(elec.unitPrice)}/kWh`,
          quantityLabel: `${elec.quantity.toLocaleString()} kWh`,
          amount: elec.amount,
        });
      }

      if (wat && Number(wat.amount) > 0) {
        rows.push({
          id: `${bill.id}-water`,
          category: "WATER",
          icon: <FaTint />,
          iconClass: "water",
          subLabel: `Prev: ${wat.previousReading?.toLocaleString() ?? 0} m³ | Curr: ${wat.currentReading?.toLocaleString() ?? 0} m³`,
          unitPriceLabel: `${formatCurrency(wat.unitPrice)}/m³`,
          quantityLabel: `${wat.quantity.toLocaleString()} m³`,
          amount: wat.amount,
        });
      }

      if (mng && Number(mng.amount) > 0) {
        rows.push({
          id: `${bill.id}-mng`,
          category: "MANAGEMENT FEE",
          icon: <FaBuilding />,
          iconClass: "management",
          subLabel: "Monthly fixed service charge",
          unitPriceLabel: "N/A",
          quantityLabel: "Fixed",
          amount: mng.amount,
        });
      }
    } else {
      rows.push({
        id: bill.id,
        category: (bill.name || "SERVICE BOOKING").toUpperCase(),
        icon: <FaHistory />,
        iconClass: "service",
        subLabel: bill.description || "Personal service request",
        unitPriceLabel: formatCurrency(bill.unitPrice),
        quantityLabel: `${(bill.quantity || 1).toLocaleString()} request`,
        amount: bill.amount,
      });
    }

    return rows.map((row) => (
      <tr key={row.id} className="history-detail-row">
        <td>
          <div className="history-category-info">
            <div className={`history-category-icon-box ${row.iconClass}`}>
              {row.icon}
            </div>
            <div>
              <div className="history-category-name">{row.category}</div>
              {row.subLabel && <div className="history-category-sub">{row.subLabel}</div>}
            </div>
          </div>
        </td>
        <td className="history-unit-price">{row.unitPriceLabel}</td>
        <td className="history-quantity">{row.quantityLabel}</td>
        <td className="history-amount-cell">{formatCurrency(row.amount)}</td>
      </tr>
    ));
  };

  return (
    <div className="payment-history-container">
      {groupedPayments.length > 0 ? (
        groupedPayments.map((group) => (
          <div key={group.label} className="history-month-group">
            <div
              className={`history-month-header ${expandedMonths[group.label] ? "expanded" : ""}`}
              onClick={() => toggleMonth(group.label)}
            >
              <div className="month-header-title">
                <FaHistory className="history-icon-main" />
                <span>{group.label}</span>
                <div className={`status-badge-mini ${group.statusKey}`}>
                  {getStatusIcon(group.statusKey)}
                  {group.statusLabel}
                </div>
              </div>
              <div className="month-header-summary">
                <div className="month-total-preview">{formatCurrency(group.total)}</div>
                <div className="expand-icon-box">
                   {expandedMonths[group.label] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedMonths[group.label] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="history-detail-content"
                >
                  <div className="history-table-wrapper">
                    <table className="history-detail-table">
                      <thead>
                        <tr>
                          <th>CATEGORY</th>
                          <th>UNIT PRICE</th>
                          <th>USAGE / QUANTITY</th>
                          <th style={{ textAlign: "right" }}>TOTAL PAYABLE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((bill) => renderDetailedRows(bill))}
                      </tbody>
                    </table>
                  </div>
                  <div className="history-total-footer">
                    <span className="total-footer-label">Total Amount</span>
                    <span className="total-footer-value">{formatCurrency(group.total)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      ) : (
        <div className="billing-empty-info" style={{ padding: "60px 0" }}>
          <p>No historical invoices found before this month.</p>
        </div>
      )}
    </div>
  );
}
