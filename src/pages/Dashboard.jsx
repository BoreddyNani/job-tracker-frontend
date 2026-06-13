import { PieChart, BarChart, Bar ,Label , LabelList, Pie, Cell, Tooltip, ResponsiveContainer,
         LineChart, Line, XAxis, YAxis, ReferenceLine } from "recharts";
import  useApplications  from "../hooks/useApplications";
import MetricCard from "../components/MetricCard";

const STATUS_COLORS = {
  APPLIED: "#378ADD", SCREEN: "#BA7517", INTERVIEW: "#7F77DD",
  OFFER: "#1D9E75", REJECTED: "#E24B4A", WITHDRAWN: "#888780"
};

export default function Dashboard() {
  const { applications, isLoading } = useApplications();

  if (isLoading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(statusCounts).map(([name, value]) =>
    ({ name, value, fill: STATUS_COLORS[name] || "#888780" }) // Default gray if unknown status
  );

  const interviewRate = Math.round(
    ((statusCounts.INTERVIEW || 0) + (statusCounts.OFFER || 0))
    / applications.length * 100
  );

  return (
    <div>
      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <MetricCard title="Total applied" value={applications.length} />
        <MetricCard title="Interview rate" value={`${interviewRate}%`} />
        <MetricCard title="Offers" value={statusCounts.OFFER || 0} />
      </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-300">
          <h2 className="text-sm font-bold text-gray-400 tracking-wider mb-6">APPLICATIONS BY STATUS</h2>
        {/* Pie chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
                data={chartData} 
                layout="vertical" 
                margin={{ top: 30, right: 40, left: 0, bottom: 100 }} // Right margin gives room for the numbers
              >
                {/* Hide X-Axis completely */}
                <XAxis type="number" hide /> 
                
                {/* Style Y-Axis to match image */}
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#074eb9', fontSize: 12, fontWeight: 500 }} 
                  width={90} 
                  interval={0}
                />
                
                {/* Dark mode tooltip */}
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                  contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '8px', color: '#fff' }} 
                />
                
                {/* 4. Format the bars */}
                <Bar 
                  dataKey="value" 
                  barSize={20} // Keeps bars slim
                  radius={[0, 2, 2, 0]} // Rounds the right-side corners
                  background={{ fill: '#374151', radius: [0, 2, 2, 0] }} // The dark empty track behind the bar
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  
                  {/* 5. Add the values at the end of the bars */}
                  <LabelList 
                    dataKey="value" 
                    position="right"
                    fill="#0c0d0f"
                    fontSize={14}
                  />
                </Bar>
              </BarChart>
          </ResponsiveContainer>
      </div>
      </div>
  );
}