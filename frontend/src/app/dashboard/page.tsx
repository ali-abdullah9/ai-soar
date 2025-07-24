"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Activity, AlertTriangle, Zap, TrendingUp, TrendingDown,
  BarChart3, Brain, Search, Info
} from "lucide-react";
import { useLogStore, useFilteredLogs } from "@/lib/realLogsService";
import SourceFilter from "@/components/dashboard/SourceFilter";
import FunGraphs from "@/components/dashboard/Graphs";

// Enhanced Metrics Cards with Real Data
const MetricsCards = () => {
  const { metrics, refreshLogs } = useLogStore();

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gray-800/50 rounded-2xl p-6 animate-pulse">
            <div className="h-16 bg-gray-700/50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: 'total',
      title: 'Total Alerts',
      value: metrics.totalAlerts,
      change: { value: 12.5, isUp: true },
      icon: Activity,
      color: 'from-cyan-500 to-blue-500',
      bgGlow: 'bg-cyan-500/20'
    },
    {
      id: 'critical',
      title: 'Critical Threats',
      value: metrics.criticalAlerts,
      change: { value: 5.2, isUp: false },
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500',
      bgGlow: 'bg-red-500/20'
    },
    {
      id: 'blocked',
      title: 'Threats Blocked',
      value: metrics.blockedThreats,
      change: { value: 18.7, isUp: true },
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      bgGlow: 'bg-green-500/20'
    },
    {
      id: 'response',
      title: 'Avg Response',
      value: metrics.averageResponseTime,
      suffix: 's',
      change: { value: 23.1, isUp: false },
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      bgGlow: 'bg-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative"
          >
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 overflow-hidden">
              {/* Animated Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Floating Particles Effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                    animate={{
                      x: [0, 100, 0],
                      y: [0, -50, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.8,
                      repeat: Infinity
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.bgGlow} backdrop-blur-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className={`flex items-center gap-1 text-sm ${
                    card.change.isUp ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {card.change.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-medium">{card.change.value}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-gray-400 text-sm">{card.title}</h3>
                  <div className="text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-all">
                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}{card.suffix || ''}
                  </div>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Real-Time Threat Stream with Enhanced Filtering
const ThreatStream = () => {
  const { filter, setFilter } = useLogStore();
  const logs = useFilteredLogs();
  const [searchTerm, setSearchTerm] = useState('');

  const severityColors = {
    critical: 'border-red-500 bg-red-500/10 text-red-400',
    high: 'border-orange-500 bg-orange-500/10 text-orange-400',
    medium: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
    low: 'border-cyan-400 bg-cyan-400/10 text-cyan-400',
    info: 'border-gray-500 bg-gray-500/10 text-gray-400',
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.threat.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 h-[600px] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="w-6 h-6 text-cyan-400" />
          </motion.div>
          <h2 className="text-xl font-semibold text-white">Live Threat Stream</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">{filteredLogs.length} events</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search threats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-gray-500 self-center">Severity:</span>
          {Object.keys(severityColors).map((severity) => (
            <button
              key={severity}
              onClick={() => setFilter({ severity: filter.severity === severity ? null : severity })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter.severity === severity
                  ? severityColors[severity as keyof typeof severityColors]
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
              }`}
            >
              {severity}
            </button>
          ))}
        </div>
      </div>

      {/* Threat List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredLogs.slice(0, 20).map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, x: 10 }}
            className={`p-4 rounded-lg border ${severityColors[log.event.severity]} cursor-pointer group relative overflow-hidden`}
          >
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-white group-hover:text-cyan-400 transition-colors">
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
                
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="text-xs text-gray-400">AI:</div>
                    <div className="text-xs font-medium text-cyan-400">
                      {(log.event.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Enhanced AI Intelligence Panel with Explanation
const AIIntelligencePanel = () => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* AI Model Status */}
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">AI Detection Models</h3>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="ml-auto p-1 rounded-full hover:bg-gray-700/50 transition-colors"
          >
            <Info className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Model Explanation */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          >
            <div className="text-sm text-blue-400">
              <strong>Model Performance Metrics:</strong>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• <strong>Accuracy:</strong> Percentage of correct threat classifications</li>
                <li>• <strong>Active:</strong> Model is running and processing threats</li>
                <li>• <strong>Training:</strong> Model is learning from new data</li>
              </ul>
            </div>
          </motion.div>
        )}
        
        <div className="space-y-3">
          {[
            { name: 'Anomaly Detector', status: 'Active', accuracy: 97.2, color: 'green', description: 'Detects unusual network patterns' },
            { name: 'Threat Classifier', status: 'Active', accuracy: 94.8, color: 'green', description: 'Categorizes threat types' },
            { name: 'Sequence Analyzer', status: 'Training', accuracy: 89.3, color: 'yellow', description: 'Analyzes attack sequences' },
            { name: 'Context Scorer', status: 'Active', accuracy: 92.1, color: 'green', description: 'Evaluates threat context' }
          ].map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg group hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  model.color === 'green' ? 'bg-green-400' : 
                  model.color === 'yellow' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                }`} />
                <div>
                  <span className="text-white text-sm font-medium">{model.name}</span>
                  <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                    {model.description}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">{model.status}</div>
                <div className="text-sm font-medium text-cyan-400">{model.accuracy}%</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Real-time Analytics */}
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Threat Analytics</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-800/30 rounded-lg">
              <div className="text-2xl font-bold text-red-400">247</div>
              <div className="text-xs text-gray-400">Active Threats</div>
            </div>
            <div className="text-center p-3 bg-gray-800/30 rounded-lg">
              <div className="text-2xl font-bold text-green-400">1,834</div>
              <div className="text-xs text-gray-400">Blocked Today</div>
            </div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">23</div>
            <div className="text-xs text-gray-400">Critical Alerts</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Dashboard Component
export default function DashboardPage() {
  const { metrics, refreshLogs, loadRealLogs, filter, setFilter } = useLogStore();
  const logs = useFilteredLogs();
  const [timeRange, setTimeRange] = useState("1h");

  useEffect(() => {
    // Load real logs on mount
    loadRealLogs();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshLogs();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadRealLogs, refreshLogs]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Shield className="w-12 h-12 text-cyan-400" />
            <motion.div 
              className="absolute inset-0 blur-xl bg-cyan-400/50"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">
              Security Operations Center
            </h1>
            <p className="text-gray-400 text-lg">
              Real-time threat monitoring powered by AI
            </p>
          </div>
        </div>
        
        {/* Time Range & Refresh */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refreshLogs()}
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-colors"
          >
            Refresh Data
          </motion.button>
          
          <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50">
            {['1h', '24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <MetricsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left: Threat Stream */}
        <div className="col-span-12 lg:col-span-6">
          <ThreatStream />
        </div>

        {/* Middle: Source Filter */}
        <div className="col-span-12 lg:col-span-3">
          <SourceFilter
            selectedSource={filter.source}
            onSourceChange={(source) => setFilter({ source })}
            sourceCounts={metrics?.alertsBySource || {}}
          />
        </div>

        {/* Right: AI Intelligence */}
        <div className="col-span-12 lg:col-span-3">
          <AIIntelligencePanel />
        </div>
      </div>

      {/* Fun Graphs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>
        </div>
        <FunGraphs logs={logs} />
      </motion.div>
    </div>
  );
}