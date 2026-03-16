import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Rent", value: 5000000 },
  { name: "Electricity", value: 700000 },
  { name: "Water", value: 200000 },
  { name: "Parking", value: 150000 },
];

export default function BillingChart() {
  return (
    <div className="expense-chart">
      <h3 className="section-title">Monthly Expense Overview</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="name" />

          <Tooltip />

          <Bar dataKey="value" fill="#2e7d32" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
