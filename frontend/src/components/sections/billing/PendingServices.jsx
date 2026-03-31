import React from "react";
import BillingTable from "./BillingTable";

export default function PendingServices({ bills, formatCurrency, formatDate, loading }) {
  return (
    <div className="bg-white rounded shadow-sm p-4 mb-4 border-top border-4" style={{ borderColor: '#2e7d32' }}>
      <h4 className="fs-5 fw-bold mb-3 text-dark">Pending Services</h4>
      <p className="small text-muted mb-4">
         List of all unpaid service invoices. The most recent invoices are displayed at the top for your priority.
      </p>
      
      <BillingTable
        bills={bills}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        loading={loading}
      />
    </div>
  );
}
