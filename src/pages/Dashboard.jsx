import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  PieChart, BarChart, Bar, Label, LabelList, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, ReferenceLine 
} from "recharts";
import useApplications from "../hooks/useApplications";
import MetricCard from "../components/MetricCard";
import Upgrade from '../components/Upgrade';
import useAuth from '../hooks/useAuth';

const STATUS_COLORS = {
  APPLIED: "#378ADD", SCREEN: "#BA7517", INTERVIEW: "#7F77DD",
  OFFER: "#1D9E75", REJECTED: "#E24B4A", WITHDRAWN: "#888780"
};

export default function Dashboard() {
  const { applications, isLoading } = useApplications();
  const { user, loading: isUserLoading, refetchUser } = useAuth();
  
  // 1. Setup state for the Stripe redirect pop-ups
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastMessage, setToastMessage] = useState(null);

  // 2. Catch the Stripe return URLs
  useEffect(() => {
    const upgraded = searchParams.get('upgraded');
    const cancelled = searchParams.get('cancelled');

    if (upgraded === 'true') {
      setToastMessage({ type: 'success', text: 'Payment successful! Welcome to Pro.' });
      setSearchParams({}); 
      refetchUser();// Clear the URL
    } else if (cancelled === 'true') {
      setToastMessage({ type: 'error', text: 'Checkout cancelled. You have not been charged.' });
      setSearchParams({}); // Clear the URL
    }

    if (upgraded || cancelled) {
      setTimeout(() => setToastMessage(null), 5000);
    }
  }, [searchParams, setSearchParams, refetchUser]);

  if (isLoading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(statusCounts).map(([name, value]) =>
    ({ name, value, fill: STATUS_COLORS[name] || "#888780" }) 
  );

  const interviewRate = Math.round(
    ((statusCounts.INTERVIEW || 0) + (statusCounts.OFFER || 0))
    / applications.length * 100
  ) || 0; // Added || 0 to prevent NaN if applications.length is 0

  return (
    <div className="relative space-y-8 p-6">
      
      {/* 3. The Stripe Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-lg animate-fade-in-down text-white font-medium flex items-center gap-3
          ${toastMessage.type === 'success' ? 'bg-green-600' : 'bg-red-500'}
        `}>
          {toastMessage.type === 'success' ? '🎉' : '⚠️'}
          {toastMessage.text}
        </div>
      )}

      {/* Metric cards & Upgrade Button */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        <MetricCard title="Total applied" value={applications.length} />
        <MetricCard title="Interview rate" value={`${interviewRate}%`} />
        <MetricCard title="Offers" value={statusCounts.OFFER || 0} />
        
        {/* 4. Drop the real component here, centered in its grid column */}
        <div className="flex items-center justify-center">
          {user?.isPro ?(
            <div classname= "bg-gradient-to-r from-amber-500 to-range-500 text-white px-6 py-3 rounded-lg font-bold item-center">
              Pro
            </div>
          ) : (
          <Upgrade />
          )}
          
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow border border-gray-300">
        <h2 className="text-sm font-bold text-gray-400 tracking-wider mb-6">APPLICATIONS BY STATUS</h2>
        
        {/* Bar chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={chartData} 
            layout="vertical" 
            margin={{ top: 30, right: 40, left: 0, bottom: 10 }} 
          >
            <XAxis type="number" hide /> 
            
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#074eb9', fontSize: 12, fontWeight: 500 }} 
              width={90} 
              interval={0}
            />
            
            <Tooltip 
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
              contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '8px', color: '#fff' }} 
            />
            
            <Bar 
              dataKey="value" 
              barSize={20} 
              radius={[0, 2, 2, 0]} 
              background={{ fill: '#374151', radius: [0, 2, 2, 0] }} 
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              
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