export default function PaymentHistory({
  payments,
  formatCurrency,
  formatDate,
}) {
  return (
    <div className="payment-history">
      <h3 className="section-title">Payment History</h3>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Method</th>
          </tr>
        </thead>

        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.id}>
                <td>{formatDate(payment.date)}</td>

                <td>{formatCurrency(payment.amount)}</td>

                <td>{payment.method}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="billing-empty">
                No payment history yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
