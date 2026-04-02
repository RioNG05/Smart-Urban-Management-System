import React, { useState } from "react";
import { FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { isPreviousMonth } from "../../../utils/billingUtils";
import InvoiceSidebar from "./InvoiceSidebar";

export default function CurrentMonthInvoice({ bills, formatCurrency, formatDate }) {
  const [selected, setSelected] = useState([]);

  const unpaidBills = bills.filter(b => b.statusKey !== 'paid');
  
  // "exactly 1 month ago" relative to the current local date using createdAt
  const currentMonthBills = bills.filter(b => {
    if (b.statusKey === 'paid') return false;
    if (!b.createdAt) return false;
    return isPreviousMonth(new Date(b.createdAt));
  });

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

  const selectedBills = currentMonthBills.filter(b => selected.includes(b.id));

  return (
    <div className="row g-4 mb-4">
      {/* Tables Column */}
      <div className="col-12 col-lg-9">
        <div className="bg-white p-4 p-md-5 h-100" style={{ border: '5px solid #2e7d32', borderRadius: '12px' }}>
          <h2 className="fs-1 text-dark mb-1" style={{ fontWeight: '600' }}>Monthly Invoice</h2>
          <p className="fs-5 text-dark mb-2">Mandatory Invoice</p>
          <p className="small text-dark mb-4 fw-medium">
            Invoice Date: {invoiceDate ? formatDate(invoiceDate) : "N/A"}
          </p>

          {/* Utility / Mandatory Section */}
          <div className="mb-4">
            {utilityBills.length > 0 ? (
              <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
              <thead>
                <tr className="border-bottom border-dark fw-bold">
                  <th style={{ width: '40px' }} className="py-2"></th>
                  <th style={{ width: '200px' }} className="py-2 fw-normal">Name</th>
                  <th style={{ width: '60px' }} className="py-2 fw-normal">Detail</th>
                  <th style={{ width: '60px' }} className="py-2 fw-normal">Value</th>
                  <th style={{ width: '40px' }} className="py-2 fw-normal">Measurement</th>
                  <th style={{ width: '40px' }} className="py-2 fw-normal text-end">Price</th>
                </tr>
              </thead>
              <tbody>
                {utilityBills.map((bill) => {
                  const details = bill.utilityDetails ? Object.values(bill.utilityDetails) : [];
                  return (
                    <React.Fragment key={bill.id}>
                      <tr>
                        <td rowSpan={details.length + 2} className="align-top pt-3">
                          <div 
                            style={{ cursor: 'pointer', fontSize: '1.2rem', color: isSelected(bill.id) ? '#2e7d32' : '#9ca3af', transition: 'color 0.2s' }} 
                            onClick={() => toggleSelect(bill.id)}
                          >
                            {isSelected(bill.id) ? <FaCheckSquare /> : <FaRegSquare />}
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
                        <td className="py-1 text-dark text-end">{formatCurrency(bill.managementFee || 0)}</td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            <div className="d-flex justify-content-between text-dark py-2 px-2 fw-bold fs-5" style={{ borderBottom: '2px solid #000' }}>
              <span>TOTAL AMOUNT</span>
              <span style={{color: "#2e7d32"}}>{formatCurrency(utilityBills.reduce((sum, b) => sum + b.amount + (b.managementFee || 0), 0))}</span>
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
                    <td className="py-3">
                      <div 
                        style={{ cursor: 'pointer', fontSize: '1.2rem', color: isSelected(bill.id) ? '#2e7d32' : '#9ca3af', transition: 'color 0.2s' }} 
                        onClick={() => toggleSelect(bill.id)}
                      >
                        {isSelected(bill.id) ? <FaCheckSquare /> : <FaRegSquare />}
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
              <span style={{ color: "#2e7d32" }} >{formatCurrency(serviceBills.reduce((sum, b) => sum + b.amount, 0))}</span>
            </div>
          </div>
        ) : (
          <p className="text-muted fst-italic small mb-0">No service invoices.</p>
        )}
      </div>
        </div>
      </div>

      {/* Sidebar Column */}
      <div className="col-12 col-lg-3">
        <InvoiceSidebar 
          selectedBills={selectedBills}
          allUnpaidBills={currentMonthBills}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
