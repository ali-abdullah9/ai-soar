// lib/realLogsService.ts
interface RawSuricataLog {
    flow_id: number;
    input: { type: string };
    '@timestamp': string;
    proto: string;
    agent: {
      name: string;
      type: string;
      id: string;
      version: string;
      ephemeral_id: string;
    };
    log: {
      offset: number;
      file: {
        device_id: string;
        fingerprint: string;
        path: string;
        inode: string;
      };
    };
    tx_id?: number;
    http?: {
      status: number;
      length: number;
      http_port: number;
      hostname: string;
      url: string;
      http_method: string;
      http_user_agent: string;
      http_content_type: string;
      protocol: string;
    };
    fileinfo?: {
      stored: boolean;
      size: number;
      tx_id: number;
      state: string;
      filename: string;
      gaps: boolean;
    };
    host: { name: string };
    dest_port: number;
    tags: string[];
    source: string;
    pkt_src: string;
    in_iface: string;
    ecs: { version: string };
    '@version': string;
    src_ip: string;
    dest_ip: string;
    src_port?: number;
    timestamp: string;
    event_type: string;
    type_log: string;
    app_proto?: string;
  }
  
  import { SecurityLog, DashboardMetrics } from './types';
  
  class RealLogsService {
    private cache: SecurityLog[] = [];
    private lastFetch: number = 0;
    private cacheDuration: number = 30000; // 30 seconds
  
    // Convert raw Suricata logs to our SecurityLog format
    private transformSuricataLog(raw: RawSuricataLog): SecurityLog {
      const severity = this.determineSeverity(raw);
      const threatName = this.generateThreatName(raw);
      const confidence = this.calculateConfidence(raw);
  
      return {
        id: `${raw.flow_id}-${raw.tx_id || Date.now()}`,
        timestamp: raw['@timestamp'] || raw.timestamp,
        source_type: this.mapSourceType(raw.source),
        source_product: raw.source || 'Suricata IDPS',
        event: {
          category: this.determineCategory(raw),
          type: raw.event_type as any || 'alert',
          action: this.determineAction(raw),
          severity: severity,
          confidence: confidence
        },
        threat: {
          name: threatName,
          category: this.determineThreatCategory(raw),
          technique: this.getMitreMapping(raw)
        },
        network: {
          source_ip: raw.src_ip,
          destination_ip: raw.dest_ip,
          source_port: raw.src_port || 0,
          destination_port: raw.dest_port,
          protocol: raw.proto,
          direction: this.determineDirection(raw.src_ip)
        },
        ...(raw.http && {
          http: {
            method: raw.http.http_method,
            uri: raw.http.url,
            user_agent: raw.http.http_user_agent,
            status_code: raw.http.status,
            request_body: undefined
          }
        }),
        ...(raw.fileinfo && {
          file: {
            path: raw.fileinfo.filename,
            size: raw.fileinfo.size
          }
        })
      };
    }
  
    private determineSeverity(raw: RawSuricataLog): 'critical' | 'high' | 'medium' | 'low' | 'info' {
      // Analyze various factors to determine severity
      if (raw.http?.status === 404 && raw.http?.url?.includes('logs')) {
        return 'medium'; // Reconnaissance attempt
      }
      
      if (raw.http?.url?.includes('script') || raw.http?.url?.includes('exec')) {
        return 'critical'; // Potential code injection
      }
      
      if (raw.fileinfo?.size && raw.fileinfo.size > 1000000) {
        return 'high'; // Large file transfer
      }
      
      if (raw.http?.status && raw.http.status >= 400) {
        return 'medium'; // HTTP errors
      }
      
      return 'low';
    }
  
    private generateThreatName(raw: RawSuricataLog): string {
      if (raw.http?.url?.includes('logs')) {
        return 'Log Access Attempt';
      }
      
      if (raw.http?.url?.includes('admin')) {
        return 'Admin Panel Access';
      }
      
      if (raw.fileinfo) {
        return 'File Transfer Detected';
      }
      
      if (raw.http) {
        return `HTTP ${raw.http.http_method} to ${raw.http.hostname}`;
      }
      
      return `${raw.proto} Traffic Analysis`;
    }
  
    private calculateConfidence(raw: RawSuricataLog): number {
      let confidence = 0.5; // Base confidence
      
      // Increase confidence based on various factors
      if (raw.http?.url) confidence += 0.2;
      if (raw.fileinfo) confidence += 0.15;
      if (raw.http?.status && raw.http.status >= 400) confidence += 0.1;
      if (raw.src_ip && raw.dest_ip) confidence += 0.1;
      
      return Math.min(confidence, 0.95);
    }
  
    private mapSourceType(source: string): SecurityLog['source_type'] {
      if (source?.includes('idps') || source?.includes('suricata')) {
        return 'IDPS';
      }
      return 'IDPS'; // Default for Suricata logs
    }
  
    private determineCategory(raw: RawSuricataLog): SecurityLog['event']['category'] {
      if (raw.http) return 'web-attack';
      if (raw.fileinfo) return 'malware';
      return 'network';
    }
  
    private determineAction(raw: RawSuricataLog): SecurityLog['event']['action'] {
      if (raw.http?.status && raw.http.status >= 400) {
        return 'blocked';
      }
      return 'alerted';
    }
  
    private determineThreatCategory(raw: RawSuricataLog): string {
      if (raw.http?.url?.includes('logs')) return 'reconnaissance';
      if (raw.http) return 'web-attack';
      if (raw.fileinfo) return 'malware';
      return 'network-scan';
    }
  
    private getMitreMapping(raw: RawSuricataLog): SecurityLog['threat']['technique'] {
      if (raw.http?.url?.includes('logs')) {
        return {
          mitre_attack_id: 'T1083',
          mitre_attack_name: 'File and Directory Discovery'
        };
      }
      
      if (raw.http?.url?.includes('admin')) {
        return {
          mitre_attack_id: 'T1190',
          mitre_attack_name: 'Exploit Public-Facing Application'
        };
      }
      
      return {
        mitre_attack_id: 'T1046',
        mitre_attack_name: 'Network Service Scanning'
      };
    }
  
    private determineDirection(srcIp: string): 'inbound' | 'outbound' {
      // Simple logic - can be enhanced based on your network topology
      if (srcIp.startsWith('192.168.') || srcIp.startsWith('10.') || srcIp.startsWith('172.')) {
        return 'outbound';
      }
      return 'inbound';
    }
  
    // Fetch real logs from the JSON file
    async fetchRealLogs(): Promise<SecurityLog[]> {
      const now = Date.now();
      
      // Use cache if it's fresh
      if (this.cache.length > 0 && now - this.lastFetch < this.cacheDuration) {
        return this.cache;
      }
  
      try {
        const response = await fetch('/logs/logs.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawLogs: RawSuricataLog[] = await response.json();
        
        // Transform raw logs to our format
        const transformedLogs = rawLogs
          .filter(log => log && log.src_ip && log.dest_ip) // Filter valid logs
          .map(log => this.transformSuricataLog(log))
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort by newest first
        
        this.cache = transformedLogs;
        this.lastFetch = now;
        
        return transformedLogs;
      } catch (error) {
        console.error('Error fetching real logs:', error);
        
        // Return mock data as fallback
        return this.getFallbackMockData();
      }
    }
  
    // Generate metrics from real logs
    generateMetricsFromRealLogs(logs: SecurityLog[]): DashboardMetrics {
      const severityCounts = logs.reduce((acc, log) => {
        acc[log.event.severity] = (acc[log.event.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  
      const sourceCounts = logs.reduce((acc, log) => {
        acc[log.source_type] = (acc[log.source_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  
      const blockedThreats = logs.filter(log => log.event.action === 'blocked').length;
      const avgResponseTime = 24.5; // This would come from actual response time calculation
  
      return {
        totalAlerts: logs.length,
        criticalAlerts: severityCounts.critical || 0,
        blockedThreats,
        averageResponseTime: avgResponseTime,
        alertsBySource: sourceCounts,
        alertsBySeverity: severityCounts,
        recentAlerts: logs.slice(0, 10),
      };
    }
  
    private getFallbackMockData(): SecurityLog[] {
      // Fallback mock data in case real logs can't be loaded
      return [
        {
          id: 'mock-001',
          timestamp: new Date().toISOString(),
          source_type: 'IDPS',
          source_product: 'Suricata (Fallback)',
          event: {
            category: 'web-attack',
            type: 'alert',
            action: 'alerted',
            severity: 'medium',
            confidence: 0.75
          },
          threat: {
            name: 'Mock Threat - Real logs unavailable',
            category: 'test'
          },
          network: {
            source_ip: '192.168.1.1',
            destination_ip: '10.0.0.1',
            source_port: 80,
            destination_port: 443,
            protocol: 'TCP',
            direction: 'inbound'
          }
        }
      ];
    }
  
    // Watch for real-time updates (if you implement WebSocket later)
    watchForUpdates(callback: (logs: SecurityLog[]) => void): () => void {
      const interval = setInterval(async () => {
        const logs = await this.fetchRealLogs();
        callback(logs);
      }, 30000); // Check every 30 seconds
  
      return () => clearInterval(interval);
    }
  }
  
  // Export singleton instance
  export const realLogsService = new RealLogsService();
  
  // React hook for using real logs
  import { useState, useEffect } from 'react';
  
  export function useRealLogs() {
    const [logs, setLogs] = useState<SecurityLog[]>([]);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const loadLogs = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const realLogs = await realLogsService.fetchRealLogs();
          const realMetrics = realLogsService.generateMetricsFromRealLogs(realLogs);
          
          setLogs(realLogs);
          setMetrics(realMetrics);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load logs');
        } finally {
          setLoading(false);
        }
      };
  
      loadLogs();
  
      // Set up real-time updates
      const unsubscribe = realLogsService.watchForUpdates((updatedLogs) => {
        setLogs(updatedLogs);
        setMetrics(realLogsService.generateMetricsFromRealLogs(updatedLogs));
      });
  
      return unsubscribe;
    }, []);
  
    return { logs, metrics, loading, error };
  }
  
  // Updated store to use real logs
  import { create } from 'zustand';
  
  interface RealLogStore {
    logs: SecurityLog[];
    metrics: DashboardMetrics | null;
    loading: boolean;
    error: string | null;
    filter: {
      severity: string | null;
      source: string | null;
      searchTerm: string;
    };
    
    setFilter: (filter: Partial<RealLogStore['filter']>) => void;
    loadRealLogs: () => Promise<void>;
    refreshLogs: () => Promise<void>;
  }
  
  export const useLogStore = create<RealLogStore>((set, get) => ({
    logs: [],
    metrics: null,
    loading: true,
    error: null,
    filter: {
      severity: null,
      source: null,
      searchTerm: '',
    },
  
    setFilter: (newFilter) => set((state) => ({
      filter: { ...state.filter, ...newFilter }
    })),
  
    loadRealLogs: async () => {
      try {
        set({ loading: true, error: null });
        
        const realLogs = await realLogsService.fetchRealLogs();
        const realMetrics = realLogsService.generateMetricsFromRealLogs(realLogs);
        
        set({
          logs: realLogs,
          metrics: realMetrics,
          loading: false
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load logs',
          loading: false
        });
      }
    },
  
    refreshLogs: async () => {
      // Force refresh by clearing cache
      const service = realLogsService as any;
      service.cache = [];
      service.lastFetch = 0;
      
      await get().loadRealLogs();
    }
  }));
  
  // Selector for filtered real logs
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