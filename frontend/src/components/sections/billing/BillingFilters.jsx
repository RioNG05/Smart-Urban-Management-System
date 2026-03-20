export default function BillingFilters({
  apartment,
  setApartment,
  month,
  setMonth,
}) {
  return (
    <div className="billing-filters">
      <div>
        <label>Apartment</label>

        <select
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
        >
          <option>A101</option>
          <option>B202</option>
          <option>C303</option>
        </select>
      </div>

      <div>
        <label>Month</label>

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option>January</option>
          <option>February</option>
          <option>March</option>
          <option>April</option>
        </select>
      </div>
    </div>
  );
}
