export default function BillingPricingTable({ rates, formatCurrency }) {
  return (
    <section className="billing-panel">
      <div className="billing-panel-header">
        <div>
          <h3 className="section-title">Category Price List</h3>
          <p className="billing-panel-subtitle">
            Reference unit prices collected from the backend service catalog.
          </p>
        </div>
      </div>

      <div className="billing-rate-table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Service code</th>
              <th>Unit type</th>
              <th>Unit price</th>
            </tr>
          </thead>

          <tbody>
            {rates.length ? (
              rates.map((rate) => (
                <tr key={rate.key}>
                  <td>
                    <div className="billing-rate-title">{rate.label}</div>
                  </td>
                  <td>{rate.serviceCode || "N/A"}</td>
                  <td>{rate.unitType || "N/A"}</td>
                  <td>
                    {rate.unitPrice === null
                      ? "Contact management"
                      : formatCurrency(rate.unitPrice)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="billing-empty">
                  No price list available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
