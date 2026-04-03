import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis,
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  CartesianGrid
} from "recharts";

export default function BookingChart({ data, categories, formatCurrency }) {
  // Diverse color palette for different service categories
  const COLORS = [
    "#c98b3c", // Brand Gold
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#f43f5e", // Rose
  ];

  return (
    <div className="expense-chart" style={{ marginTop: "20px" }}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="3 3" 
              stroke="rgba(226, 232, 240, 0.6)" 
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              dy={10}
            />

            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
              tickFormatter={(value) => value > 0 ? `${(value / 1000000).toFixed(1)}M` : value}
              width={40}
            />

            <Tooltip
              cursor={{ fill: "rgba(201, 139, 60, 0.04)", radius: [6, 6, 0, 0] }}
              contentStyle={{
                borderRadius: "14px",
                border: "none",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                padding: "12px 16px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)"
              }}
              labelStyle={{ 
                fontWeight: "800", 
                marginBottom: "8px", 
                color: "#1e293b",
                fontSize: "13px",
                textTransform: "uppercase"
              }}
              itemStyle={{ 
                fontSize: "12px",
                fontWeight: "600",
                padding: "2px 0"
              }}
              formatter={(value) => [formatCurrency(Number(value))]}
            />

            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ 
                paddingBottom: "20px", 
                fontSize: "11px", 
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            />

            {categories.map((category, index) => (
              <Bar 
                key={category}
                dataKey={category} 
                stackId="a" 
                fill={COLORS[index % COLORS.length]} 
                radius={index === categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                barSize={32}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="billing-empty-info" style={{ padding: "80px 0" }}>
          No booking history detected for trend analysis.
        </div>
      )}
    </div>
  );
}
