import { useEffect, useState } from "react";
import BillingPagination from "./BillingPagination";

export default function BillingTable({
  bills,
  formatCurrency,
  formatDate,
  loading,
  showPaymentAction = true,
}) {
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const formatReading = (value, unit) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "N/A";
    }

    return `${Number(value).toLocaleString("vi-VN", {
      maximumFractionDigits: 2,
    })} ${unit}`;
  };

  useEffect(() => {
    setSelected([]);
    setCurrentPage(1);
  }, [bills]);

  const toggle = (billId) => {
    setSelected((current) =>
      current.includes(billId)
        ? current.filter((id) => id !== billId)
        : [...current, billId]
    );
  };

  const total = bills
    .filter((bill) => selected.includes(bill.id) && bill.statusKey !== "paid")
    .reduce((sum, bill) => sum + bill.amount, 0);

  const totalPages = Math.ceil(bills.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBills = bills.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="admin-table-wrapper mb-3 border rounded shadow-sm">
        <table className="admin-custom-table align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: "50px", textAlign: "center" }}>
                Select
              </th>
              <th>Bill Name</th>
              <th>Details</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Loading billing data...
                </td>
              </tr>
            ) : currentBills.length > 0 ? (
              currentBills.map((bill) => (
                <tr key={bill.id}>
                  <td style={{ textAlign: "center" }}>
                    <input
                      className="form-check-input"
                      style={{ cursor: "pointer" }}
                      type="checkbox"
                      checked={selected.includes(bill.id)}
                      disabled={bill.statusKey === "paid"}
                      onChange={() => toggle(bill.id)}
                    />
                  </td>

                  <td className="fw-semibold">{bill.name}</td>

                  <td>
                    {bill.source === "utility" && bill.utilityDetails ? (
                      <div className="permission-tags d-flex flex-column gap-1">
                        {Object.values(bill.utilityDetails).map((item) => {
                          const isElectric = item.label.toLowerCase().includes("electric");
                          const badgeClass = isElectric ? "badge-warning text-dark" : "badge-info text-dark";

                          return (
                            <div key={item.label} className="d-flex align-items-center gap-2" style={{ fontSize: '13px' }}>
                              <span className={`badge ${badgeClass} text-uppercase text-start`} style={{ width: '90px' }}>
                                {item.label}
                              </span>
                              <span className="text-dark fw-medium">
                                {formatReading(item.usage, item.unit)}
                              </span>
                            </div>
                          );
                        })}
                        {/* Static Management Fee for UI purposes */}
                        <div className="d-flex align-items-center gap-2 mt-1" style={{ fontSize: '13px' }}>
                          <span className={`badge bg-secondary text-uppercase text-start`} style={{ width: '90px' }}>
                            Management
                          </span>
                          <span className="text-dark fw-medium">
                            1 Month
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted fst-italic" style={{ fontSize: '13px' }}>
                        No usage details
                      </span>
                    )}
                  </td>

                  <td>{formatDate(bill.dueDate)}</td>

                  <td className="fw-bold text-danger">{formatCurrency(bill.amount)}</td>

                  <td>
                    <span className={`status-badge ${bill.statusKey === 'paid' ? 'active' : 'locked'}`}>
                      {bill.statusLabel}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted fst-italic">
                  No records to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BillingPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={bills.length}
        pageSize={ITEMS_PER_PAGE}
        itemLabel="bills"
      />

      {showPaymentAction && bills.some(bill => bill.statusKey !== 'paid') && (
        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <div className="fs-5 fw-bold text-dark">
            Total Selected: <span className="text-danger ms-2">{formatCurrency(total)}</span>
          </div>

          <button
            className="btn px-4 py-2 fw-semibold shadow-sm text-white"
            disabled={selected.length === 0}
            style={{ backgroundColor: selected.length === 0 ? '#9ca3af' : '#2e7d32', border: 'none' }}
          >
            Pay Selected Bills ({selected.length})
          </button>
        </div>
      )}
    </>
  );
}
