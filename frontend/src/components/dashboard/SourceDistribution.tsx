'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Database } from 'lucide-react';

interface SourceDistributionProps {
  data: Record<string, number>;
}

const sourceColors: Record<string, string> = {
  'IDPS': '#278EA5',
  'H-WAF': '#21E6C1',
  'N-WAF': '#33F9FF',
  'SIEM': '#1F4287',
  'EDR': '#f97316',
  'AV': '#ef4444',
  'AM': '#a855f7',
};

export default function SourceDistribution({ data }: SourceDistributionProps) {
  const chartData = Object.entries(data).map(([source, count]) => ({
    source,
    count,
    fill: sourceColors[source] || '#6b7280',
  }));

  return (
    <div className="cyber-card h-[300px]">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-soar-bright" />
        <h3 className="text-lg font-semibold text-white">Security Sources</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="source" 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={{ stroke: '#374151' }}
          />
          <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={{ stroke: '#374151' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(26, 31, 46, 0.9)',
              border: '1px solid rgba(39, 142, 165, 0.3)',
              borderRadius: '8px',
            }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}