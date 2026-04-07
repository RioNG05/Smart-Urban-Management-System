import { useMemo } from "react";
import BookingChart from "./BookingChart";
import BookingPricingTable from "./BookingPricingTable";
import { formatCurrency } from "../../../utils/billingUtils";

// Helper to handle both Date objects and [y, m, d...] arrays from Spring Boot
const parseJavaDate = (val) => {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (Array.isArray(val)) {
    return new Date(val[0], val[1] - 1, val[2], val[3] || 0, val[4] || 0, val[5] || 0);
  }
  return new Date(val);
};

export default function BookingOverview({ bookings, services, loading }) {
  
  // Aggregate booking data for the granular stacked chart
  const { chartData, categories } = useMemo(() => {
    if (!bookings || bookings.length === 0) return { chartData: [], categories: [] };

    const monthlyMap = {};
    const serviceSet = new Set();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // 1. Group and accumulate
    bookings.forEach(b => {
      const date = parseJavaDate(b.bookFrom || b.bookAt);
      if (!date || isNaN(date.getTime())) return;

      const monthLabel = `${months[date.getMonth()]} ${date.getFullYear()}`;
      const serviceName = b.serviceResource?.service?.serviceName || "Other";
      
      if (!monthlyMap[monthLabel]) {
        monthlyMap[monthLabel] = { name: monthLabel, _timestamp: date.getTime() };
      }
      
      monthlyMap[monthLabel][serviceName] = (monthlyMap[monthLabel][serviceName] || 0) + Number(b.totalAmount || 0);
      serviceSet.add(serviceName);
    });

    // 2. Format for Recharts and sort by timestamp
    const sortedData = Object.values(monthlyMap)
      .sort((a, b) => a._timestamp - b._timestamp)
      .map(item => {
        const { _timestamp, ...rest } = item;
        return rest;
      })
      .slice(-6); // Last 6 months

    return { 
      chartData: sortedData, 
      categories: Array.from(serviceSet) 
    };
  }, [bookings]);

  if (loading) {
    return <div className="billing-loading-state">Loading overview...</div>;
  }

  return (
    <div className="billing-content">
      <div className="billing-overview-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="billing-panel full-width">
          <h3 className="refined-section-title">Expediture Distribution</h3>
          <p className="billing-panel-subtitle" style={{ marginTop: "-12px", marginBottom: "24px" }}> 
            Analyzing your spending composition across different amenities.
          </p>
          <BookingChart 
            data={chartData} 
            categories={categories}
            formatCurrency={formatCurrency} 
          />
        </div>
        
        <div className="billing-panel full-width">
          <h3 className="refined-section-title">Service Unit Rates</h3>
          <BookingPricingTable rates={services} />
        </div>
      </div>
    </div>
  );
}
