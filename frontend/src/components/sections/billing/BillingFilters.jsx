export default function BillingFilters({
  monthKey,
  setMonthKey,
  months,
}) {
  return (
    <div className="billing-filters">
      <div className="filter-group">
        <label>Month Period</label>
        <select 
          className="billing-select" 
          value={monthKey} 
          onChange={(e) => setMonthKey(e.target.value)}
        >
          <option value="all">All months</option>
          {months.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
