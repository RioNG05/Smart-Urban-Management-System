import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

export default function ExpenseChartSmall({ data }) {
  return (
    <div className="expense-chart">
      <div className="section-title">Monthly Expenses</div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <Tooltip />
          <Bar dataKey="amount" fill="#2e7d32" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
