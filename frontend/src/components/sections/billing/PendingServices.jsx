import React, { useState } from "react";
import BillingTable from "./BillingTable";
import InvoiceSidebar from "./InvoiceSidebar";

export default function PendingServices({ bills, formatCurrency, formatDate, loading }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedBills = bills.filter(b => selectedIds.includes(b.id));

  return (
    <div className="row g-4 mb-4">
      <div className="col-12 col-lg-9">
        <div className="bg-white rounded shadow-sm p-4 h-100 border-top border-4" style={{ borderColor: '#2e7d32' }}>
          <h4 className="fs-5 fw-bold mb-3 text-dark">Pending Services</h4>
          <p className="small text-muted mb-4">
            List of all unpaid invoices. The most recent invoices are displayed at the top for your priority.
          </p>
          
          <BillingTable
            bills={bills}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            loading={loading}
            showPaymentAction={false}
            externalSelected={selectedIds}
            onToggleSelection={toggleSelection}
          />
        </div>
      </div>
      
      <div className="col-12 col-lg-3">
        <InvoiceSidebar 
          selectedBills={selectedBills}
          allUnpaidBills={bills}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
