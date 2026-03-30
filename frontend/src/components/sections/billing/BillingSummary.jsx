export default function BillingSummary({ summary, formatCurrency }) {
  return (
    <div className="summary-row">
      <div className="summary-box">
        <div className="summary-label">Total due</div>

        <div className="summary-value">
          {formatCurrency(summary.totalDue)}
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-label">Unpaid bills</div>

        <div className="summary-value">{summary.unpaidBills}</div>
      </div>

      <div className="summary-box">
        <div className="summary-label">Paid this month</div>

        <div className="summary-value">
          {formatCurrency(summary.paidThisMonth)}
        </div>
      </div>
    </div>
  );
}
