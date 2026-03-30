import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BillingChart({ data, formatCurrency }) {
  return (
    <div className="expense-chart">
      <h3 className="section-title">Monthly Expense Overview</h3>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <XAxis dataKey="name" />

            <Tooltip formatter={(value) => formatCurrency(Number(value))} />

            <Bar dataKey="value" fill="#2e7d32" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="billing-empty">No chart data available.</div>
      )}
    </div>
  );
}
