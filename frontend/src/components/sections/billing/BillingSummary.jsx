export default function BillingSummary() {
  return (
    <div className="summary-row">
      <div className="summary-box">
        <div className="summary-label">Total due</div>

        <div className="summary-value">5,200,000 VND</div>
      </div>

      <div className="summary-box">
        <div className="summary-label">Unpaid bills</div>

        <div className="summary-value">2</div>
      </div>

      <div className="summary-box">
        <div className="summary-label">Paid this month</div>

        <div className="summary-value">850,000 VND</div>
      </div>
    </div>
  );
}
