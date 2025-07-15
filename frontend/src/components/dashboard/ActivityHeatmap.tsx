'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SecurityLog } from '@/lib/types';
import { Activity } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

interface ActivityHeatmapProps {
  logs: SecurityLog[];
}

export default function ActivityHeatmap({ logs }: ActivityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Generate heatmap data for the last 30 days
  const heatmapData = useMemo(() => {
    const data: Record<string, number> = {};
    const today = startOfDay(new Date());
    
    // Initialize all days with 0
    for (let i = 0; i < 30; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      data[date] = 0;
    }
    
    // Count logs per day
    logs.forEach(log => {
      const date = format(new Date(log.timestamp), 'yyyy-MM-dd');
      if (data[date] !== undefined) {
        data[date]++;
      }
    });
    
    return Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, [logs]);

  const maxCount = Math.max(...heatmapData.map(d => d.count), 1);

  const getIntensity = (count: number) => {
    const intensity = count / maxCount;
    if (intensity === 0) return 'bg-gray-800';
    if (intensity < 0.25) return 'bg-soar-darkest';
    if (intensity < 0.5) return 'bg-soar-dark';
    if (intensity < 0.75) return 'bg-soar-medium';
    return 'bg-soar-bright';
  };

  return (
    <div className="cyber-card">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-soar-bright" />
        <h3 className="text-lg font-semibold text-white">30-Day Activity Heatmap</h3>
      </div>
      
      <div className="grid grid-cols-10 gap-1">
        {heatmapData.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            className="relative"
            onMouseEnter={() => setHoveredCell(day.date)}
            onMouseLeave={() => setHoveredCell(null)}
          >
            <div 
              className={`aspect-square rounded ${getIntensity(day.count)} transition-all hover:scale-110 cursor-pointer`}
            />
            
            {hoveredCell === day.date && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                {format(new Date(day.date), 'MMM dd')}: {day.count} events
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-800 rounded" />
          <div className="w-3 h-3 bg-soar-darkest rounded" />
          <div className="w-3 h-3 bg-soar-dark rounded" />
          <div className="w-3 h-3 bg-soar-medium rounded" />
          <div className="w-3 h-3 bg-soar-bright rounded" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}