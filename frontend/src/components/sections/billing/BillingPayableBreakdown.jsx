export default function BillingPayableBreakdown({
  totals,
  pricingRows,
  formatCurrency,
}) {
  return (
    <section className="billing-panel">
      <div className="billing-panel-header">
        <div>
          <h3 className="section-title">Amount To Pay</h3>
          <p className="billing-panel-subtitle">
            Outstanding utility charges are grouped by electricity and water.
          </p>
        </div>

        <div className="billing-grand-total">
          <span>Grand total</span>
          <strong>{formatCurrency(totals.total)}</strong>
        </div>
      </div>

      <div className="payable-breakdown-grid">
        <div className="payable-breakdown-card">
          <span className="payable-breakdown-label">Electricity</span>
          <strong>{formatCurrency(totals.electricity)}</strong>
        </div>

        <div className="payable-breakdown-card">
          <span className="payable-breakdown-label">Water</span>
          <strong>{formatCurrency(totals.water)}</strong>
        </div>
      </div>

      <div className="billing-rate-table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Unit price</th>
              <th>Usage / quantity</th>
              <th>Total payable</th>
            </tr>
          </thead>

          <tbody>
            {pricingRows.length ? (
              pricingRows.map((row) => (
                <tr key={row.key}>
                  <td>
                    <div className="billing-rate-title">{row.label}</div>
                    {row.description ? (
                      <div className="billing-rate-description">
                        {row.description}
                      </div>
                    ) : null}
                  </td>

                  <td>{row.unitPriceLabel}</td>
                  <td>{row.quantityLabel}</td>
                  <td>{formatCurrency(row.amount)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="billing-empty">
                  No payable categories found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
