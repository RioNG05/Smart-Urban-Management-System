import React, { useState, useMemo } from "react";
import { FaRegSquare, FaRegCheckSquare } from "react-icons/fa";

export default function CurrentMonthInvoice({ bills, formatCurrency, formatDate }) {
  const [selected, setSelected] = useState([]);

  // Get most recent unpaid bills month
  const unpaidBills = bills.filter(b => b.statusKey !== 'paid');

  const latestMonthKey = useMemo(() => {
    if (unpaidBills.length === 0) return null;
    return unpaidBills[0].monthKey;
  }, [unpaidBills]);

  const currentMonthBills = unpaidBills.filter(b => b.monthKey === latestMonthKey);

  const utilityBills = currentMonthBills.filter(b => b.source === "utility");
  const serviceBills = currentMonthBills.filter(b => b.source === "service");

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const isSelected = (id) => selected.includes(id);

  if (currentMonthBills.length === 0) {
    return (
      <div className="bg-white rounded shadow-sm p-5 text-center text-muted">
        No pending invoices for the current billing cycle.
      </div>
    );
  }

  const invoiceDate = currentMonthBills[0].dueDate;

  const totalAmount = currentMonthBills.reduce((sum, b) => sum + b.amount, 0);
  const selectedAmount = currentMonthBills
    .filter(b => selected.includes(b.id))
    .reduce((sum, b) => sum + b.amount, 0);

  const utilityTotalRaw = utilityBills.reduce((sum, b) => sum + b.amount, 0);
  const serviceTotal = serviceBills.reduce((sum, b) => sum + b.amount, 0);

  // Adding 500k flat management per utility bill.
  const staticManagementFee = 500000;
  const utilityTotal = utilityTotalRaw + (utilityBills.length * staticManagementFee);
  const globalTotal = totalAmount + (utilityBills.length * staticManagementFee);

  const selectedUtilityCount = utilityBills.filter(u => selected.includes(u.id)).length;
  const globalSelected = selectedAmount + (selectedUtilityCount * staticManagementFee);
  const globalUnpaid = globalTotal - globalSelected;

  return (
    <div className="bg-white p-4 p-md-5 mb-4" style={{ width: "100%", margin: '0 auto', border: '5px solid #2e7d32', borderRadius: '12px' }}>
      <h2 className="fs-1 text-dark mb-1" style={{ fontWeight: '600' }}>Monthly Invoice</h2>
      <p className="fs-5 text-dark mb-2">Mandatory Invoice</p>
      <p className="small text-dark mb-4 fw-medium">
        Invoice Date: {formatDate(invoiceDate)}
      </p>

      {/* Utility / Mandatory Section */}
      <div className="mb-4">
        {utilityBills.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
              <thead>
                <tr className="border-bottom border-dark fw-bold">
                  <th style={{ width: '40px' }} className="py-2"></th>
                  <th className="py-2 fw-normal">Name</th>
                  <th className="py-2 fw-normal">Detail</th>
                  <th className="py-2 fw-normal">Value</th>
                  <th className="py-2 fw-normal">Measurement</th>
                  <th className="py-2 fw-normal text-end">Price</th>
                </tr>
              </thead>
              <tbody>
                {utilityBills.map((bill) => {
                  const details = bill.utilityDetails ? Object.values(bill.utilityDetails) : [];
                  return (
                    <React.Fragment key={bill.id}>
                      <tr>
                        <td rowSpan={details.length + 2} className="align-top pt-3">
                          <div style={{ cursor: 'pointer', fontSize: '1.4rem' }} onClick={() => toggleSelect(bill.id)}>
                            {isSelected(bill.id) ? <FaRegCheckSquare className="text-dark" /> : <FaRegSquare className="text-dark" />}
                          </div>
                        </td>
                        <td rowSpan={details.length + 2} className="align-top pt-3 text-dark fs-6" style={{ width: '150px' }}>
                          {bill.name}
                        </td>
                      </tr>
                      {details.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-1 text-dark">{item.label}</td>
                          <td className="py-1 text-dark">{Number(item.usage).toLocaleString()}</td>
                          <td className="py-1 text-dark">{item.unit === 'm3' ? 'M3' : 'kWh'}</td>
                          <td className="py-1 text-dark text-end">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="py-1 text-dark">Management</td>
                        <td className="py-1 text-dark">1</td>
                        <td className="py-1 text-dark">Month</td>
                        <td className="py-1 text-dark text-end">{formatCurrency(staticManagementFee)}</td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            <div className="d-flex justify-content-between text-dark py-2 px-2 fw-bold" style={{ borderBottom: '2px solid #000' }}>
              <span>TOTAL AMOUNT</span>
              <span>{formatCurrency(utilityTotal)}</span>
            </div>
          </div>
        ) : (
          <p className="text-muted fst-italic small">No mandatory invoices.</p>
        )}
      </div>

      <p className="fs-5 text-dark mb-4 mt-5">Service Invoice</p>

      {/* Service Invoice Section */}
      <div className="mb-5">
        {serviceBills.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
              <thead>
                <tr className="border-bottom border-dark fw-bold">
                  <th style={{ width: '40px' }} className="py-2"></th>
                  <th className="py-2">Name</th>
                  <th className="py-2 text-start">Booking date</th>
                  <th className="py-2 text-center">Price</th>
                </tr>
              </thead>
              <tbody>
                {serviceBills.map((bill) => (
                  <tr key={bill.id} className="border-bottom border-secondary-subtle">
                    <td className="py-3 ">
                      <div style={{ cursor: 'pointer', fontSize: '1.4rem' }} onClick={() => toggleSelect(bill.id)}>
                        {isSelected(bill.id) ? <FaRegCheckSquare className="text-dark" /> : <FaRegSquare className="text-dark" />}
                      </div>
                    </td>
                    <td className="py-3 text-dark">{bill.name}</td>
                    <td className="py-3 text-dark text-start">{formatDate(bill.dueDate)}</td>
                    <td className="py-3 text-dark text-center">{formatCurrency(bill.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between text-dark py-3 px-2 fw-bold fs-5 border-top border-dark" style={{ borderBottom: '2px solid #000' }}>
              <span>TOTAL AMOUNT</span>
              <span style={{ color: "#2e7d32" }} >{formatCurrency(serviceTotal)}</span>
            </div>
          </div>
        ) : (
          <p className="text-muted fst-italic small mb-0">No service invoices.</p>
        )}
      </div>

      {/* Final Totals & Actions */}
      <div className="mt-5 pt-3 fw-bold">
        <div className="d-flex justify-content-between mb-3 text-dark fs-5">
          <span>Total Amount: </span>
          <span style={{ color: "#2e7d32" }}>{formatCurrency(globalTotal)}</span>
        </div>
        <div className="d-flex justify-content-between mb-3 text-dark fs-5">
          <span>Total Selected: </span>
          <span style={{ color: "#2e7d32" }}>{formatCurrency(globalSelected)}</span>
        </div>
        <div className="d-flex justify-content-between mb-4 text-dark fs-5">
          <span>Unpaid Amount: </span>
          <span style={{ color: "#d32f2f" }}>{formatCurrency(globalUnpaid)}</span>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            className="btn px-4 py-2 fw-semibold shadow-sm text-white"
            disabled={selected.length === 0}
            style={{ backgroundColor: selected.length === 0 ? '#9ca3af' : '#2e7d32', border: 'none' }}
          >
            Pay Selected Bills
          </button>
        </div>
      </div>
    </div>
  );
}
