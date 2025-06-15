"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {  getChartDays } from '../../firebase/StatsService';

interface MetricChartProps {
  metricKey: 'sleep' | 'water' | 'screenTime';
  label: string;
  unit: string;
  gradientId: string;
  startColor: string;
  endColor: string;
  selectedDay: string;
  dayData: Record<string, DayData>;
  chartData: Record<string, DayData>; // New prop for chart-specific data
}

const MetricChart = ({ 
  metricKey,  
  unit, 
  gradientId, 
  startColor, 
  endColor, 
  chartData 
}: MetricChartProps) => {

  // Get chart days (previous 7 days) and create chart data
  const chartDays = getChartDays();
  const chartDataArray = chartDays.map(day => {
    const dayStats = chartData[day];
    if (!dayStats || !dayStats.checkInHistory || dayStats.checkInHistory.length === 0) {
      return {
        date: day,
        value: dayStats?.stats?.[metricKey] || 0,
      };
    }
    
    // Get the latest entry for this day
    const latestEntry = dayStats.checkInHistory[dayStats.checkInHistory.length - 1];
    return {
      date: day,
      value: latestEntry[metricKey] || 0,
    };
  });

  // Check if there's any data to display
  const hasData = chartDataArray.length > 0 && chartDataArray.some(d => d.value > 0);

  return (
    <div className="w-full h-full relative">
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartDataArray} margin={{ top: 5, right: 10, left: 15, bottom: 10 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={startColor} stopOpacity={1} />
                <stop offset="100%" stopColor={endColor} stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis label={{ value: "Day", angle: 0, position: 'insideBottom', offset: -7 }}  dataKey="date" />
            <YAxis label={{ value: unit, angle: -90, position: 'insideLeft'}} />
            <Tooltip />
            <Bar dataKey="value" fill={`url(#${gradientId})`} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-sm text-center text-gray-500">
            No data available. Complete check-ins to view your weekly progress!
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricChart;