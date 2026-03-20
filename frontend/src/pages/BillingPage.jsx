import { useState } from "react";

import Navbar from "../components/layout/Navbar";

import PropertySidebar from "../components/sections/billing/PropertySidebar";
import BillingSummary from "../components/sections/billing/BillingSummary";
import BillingTable from "../components/sections/billing/BillingTable";
import BillingChart from "../components/sections/billing/BillingChart";
import BillingFilters from "../components/sections/billing/BillingFilters";
import PaymentHistory from "../components/sections/billing/PaymentHistory";

import ComplaintButton from "../components/sections/complaint/ComplaintButton";
import ComplaintList from "../components/sections/complaint/ComplaintList";

import "../styles/billing.css";

export default function BillingPage() {
  const [apartment, setApartment] = useState("A101");
  const [month, setMonth] = useState("March");

  return (
    <>
      <Navbar />

      <div className="billing-page">
        <div className="billing-container">
          <PropertySidebar />

          <div className="billing-content">
            <h2 className="billing-title">Billing Dashboard</h2>

            {/* Report Issue Button */}
            <ComplaintButton />

            {/* Filters */}
            <BillingFilters
              apartment={apartment}
              setApartment={setApartment}
              month={month}
              setMonth={setMonth}
            />

            {/* Summary */}
            <BillingSummary />

            {/* Bills */}
            <BillingTable />

            {/* Chart */}
            <BillingChart />

            {/* Payment history */}
            <PaymentHistory />

            {/* Complaint Center */}
            <ComplaintList />
          </div>
        </div>
      </div>
    </>
  );
}
