// frontend/src/lib/store.ts
import { create } from 'zustand';
import { SecurityLog, DashboardMetrics } from './types';
import { mockLogs } from './mockData';

interface LogStore {
  logs: SecurityLog[];
  metrics: DashboardMetrics | null;
  filter: {
    severity: string | null;
    source: string | null;
    searchTerm: string;
  };
  
  setFilter: (filter: Partial<LogStore['filter']>) => void;
  addLog: (log: SecurityLog) => void;
  clearLogs: () => void;
}

export const useLogStore = create<LogStore>((set) => ({
  // Initialize with mock data
  logs: mockLogs,
  metrics: generateMetricsFromLogs(mockLogs),
  filter: {
    severity: null,
    source: null,
    searchTerm: '',
  },

  setFilter: (newFilter) => set((state) => ({
    filter: { ...state.filter, ...newFilter }
  })),

  addLog: (log) => set((state) => {
    const newLogs = [...state.logs, log];
    return {
      logs: newLogs,
      metrics: generateMetricsFromLogs(newLogs)
    };
  }),

  clearLogs: () => set({ logs: [], metrics: null }),
}));

// Helper function to generate metrics from logs
function generateMetricsFromLogs(logs: SecurityLog[]): DashboardMetrics {
  const severityCounts = logs.reduce((acc, log) => {
    acc[log.event.severity] = (acc[log.event.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceCounts = logs.reduce((acc, log) => {
    acc[log.source_type] = (acc[log.source_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalAlerts: logs.length,
    criticalAlerts: severityCounts.critical || 0,
    blockedThreats: logs.filter(l => l.event.action === 'blocked').length,
    averageResponseTime: 24.5,
    alertsBySource: sourceCounts,
    alertsBySeverity: severityCounts,
    recentAlerts: logs.slice(-10),
  };
}

// Selector hooks
export const useFilteredLogs = () => {
  const { logs, filter } = useLogStore();
  
  return logs.filter(log => {
    const matchesSearch = !filter.searchTerm || 
      log.threat.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      log.source_product.toLowerCase().includes(filter.searchTerm.toLowerCase());
    
    const matchesSeverity = !filter.severity || log.event.severity === filter.severity;
    const matchesSource = !filter.source || log.source_type === filter.source;
    
    return matchesSearch && matchesSeverity && matchesSource;
  });
};