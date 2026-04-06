import { 
  ComposedChart, 
  Bar, 
  Line,
  Area,
  XAxis, 
  YAxis,
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  CartesianGrid
} from "recharts";

const renderCustomLegend = (props) => {
  const { payload } = props;
  
  const bars = payload.filter(entry => entry.type !== 'line' && entry.type !== 'area' && entry.value !== 'total');
  const line = payload.find(entry => entry.type === 'line' || entry.type === 'area');
  
  const finalPayload = [...bars, line].filter(Boolean);

  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      justifyContent: 'flex-end', 
      marginBottom: '15px',
      fontSize: '10px', 
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    }}>
      {finalPayload.map((entry, index) => (
        <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {entry.type === 'line' || entry.type === 'area' ? (
            <div style={{ width: '12px', height: '2px', backgroundColor: entry.color }} />
          ) : (
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color }} />
          )}
          <span style={{ color: entry.type === 'line' || entry.type === 'area' ? entry.color : '#94a3b8' }}>
            {entry.value === 'total' ? 'TOTAL' : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function BookingChart({ data, categories, formatCurrency }) {
  const COLORS = [
    "#c98b3c",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
  ];

  const processedData = data.map(item => {
    const total = categories.reduce((sum, cat) => sum + (Number(item[cat]) || 0), 0);
    return { ...item, total };
  });

  return (
    <div className="expense-chart" style={{ marginTop: "20px" }}>
      {processedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={processedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotalBooking" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#be123c" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#be123c" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid 
              vertical={false} 
              strokeDasharray="4 4" 
              stroke="rgba(226, 232, 240, 0.4)" 
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              dy={12}
            />

            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
              tickFormatter={(value) => value > 0 ? `${(value / 1000000).toFixed(1)}M` : value}
              width={45}
            />

            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.02)", radius: [8, 8, 0, 0] }}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.08)",
                padding: "14px 18px",
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(12px)"
              }}
              labelStyle={{ 
                fontWeight: "900", 
                marginBottom: "8px", 
                color: "#1e293b",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
              itemStyle={{ 
                fontSize: "11px",
                fontWeight: "700",
                padding: "3px 0"
              }}
              formatter={(value, name) => [formatCurrency(Number(value)), name === "total" ? "TOTAL" : name]}
            />

            <Legend 
              verticalAlign="top" 
              align="right" 
              content={renderCustomLegend}
            />

            {categories.map((category, index) => (
              <Bar 
                key={category}
                dataKey={category} 
                stackId="a" 
                fill={COLORS[index % COLORS.length]} 
                radius={index === categories.length - 1 ? [5, 5, 0, 0] : [0, 0, 0, 0]}
                barSize={32}
                animationDuration={1500}
              />
            ))}

            <Area
              type="linear"
              dataKey="total"
              stroke="none"
              fillOpacity={1}
              fill="url(#colorTotalBooking)"
              tooltipType="none"
              legendType="none"
            />

            <Line 
              type="linear" 
              dataKey="total" 
              stroke="#be123c" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#be123c', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: '#be123c' }}
              name="total"
              animationDuration={2000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className="billing-empty-info" style={{ padding: "80px 0" }}>
          No booking history detected for trend analysis.
        </div>
      )}
    </div>
  );
}
