const payments = [
  { id: 1, date: "Mar 5", amount: "700,000 VND", method: "Bank Transfer" },
  { id: 2, date: "Feb 28", amount: "5,000,000 VND", method: "Credit Card" },
  { id: 3, date: "Feb 10", amount: "150,000 VND", method: "Momo" },
];

export default function PaymentHistory() {
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
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.date}</td>

              <td>{p.amount}</td>

              <td>{p.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
