export default function BillingPricingTable({ rates, formatCurrency }) {
  return (
    <div className="billing-rate-table" style={{ border: "none", background: "transparent" }}>
      <p className="billing-panel-subtitle" style={{ marginBottom: "16px" }}>
        Reference unit prices for utility services.
      </p>
      
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Unit</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {rates.length ? (
            rates.map((rate) => (
              <tr key={rate.key}>
                <td>
                  <div className="billing-rate-title">{rate.label}</div>
                </td>
                <td style={{ color: "var(--text-muted)" }}>{rate.unitType || "N/A"}</td>
                <td style={{ fontWeight: "700", color: "var(--primary-color)" }}>
                  {rate.unitPrice === null
                    ? "N/A"
                    : formatCurrency(rate.unitPrice)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="billing-empty">
                No rates available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
