import { FaCheckSquare, FaRegSquare } from "react-icons/fa";

export default function BillingTable({
  bills,
  formatCurrency,
  formatDate,
  loading,
  selectedIds,
  onToggleBill,
  onToggleSubItem,
  totalSelected,
  isService = false,
}) {
  const formatReading = (value, unit) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "N/A";
    }

    return `${Number(value).toLocaleString("vi-VN", {
      maximumFractionDigits: 2,
    })} ${unit}`;
  };

  const isSubItemSelected = (billId, category) => {
    return selectedIds.includes(`${billId}:${category}`);
  };

  const getBillCategories = (bill) => {
    if (bill.source === "service") return ["service"];
    const cats = [];
    if (bill.utilityDetails?.electricity) cats.push("electricity");
    if (bill.utilityDetails?.water) cats.push("water");
    if (bill.managementFee > 0) cats.push("management");
    return cats;
  };

  const isWholeBillSelected = (bill) => {
    const cats = getBillCategories(bill);
    if (cats.length === 0) return false;
    return cats.every(cat => isSubItemSelected(bill.id, cat));
  };

  const isPartiallySelected = (bill) => {
    const cats = getBillCategories(bill);
    const selectedCount = cats.filter(cat => isSubItemSelected(bill.id, cat)).length;
    return selectedCount > 0 && selectedCount < cats.length;
  };

  return (
    <div className="bill-table">
      <table>
        <thead>
          <tr>
            <th style={{ width: "50px", textAlign: "center" }}>Select</th>
            <th>Bill Information</th>
            {!isService && <th>Usage Details</th>}
            {!isService && <th>Due Date</th>}
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
            bills.map((bill) => {
              const categories = getBillCategories(bill);
              const isSelected = isWholeBillSelected(bill);
              const isPartial = isPartiallySelected(bill);

              return (
                <tr key={bill.id} className={isSelected || isPartial ? "row-selected" : ""}>
                  <td style={{ textAlign: "center" }}>
                    <div 
                      style={{ 
                        cursor: bill.statusKey === "paid" ? "not-allowed" : "pointer",
                        color: isSelected ? "var(--primary-color)" : isPartial ? "var(--primary-color)" : "#ccc",
                        fontSize: "1.1rem",
                        opacity: isPartial ? 0.7 : 1
                      }}
                      onClick={() => bill.statusKey !== "paid" && onToggleBill(bill.id, categories)}
                    >
                      {isSelected ? <FaCheckSquare /> : isPartial ? <FaCheckSquare style={{ opacity: 0.5 }} /> : <FaRegSquare />}
                    </div>
                  </td>
                  <td style={{ fontWeight: "600", color: "var(--text-dark)" }}>
                    {bill.name}
                  </td>

                  {!isService && (
                    <td>
                      {bill.source === "utility" && bill.utilityDetails ? (
                        <div className="utility-breakdown">
                          {bill.utilityDetails.electricity && (
                            <div className={`utility-item-row ${isSubItemSelected(bill.id, "electricity") ? "active" : ""}`}>
                              <div 
                                className="sub-item-check"
                                onClick={() => bill.statusKey !== "paid" && onToggleSubItem(bill.id, "electricity")}
                              >
                                {isSubItemSelected(bill.id, "electricity") ? <FaCheckSquare /> : <FaRegSquare />}
                              </div>
                              <div className="utility-item-content">
                                <div className="utility-header">
                                  <span>Electricity</span>
                                  <span className="item-amount">{formatCurrency(bill.utilityDetails.electricity.amount)}</span>
                                </div>
                                <div className="utility-meta">
                                  <span>Prev: {formatReading(bill.utilityDetails.electricity.previousReading, "kWh")}</span>
                                  <span>Curr: {formatReading(bill.utilityDetails.electricity.currentReading, "kWh")}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {bill.utilityDetails.water && (
                            <div className={`utility-item-row ${isSubItemSelected(bill.id, "water") ? "active" : ""}`}>
                              <div 
                                className="sub-item-check"
                                onClick={() => bill.statusKey !== "paid" && onToggleSubItem(bill.id, "water")}
                              >
                                {isSubItemSelected(bill.id, "water") ? <FaCheckSquare /> : <FaRegSquare />}
                              </div>
                              <div className="utility-item-content">
                                <div className="utility-header">
                                  <span>Water</span>
                                  <span className="item-amount">{formatCurrency(bill.utilityDetails.water.amount)}</span>
                                </div>
                                <div className="utility-meta">
                                  <span>Prev: {formatReading(bill.utilityDetails.water.previousReading, "m3")}</span>
                                  <span>Curr: {formatReading(bill.utilityDetails.water.currentReading, "m3")}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {bill.managementFee > 0 && (
                            <div className={`utility-item-row ${isSubItemSelected(bill.id, "management") ? "active" : ""}`}>
                              <div 
                                className="sub-item-check"
                                onClick={() => bill.statusKey !== "paid" && onToggleSubItem(bill.id, "management")}
                              >
                                {isSubItemSelected(bill.id, "management") ? <FaCheckSquare /> : <FaRegSquare />}
                              </div>
                              <div className="utility-item-content">
                                <div className="utility-header">
                                  <span>Management Fee</span>
                                  <span className="item-amount">{formatCurrency(bill.managementFee)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : bill.source === "service" ? (
                         <div className={`utility-item-row ${isSubItemSelected(bill.id, "service") ? "active" : ""}`}>
                          <div 
                            className="sub-item-check"
                            onClick={() => bill.statusKey !== "paid" && onToggleSubItem(bill.id, "service")}
                          >
                            {isSubItemSelected(bill.id, "service") ? <FaCheckSquare /> : <FaRegSquare />}
                          </div>
                          <div className="utility-item-content">
                            <div className="utility-header">
                              <span>{bill.title || "Service Booking"}</span>
                              <span className="item-amount">{formatCurrency(bill.amount)}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="billing-muted">No details available</span>
                      )}
                    </td>
                  )}

                  {!isService && <td>{formatDate(bill.dueDate)}</td>}

                  <td style={{ fontWeight: "700", color: "var(--text-dark)" }}>
                    {formatCurrency(bill.amount + (bill.managementFee || 0))}
                  </td>

                  <td>
                    <span className={`status-badge status-${bill.statusKey}`}>
                      {bill.statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={isService ? "4" : "6"} className="billing-empty">
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                  No records found for this period.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}
