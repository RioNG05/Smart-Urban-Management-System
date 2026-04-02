import { FaWallet, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

export default function BillingSummary({ summary, formatCurrency }) {
  return (
    <div className="billing-summary">
      <div className="summary-box">
        <div className="summary-icon">
          <FaWallet />
        </div>
        <div className="summary-details">
          <div className="summary-label">Total Outstanding</div>
          <div className="summary-value" style={{ color: "var(--primary-color)" }}>
            {formatCurrency(summary.totalDue)}
          </div>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-icon" style={{ background: "#fef2f2", color: "#ef4444" }}>
          <FaExclamationTriangle />
        </div>
        <div className="summary-details">
          <div className="summary-label">Unpaid Bills</div>
          <div className="summary-value">{summary.unpaidBills}</div>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-icon" style={{ background: "#ecfdf5", color: "#10b981" }}>
          <FaCheckCircle />
        </div>
        <div className="summary-details">
          <div className="summary-label">Paid This Month</div>
          <div className="summary-value">
            {formatCurrency(summary.paidThisMonth)}
          </div>
        </div>
      </div>
    </div>
  );
}
