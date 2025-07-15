'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { BarChart3, AlertTriangle } from 'lucide-react';

interface SeverityDistributionProps {
  data: Record<string, number>;
}

const COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#21E6C1',
  info: '#6b7280',
};

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show label for small slices

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-soar-medium/50 rounded-lg p-3 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="text-sm font-semibold text-white capitalize">
            {data.name}
          </span>
        </div>
        <div className="text-sm text-gray-400">
          Count: <span className="text-white font-medium">{data.value}</span>
        </div>
        <div className="text-sm text-gray-400">
          Percentage: <span className="text-white font-medium">
            {((data.value / data.payload.total) * 100).toFixed(1)}%
          </span>
        </div>
      </motion.div>
    );
  }
  return null;
};

export default function SeverityDistribution({ data }: SeverityDistributionProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: COLORS[name as keyof typeof COLORS] || '#6b7280',
    total,
  }));

  // Sort by severity order
  const severityOrder = ['critical', 'high', 'medium', 'low', 'info'];
  chartData.sort((a, b) => {
    const aIndex = severityOrder.indexOf(a.name.toLowerCase());
    const bIndex = severityOrder.indexOf(b.name.toLowerCase());
    return aIndex - bIndex;
  });

  return (
    <div className="cyber-card h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-soar-bright" />
          <h3 className="text-lg font-semibold text-white">Threat Distribution</h3>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-gray-400">
            {chartData.find(d => d.name.toLowerCase() === 'critical')?.value || 0} critical
          </span>
        </div>
      </div>
      
      <div className="relative h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`gradient-${entry.name}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={1} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#gradient-${entry.name})`}
                  stroke={entry.color}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="circle"
              wrapperStyle={{
                paddingLeft: '20px',
              }}
              formatter={(value: string, entry: any) => (
                <span className="text-gray-400 text-sm">
                  {value}: <span className="text-white font-medium">{entry.payload.value}</span>
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center total count */}
        <div className="absolute top-1/2 left-[35%] transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-3xl font-bold text-white">{total}</div>
          <div className="text-xs text-gray-500">Total Alerts</div>
        </div>
      </div>
    </div>
  );
}