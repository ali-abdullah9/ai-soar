'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Activity, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardMetrics } from '@/lib/types';
import CountUp from 'react-countup';

interface MetricsCardsProps {
  metrics: DashboardMetrics | null;
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  if (!metrics) {
    // Loading state
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="cyber-card h-32 animate-pulse">
            <div className="h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Alerts',
      value: metrics.totalAlerts,
      icon: Activity,
      color: 'from-soar-medium to-soar-bright',
      bgGlow: 'bg-soar-bright/20',
      trend: { value: 12.5, isUp: true },
      suffix: '',
    },
    {
      title: 'Critical Threats',
      value: metrics.criticalAlerts,
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500',
      bgGlow: 'bg-red-500/20',
      trend: { value: 5.2, isUp: false },
      suffix: '',
    },
    {
      title: 'Blocked Threats',
      value: metrics.blockedThreats,
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      bgGlow: 'bg-green-500/20',
      trend: { value: 18.7, isUp: true },
      suffix: '',
    },
    {
      title: 'Avg Response Time',
      value: metrics.averageResponseTime,
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      bgGlow: 'bg-purple-500/20',
      trend: { value: 23.1, isUp: false },
      suffix: 's',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="cyber-card group hover:scale-105 transition-all duration-300 relative"
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10 blur-xl`} />
          </div>
          
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity rounded-xl`} />
          
          {/* Icon */}
          <div className="relative flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.bgGlow} backdrop-blur-sm group-hover:scale-110 transition-transform`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Trend Indicator */}
            <div className={`flex items-center gap-1 text-sm ${card.trend.isUp ? 'text-green-400' : 'text-red-400'}`}>
              {card.trend.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">{card.trend.value}%</span>
            </div>
          </div>

          {/* Value */}
          <div className="relative">
            <h3 className="text-gray-400 text-sm mb-1">{card.title}</h3>
            <div className="text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-soar-bright transition-all">
              <CountUp
                end={card.value}
                duration={2}
                separator=","
                suffix={card.suffix}
                decimals={card.suffix === 's' ? 1 : 0}
              />
            </div>
          </div>

          {/* Animated Border */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-xl animate-pulse-glow" 
                 style={{ 
                   background: `linear-gradient(45deg, transparent 30%, ${card.color.includes('soar') ? '#21E6C1' : card.color.includes('red') ? '#ef4444' : card.color.includes('green') ? '#10b981' : '#a855f7'} 50%, transparent 70%)`,
                   backgroundSize: '200% 200%',
                   animation: 'shimmer 3s linear infinite'
                 }} />
          </div>

          {/* Hover effect line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `linear-gradient(to right, ${card.color.includes('soar') ? '#278EA5' : 'transparent'}, ${card.color.includes('soar') ? '#21E6C1' : card.color.includes('red') ? '#ef4444' : card.color.includes('green') ? '#10b981' : '#a855f7'})`,
            }}
          />
        </motion.div>
      ))}
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
      `}</style>
    </div>
  );
}