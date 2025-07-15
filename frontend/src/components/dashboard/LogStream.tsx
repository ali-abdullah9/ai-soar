'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SecurityLog } from '@/lib/types';
import { Shield, Bug, Globe, Monitor, Search, Filter, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { LucideIcon } from 'lucide-react';

interface LogStreamProps {
  logs: SecurityLog[];
}

const sourceIcons: Record<string, LucideIcon> = {
  'IDPS': Shield,
  'H-WAF': Globe,
  'N-WAF': Globe,
  'SIEM': Monitor,
  'EDR': Monitor,
  'AV': Bug,
  'AM': Bug,
};

const severityColors = {
  critical: 'border-red-500 bg-red-500/10 text-red-400',
  high: 'border-orange-500 bg-orange-500/10 text-orange-400',
  medium: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
  low: 'border-soar-bright bg-soar-bright/10 text-soar-bright',
  info: 'border-gray-500 bg-gray-500/10 text-gray-400',
};

export default function LogStream({ logs }: LogStreamProps) {
  const [filter, setFilter] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = !filter || 
      log.threat.name.toLowerCase().includes(filter.toLowerCase()) ||
      log.source_product.toLowerCase().includes(filter.toLowerCase());
    
    const matchesSeverity = !selectedSeverity || log.event.severity === selectedSeverity;
    const matchesSource = !selectedSource || log.source_type === selectedSource;
    
    return matchesFilter && matchesSeverity && matchesSource;
  });

  return (
    <div className="cyber-card h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-soar-bright animate-pulse" />
          <h2 className="text-xl font-semibold text-white">Live Threat Stream</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-morphism">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">{filteredLogs.length} events</span>
          </div>
        </div>
        
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded border-gray-600 bg-gray-700 text-soar-bright focus:ring-soar-bright"
          />
          Auto-scroll
        </label>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search threats..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cyber-gray rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:border-soar-bright focus:outline-none transition-colors"
          />
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-3 flex-wrap">
          {/* Severity Filters */}
          <div className="flex gap-2">
            <span className="text-xs text-gray-500 self-center">Severity:</span>
            {Object.keys(severityColors).map((severity) => (
              <button
                key={severity}
                onClick={() => setSelectedSeverity(selectedSeverity === severity ? null : severity)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSeverity === severity
                    ? severityColors[severity as keyof typeof severityColors]
                    : 'glass-morphism hover:bg-white/10'
                }`}
              >
                {severity}
              </button>
            ))}
          </div>

          {/* Source Filters */}
          <div className="flex gap-2">
            <span className="text-xs text-gray-500 self-center">Source:</span>
            {['IDPS', 'WAF', 'SIEM', 'EDR', 'AV'].map((source) => (
              <button
                key={source}
                onClick={() => {
                  if (source === 'WAF') {
                    setSelectedSource(selectedSource === 'H-WAF' || selectedSource === 'N-WAF' ? null : 'H-WAF');
                  } else {
                    setSelectedSource(selectedSource === source ? null : source);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSource === source || (source === 'WAF' && (selectedSource === 'H-WAF' || selectedSource === 'N-WAF'))
                    ? 'bg-soar-medium text-white'
                    : 'glass-morphism hover:bg-white/10'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-soar-medium scrollbar-track-cyber-gray"
        onScroll={(e) => {
          const element = e.currentTarget;
          const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10;
          if (!isAtBottom && autoScroll) setAutoScroll(false);
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredLogs.map((log) => {
            const Icon = sourceIcons[log.source_type] || Shield;
            const severityClass = severityColors[log.event.severity];
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg border ${severityClass} hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden`}
              >
                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="flex items-start gap-3 relative z-10">
                  {/* Icon */}
                  <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-white truncate group-hover:text-soar-bright transition-colors">
                          {log.threat.name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <span className="font-medium">{log.source_product}</span>
                          <span>•</span>
                          <span>{log.event.action}</span>
                          {log.network && (
                            <>
                              <span>•</span>
                              <span className="text-xs">{log.network.source_ip} → {log.network.destination_ip}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Timestamp & Confidence */}
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {format(new Date(log.timestamp), 'HH:mm:ss')}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="text-xs text-gray-400">AI:</div>
                          <div className="text-xs font-medium text-soar-bright">
                            {(log.event.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    {log.soar?.automated_response && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 text-xs text-gray-400"
                      >
                        <span className="text-soar-bright">→</span> Auto-response: {log.soar.response_actions.join(', ')}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Filter className="w-12 h-12 mb-3" />
            <p>No logs match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}