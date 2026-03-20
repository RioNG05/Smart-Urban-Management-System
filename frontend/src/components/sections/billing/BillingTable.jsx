import { useState } from "react";

const billsData = [
  { id: 1, name: "Rent", due: "Mar 30", amount: 5000000, status: "unpaid" },
  { id: 2, name: "Electricity", due: "Mar 28", amount: 700000, status: "paid" },
  { id: 3, name: "Water", due: "Mar 28", amount: 200000, status: "unpaid" },
  { id: 4, name: "Parking", due: "Mar 30", amount: 150000, status: "paid" },
];

export default function BillingTable() {
  const [selected, setSelected] = useState([]);

  const toggle = (bill) => {
    if (selected.includes(bill.id)) {
      setSelected(selected.filter((id) => id !== bill.id));
    } else {
      setSelected([...selected, bill.id]);
    }
  };

  const total = billsData
    .filter((b) => selected.includes(b.id))
    .reduce((sum, b) => sum + b.amount, 0);

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
            {billsData.map((bill) => (
              <tr key={bill.id}>
                <td>
                  <input type="checkbox" onChange={() => toggle(bill)} />
                </td>

                <td>{bill.name}</td>

                <td>{bill.due}</td>

                <td>{bill.amount.toLocaleString()} VND</td>

                <td>
                  <span className={`status ${bill.status}`}>{bill.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="payment-container">
        <div className="total-price">Total: {total.toLocaleString()} VND</div>

        <button className="pay-button">Pay Selected Bills</button>
      </div>
    </>
  );
}
