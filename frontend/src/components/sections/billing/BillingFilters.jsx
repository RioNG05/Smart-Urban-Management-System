export default function BillingFilters({
  apartment,
  setApartment,
  monthKey,
  setMonthKey,
  apartments,
  months,
}) {
  return (
    <div className="billing-filters">
      <div>
        <label>Apartment</label>

        <select
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
        >
          {apartments.map((item) => (
            <option key={item.id} value={item.id}>
              Apartment {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Month</label>

        <select value={monthKey} onChange={(e) => setMonthKey(e.target.value)}>
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
