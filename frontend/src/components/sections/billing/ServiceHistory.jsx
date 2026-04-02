import React from "react";
import BillingFilters from "./BillingFilters";
import BillingSummary from "./BillingSummary";
import BillingTable from "./BillingTable";
import BillingChart from "./BillingChart";
import PaymentHistory from "./PaymentHistory";

export default function ServiceHistory({
  apartment,
  setApartment,
  monthKey,
  setMonthKey,
  apartments,
  monthOptions,
  summary,
  filteredBills,
  chartData,
  payments,
  formatCurrency,
  formatDate,
  loading
}) {
  return (
    <>
      <BillingFilters
        apartment={apartment}
        setApartment={setApartment}
        monthKey={monthKey}
        setMonthKey={setMonthKey}
        apartments={apartments}
        months={monthOptions}
      />

      <BillingSummary summary={summary} formatCurrency={formatCurrency} />

      <div className="bg-white rounded shadow-sm p-4 mb-4">
        <BillingChart data={chartData} formatCurrency={formatCurrency} />
      </div>

      <div className="bg-white rounded shadow-sm p-4 mb-4">
        <h4 className="fs-5 fw-bold mb-3 text-dark">Service Invoices</h4>
        <BillingTable
          bills={filteredBills}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          loading={loading}
          showPaymentAction={false}
        />
      </div>


      <div className="bg-white rounded shadow-sm p-4 mb-4">
        <PaymentHistory
          payments={payments}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      </div>
    </>
  );
}
