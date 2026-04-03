import { useState, useMemo, Fragment } from "react";
import { FaChevronDown, FaChevronUp, FaBolt, FaTint, FaBuilding, FaHistory } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { MONTH_FORMATTER, formatDateTime } from "../../../utils/billingUtils";

export default function PaymentHistory({ payments, formatCurrency, formatDate }) {
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
          sortAt: dateObj.getTime(),
        };
      }
      groups[monthLabel].items.push(p);
      groups[monthLabel].total += Number(p.amount || 0);
    });

    return Object.values(groups).sort((a, b) => b.sortAt - a.sortAt);
  }, [payments]);

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
          usageDate: elec.usageDate,
          paymentDate: bill.paymentDate,
          icon: <FaBolt />,
          iconClass: "electricity",
          subLabel: "Monthly electric consumption",
          unitPrice: elec.unitPrice,
          unitPriceLabel: `${formatCurrency(elec.unitPrice)}/kWh`,
          quantity: elec.quantity,
          quantityLabel: `${elec.quantity.toLocaleString()} kWh`,
          amount: elec.amount,
        });
      }

      if (wat && Number(wat.amount) > 0) {
        rows.push({
          id: `${bill.id}-water`,
          category: "WATER",
          usageDate: wat.usageDate,
          paymentDate: bill.paymentDate,
          icon: <FaTint />,
          iconClass: "water",
          subLabel: "Monthly water consumption",
          unitPrice: wat.unitPrice,
          unitPriceLabel: `${formatCurrency(wat.unitPrice)}/m³`,
          quantity: wat.quantity,
          quantityLabel: `${wat.quantity.toLocaleString()} m³`,
          amount: wat.amount,
        });
      }

      if (mng && Number(mng.amount) > 0) {
        rows.push({
          id: `${bill.id}-mng`,
          category: "MANAGEMENT FEE",
          usageDate: mng.usageDate,
          paymentDate: bill.paymentDate,
          icon: <FaBuilding />,
          iconClass: "management",
          subLabel: "Monthly fixed service charge",
          unitPrice: mng.unitPrice,
          unitPriceLabel: formatCurrency(mng.unitPrice),
          quantity: 1,
          quantityLabel: "Fixed",
          amount: mng.amount,
        });
      }
    } else {
      rows.push({
        id: bill.id,
        category: bill.name || "SERVICE BOOKING",
        usageDate: bill.usageDate,
        paymentDate: bill.paymentDate,
        icon: <FaHistory />,
        iconClass: "service",
        subLabel: bill.description || null,
        unitPrice: bill.unitPrice,
        unitPriceLabel: formatCurrency(bill.unitPrice),
        quantity: bill.quantity || 1,
        quantityLabel: (bill.quantity || 1).toLocaleString(),
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
        <td className="history-usage-date">{formatDateTime(row.usageDate)}</td>
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
                <FaHistory style={{ opacity: 0.5 }} />
                <span>{group.label}</span>
              </div>
              <div className="month-header-summary">
                {!expandedMonths[group.label] && (
                  <div className="month-total-preview">{formatCurrency(group.total)}</div>
                )}
                {expandedMonths[group.label] ? <FaChevronUp /> : <FaChevronDown />}
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
                  <table className="history-detail-table">
                    <thead>
                      <tr>
                        <th>CATEGORY</th>
                        <th>USAGE DATE</th>
                        <th>UNIT PRICE</th>
                        <th>QUANTITY</th>
                        <th style={{ textAlign: "right" }}>AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((bill) => renderDetailedRows(bill))}
                    </tbody>
                  </table>
                  <div className="history-total-footer">
                    <span className="total-footer-label">Total Monthly Paid</span>
                    <span className="total-footer-value">{formatCurrency(group.total)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      ) : (
        <div className="billing-empty-info">
          <p>No payment history recorded.</p>
        </div>
      )}
    </div>
  );
}
