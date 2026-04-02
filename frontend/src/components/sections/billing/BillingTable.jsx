import { useState } from "react";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";

export default function BillingTable({
  bills,
  formatCurrency,
  formatDate,
  loading,
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatReading = (value, unit) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "N/A";
    }

    return `${Number(value).toLocaleString("vi-VN", {
      maximumFractionDigits: 2,
    })} ${unit}`;
  };

  const calculateTotalSelected = () => {
    return bills
      .filter(b => selectedIds.includes(b.id))
      .reduce((sum, b) => sum + b.amount + (b.managementFee || 0), 0);
  };

  return (
    <div className="bill-table">
      <table>
        <thead>
          <tr>
            <th style={{ width: "50px", textAlign: "center" }}>Select</th>
            <th>Bill Information</th>
            <th>Usage Details</th>
            <th>Due Date</th>
            <th>Total Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="billing-empty">
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                  Loading billing records...
                </div>
              </td>
            </tr>
          ) : bills.length > 0 ? (
            bills.map((bill) => (
              <tr key={bill.id}>
                <td style={{ textAlign: "center" }}>
                  <div 
                    style={{ 
                      cursor: bill.statusKey === "paid" ? "not-allowed" : "pointer",
                      color: selectedIds.includes(bill.id) ? "var(--primary-color)" : "#ccc",
                      fontSize: "1.1rem"
                    }}
                    onClick={() => bill.statusKey !== "paid" && toggleSelection(bill.id)}
                  >
                    {selectedIds.includes(bill.id) ? <FaCheckSquare /> : <FaRegSquare />}
                  </div>
                </td>
                <td style={{ fontWeight: "600", color: "var(--text-dark)" }}>
                  {bill.name}
                </td>

                <td>
                  {bill.source === "utility" && bill.utilityDetails ? (
                    <div className="utility-breakdown">
                      {Object.values(bill.utilityDetails).map((item) => (
                        <div key={item.label} className="utility-item">
                          <div className="utility-header">
                            <span>{item.label}</span>
                            <span style={{ color: "var(--primary-color)" }}>
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                          <div className="utility-meta">
                            <span>Prev: {formatReading(item.previousReading, item.unit)}</span>
                            <span>Curr: {formatReading(item.currentReading, item.unit)}</span>
                          </div>
                        </div>
                      ))}
                      {bill.managementFee > 0 && (
                        <div className="utility-item">
                           <div className="utility-header">
                            <span>Management Fee</span>
                            <span style={{ color: "var(--primary-color)" }}>
                              {formatCurrency(bill.managementFee)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="billing-muted">No details available</span>
                  )}
                </td>

                <td>{formatDate(bill.dueDate)}</td>

                <td style={{ fontWeight: "700", color: "var(--text-dark)" }}>
                  {formatCurrency(bill.amount + (bill.managementFee || 0))}
                </td>

                <td>
                  <span className={`status-badge status-${bill.statusKey}`}>
                    {bill.statusLabel}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="billing-empty">
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                  No records found for this period.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedIds.length > 0 && (
        <div className="table-footer-action">
          <div className="selected-summary">
             Total Selected ({selectedIds.length}): <strong>{formatCurrency(calculateTotalSelected())}</strong>
          </div>
          <button className="billing-btn primary">Pay Selected</button>
        </div>
      )}
    </div>
  );
}
