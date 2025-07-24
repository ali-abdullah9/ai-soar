'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Globe, Target, Zap, Clock } from 'lucide-react';
import { SecurityLog } from '@/lib/types';

interface GraphsProps {
  logs: SecurityLog[];
}

// Animated Donut Chart for Threat Severity
const ThreatSeverityDonut = ({ logs }: { logs: SecurityLog[] }) => {
  const severityCounts = logs.reduce((acc, log) => {
    acc[log.event.severity] = (acc[log.event.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = logs.length;
  const severityData = [
    { name: 'Critical', count: severityCounts.critical || 0, color: '#ef4444', offset: 0 },
    { name: 'High', count: severityCounts.high || 0, color: '#f97316', offset: 0 },
    { name: 'Medium', count: severityCounts.medium || 0, color: '#eab308', offset: 0 },
    { name: 'Low', count: severityCounts.low || 0, color: '#21e6c1', offset: 0 },
    { name: 'Info', count: severityCounts.info || 0, color: '#6b7280', offset: 0 }
  ];

  let currentOffset = 0;
  severityData.forEach(item => {
    item.offset = currentOffset;
    currentOffset += (item.count / total) * 100;
  });

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center gap-3 mb-4">
        <Target className="w-6 h-6 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Threat Severity Distribution</h3>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Animated SVG Donut */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="rgba(75, 85, 99, 0.3)"
              strokeWidth="20"
            />
            
            {severityData.map((item, index) => {
              if (item.count === 0) return null;
              
              const percentage = (item.count / total) * 100;
              const circumference = 2 * Math.PI * 80;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((item.offset / 100) * circumference);
              
              return (
                <motion.circle
                  key={item.name}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="filter drop-shadow-lg"
                />
              );
            })}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-white">{total}</div>
            <div className="text-sm text-gray-400">Total Threats</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {severityData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-400">{item.name}</span>
            <span className="text-sm font-medium text-white ml-auto">{item.count}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Real-time Activity Timeline
const ActivityTimeline = ({ logs }: { logs: SecurityLog[] }) => {
  // Group logs by hour for the last 24 hours
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - (23 - i), 0, 0, 0);
    return hour;
  });

  const timelineData = hours.map(hour => {
    const hourLogs = logs.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime.getHours() === hour.getHours();
    });
    
    return {
      hour: hour.getHours(),
      count: hourLogs.length,
      label: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  });

  const maxCount = Math.max(...timelineData.map(d => d.count), 1);

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">24-Hour Activity Timeline</h3>
      </div>

      <div className="h-32 flex items-end justify-between gap-1">
        {timelineData.slice(-12).map((data, index) => { // Show last 12 hours
          const height = (data.count / maxCount) * 100;
          
          return (
            <div key={data.hour} className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-sm min-h-[2px] relative group"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {data.count} events at {data.label}
                </div>
              </motion.div>
              
              <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-center">
                {String(data.hour).padStart(2, '0')}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        Peak activity: {Math.max(...timelineData.map(d => d.count))} events/hour
      </div>
    </div>
  );
};

// Attack Vector Breakdown
const AttackVectorBreakdown = ({ logs }: { logs: SecurityLog[] }) => {
  const vectors = logs.reduce((acc, log) => {
    const vector = log.threat.category || 'unknown';
    acc[vector] = (acc[vector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const vectorData = Object.entries(vectors).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
    percentage: (count / logs.length) * 100
  })).sort((a, b) => b.count - a.count);

  const colors = [
    'from-red-500 to-pink-500',
    'from-blue-500 to-cyan-500', 
    'from-green-500 to-emerald-500',
    'from-purple-500 to-violet-500',
    'from-orange-500 to-yellow-500'
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-6 h-6 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Attack Vector Analysis</h3>
      </div>

      <div className="space-y-3">
        {vectorData.slice(0, 5).map((vector, index) => (
          <motion.div
            key={vector.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{vector.name}</span>
              <div className="text-right">
                <span className="text-white font-bold">{vector.count}</span>
                <span className="text-gray-400 text-sm ml-2">({vector.percentage.toFixed(1)}%)</span>
              </div>
            </div>
            
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${vector.percentage}%` }}
                transition={{ delay: index * 0.2, duration: 1 }}
                className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full relative`}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <div className="text-sm text-yellow-400">
          ⚡ Most common: {vectorData[0]?.name} ({vectorData[0]?.count} attacks)
        </div>
      </div>
    </div>
  );
};

// Simulated Geographic Threat Map
const GeographicThreatMap = ({ logs }: { logs: SecurityLog[] }) => {
  // Simulate geographic data based on IP addresses
  const geoData = [
    { country: 'China', threats: Math.floor(Math.random() * 50) + 10, x: 75, y: 35 },
    { country: 'Russia', threats: Math.floor(Math.random() * 40) + 8, x: 70, y: 25 },
    { country: 'USA', threats: Math.floor(Math.random() * 30) + 5, x: 25, y: 40 },
    { country: 'Brazil', threats: Math.floor(Math.random() * 25) + 3, x: 35, y: 70 },
    { country: 'India', threats: Math.floor(Math.random() * 35) + 7, x: 75, y: 50 },
    { country: 'Germany', threats: Math.floor(Math.random() * 20) + 2, x: 52, y: 30 }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center gap-3 mb-4">
        <Globe className="w-6 h-6 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Global Threat Origins</h3>
      </div>

      <div className="relative h-48 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg overflow-hidden">
        {/* World map simulation */}
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Simplified continents */}
            <path d="M10,20 Q20,15 30,20 T50,25 Q60,20 80,25 L85,35 Q80,40 70,35 L50,40 Q30,35 20,40 L15,35 Q10,30 10,20" 
                  fill="rgba(6, 182, 212, 0.2)" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5"/>
            <path d="M15,45 Q25,40 35,45 T55,50 L60,60 Q50,65 40,60 L25,65 Q15,60 15,45" 
                  fill="rgba(6, 182, 212, 0.2)" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5"/>
            <path d="M65,45 Q75,40 85,45 L90,55 Q85,60 75,55 Q70,50 65,45" 
                  fill="rgba(6, 182, 212, 0.2)" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* Threat indicators */}
        {geoData.map((location, index) => (
          <motion.div
            key={location.country}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              className="w-4 h-4 bg-red-500 rounded-full relative"
              style={{ 
                boxShadow: `0 0 ${Math.min(location.threats / 2, 20)}px rgba(239, 68, 68, 0.8)` 
              }}
            >
              {/* Pulse effect */}
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
            </motion.div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {location.country}: {location.threats} threats
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {geoData.slice(0, 3).map((location, index) => (
          <div key={location.country} className="text-center p-2 bg-gray-800/30 rounded-lg">
            <div className="text-lg font-bold text-red-400">{location.threats}</div>
            <div className="text-xs text-gray-400">{location.country}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Graphs({ logs }: GraphsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ThreatSeverityDonut logs={logs} />
      <ActivityTimeline logs={logs} />
      <AttackVectorBreakdown logs={logs} />
      <GeographicThreatMap logs={logs} />
    </div>
  );
}