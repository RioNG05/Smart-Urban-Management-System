export default function BillingSummary({ summary, formatCurrency }) {
  return (
    <div className="summary-row">
      <div className="summary-box">
        <div className="summary-label">Have to paid</div>

        <div className="summary-value">
          {formatCurrency(summary.totalDue)}
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-label">Unpaid bills</div>

        <div className="summary-value">{summary.unpaidBills}</div>
      </div>

      <div className="summary-box">
        <div className="summary-label">Total Paid</div>

        <div className="summary-value">
          {formatCurrency(summary.paidThisMonth)}
        </div>
      </div>
    </div>
  );
}
