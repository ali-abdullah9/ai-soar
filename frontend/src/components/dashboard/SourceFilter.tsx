'use client';

import { motion } from 'framer-motion';
import { Shield, Globe, Monitor, Bug, Network, Eye, Filter } from 'lucide-react';

const sourceTypes = [
  {
    id: 'all',
    label: 'All Sources',
    icon: Filter,
    color: 'from-gray-500 to-gray-600',
    description: 'Show all security sources'
  },
  {
    id: 'IDPS',
    label: 'IDPS',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    description: 'Intrusion Detection & Prevention'
  },
  {
    id: 'H-WAF',
    label: 'H-WAF',
    icon: Globe,
    color: 'from-green-500 to-emerald-500',
    description: 'Host-based Web Application Firewall'
  },
  {
    id: 'N-WAF',
    label: 'N-WAF',
    icon: Globe,
    color: 'from-teal-500 to-cyan-500',
    description: 'Network-based Web Application Firewall'
  },
  {
    id: 'SIEM',
    label: 'SIEM',
    icon: Monitor,
    color: 'from-purple-500 to-violet-500',
    description: 'Security Information & Event Management'
  },
  {
    id: 'EDR',
    label: 'EDR',
    icon: Eye,
    color: 'from-orange-500 to-red-500',
    description: 'Endpoint Detection & Response'
  },
  {
    id: 'AV',
    label: 'Antivirus',
    icon: Bug,
    color: 'from-red-500 to-pink-500',
    description: 'Antivirus Protection'
  },
  {
    id: 'AM',
    label: 'Anti-Malware',
    icon: Network,
    color: 'from-pink-500 to-rose-500',
    description: 'Anti-Malware Detection'
  }
];

interface SourceFilterProps {
  selectedSource: string | null;
  onSourceChange: (source: string | null) => void;
  sourceCounts: Record<string, number>;
}

export default function SourceFilter({ selectedSource, onSourceChange, sourceCounts }: SourceFilterProps) {
  const totalCount = Object.values(sourceCounts).reduce((sum, count) => sum + count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-semibold text-white">Security Sources</h3>
        <div className="flex-1" />
        <div className="text-sm text-gray-400">
          Total: <span className="text-white font-medium">{totalCount}</span> events
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {sourceTypes.map((source, index) => {
          const Icon = source.icon;
          const count = source.id === 'all' ? totalCount : (sourceCounts[source.id] || 0);
          const isActive = selectedSource === (source.id === 'all' ? null : source.id);
          const percentage = totalCount > 0 ? ((count / totalCount) * 100) : 0;

          return (
            <motion.button
              key={source.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSourceChange(source.id === 'all' ? null : source.id)}
              className={`
                relative p-4 rounded-xl transition-all duration-200 group text-left
                ${isActive 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50' 
                  : 'bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50'
                }
              `}
            >
              {/* Background glow effect */}
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r ${source.color}`} />
              
              <div className="relative z-10 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-500/20' : 'bg-gray-700/50'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${isActive ? 'text-cyan-400' : 'text-white'}`}>
                      {source.label}
                    </span>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${isActive ? 'text-cyan-400' : 'text-white'}`}>
                        {count.toLocaleString()}
                      </div>
                      {source.id !== 'all' && (
                        <div className="text-xs text-gray-500">
                          {percentage.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {source.description}
                  </div>
                  
                  {/* Progress bar */}
                  {source.id !== 'all' && (
                    <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        className={`h-full bg-gradient-to-r ${source.color}`}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeSourceIndicator"
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Real-time indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <motion.div
          className="w-2 h-2 bg-green-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-sm text-green-400">Live data streaming</span>
      </div>
    </motion.div>
  );
}