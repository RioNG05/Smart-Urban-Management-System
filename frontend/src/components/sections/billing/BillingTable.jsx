import { useEffect, useState } from "react";

export default function BillingTable({
  bills,
  formatCurrency,
  formatDate,
  loading,
}) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
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

  return (
    <>
      <div className="bill-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Bill</th>
              <th>Due date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="billing-empty">
                  Loading billing data...
                </td>
              </tr>
            ) : bills.length > 0 ? (
              bills.map((bill) => (
                <tr key={bill.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(bill.id)}
                      disabled={bill.statusKey === "paid"}
                      onChange={() => toggle(bill.id)}
                    />
                  </td>

                  <td>{bill.name}</td>

                  <td>{formatDate(bill.dueDate)}</td>

                  <td>{formatCurrency(bill.amount)}</td>

                  <td>
                    <span className={`status ${bill.statusKey}`}>
                      {bill.statusLabel}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="billing-empty">
                  No bills found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="payment-container">
        <div className="total-price">Total: {formatCurrency(total)}</div>

        <button className="pay-button" disabled>
          Pay Selected Bills
        </button>
      </div>
    </>
  );
}
