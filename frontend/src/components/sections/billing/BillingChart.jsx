import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function BillingChart({ data, formatCurrency }) {
  // Use a professional brand color for the main chart
  const PRIMARY_COLOR = "#c98b3c";

  return (
    <div className="expense-chart">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 30 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />

            <Tooltip
              cursor={{ fill: "rgba(201, 139, 60, 0.05)" }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid rgba(201, 139, 60, 0.1)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                padding: "12px",
                backgroundColor: "#fff",
              }}
              labelStyle={{ fontWeight: "700", marginBottom: "4px", color: "#1f2937" }}
              itemStyle={{ color: PRIMARY_COLOR, fontWeight: "600" }}
              formatter={(value) => [formatCurrency(Number(value)), "Spending"]}
            />

            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={PRIMARY_COLOR} 
                  fillOpacity={index === 0 ? 1 : 0.8} // Slight differentiation for current month
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="billing-empty" style={{ padding: "80px 0" }}>
          No data available for Analysis.
        </div>
      )}
    </div>
  );
}
