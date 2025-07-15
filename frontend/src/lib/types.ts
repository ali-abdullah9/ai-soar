// frontend/src/lib/types.ts
export interface SecurityLog {
  id: string;
  timestamp: string;
  source_type: 'IDPS' | 'H-WAF' | 'N-WAF' | 'SIEM' | 'EDR' | 'AV' | 'AM';
  source_product: string;
  event: {
    category: 'intrusion' | 'authentication' | 'malware' | 'web-attack' | 'network' | 'ddos' | 'reconnaissance' | 'generic';
    type: 'alert' | 'block' | 'detect' | 'prevent';
    action: 'allowed' | 'blocked' | 'quarantined' | 'alerted';
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    confidence: number;
  };
  threat: {
    name: string;
    category: string;
    technique?: {
      mitre_attack_id: string;
      mitre_attack_name: string;
    };
  };
  network?: {
    source_ip: string;
    destination_ip: string;
    source_port: number;
    destination_port: number;
    protocol: string;
    direction: 'inbound' | 'outbound';
  };
  user?: {
    name: string;
    email: string;
    department: string;
    risk_score: number;
  };
  http?: {
    method: string;
    uri: string;
    user_agent: string;
    status_code: number;
    request_body?: string;
  };
  file?: {
    path: string;
    hash?: {
      md5: string;
      sha256: string;
    };
    size: number;
  };
  process?: {
    name: string;
    pid: number;
    parent_pid: number;
    command_line: string;
  };
  soar?: {
    correlation_id: string;
    automated_response: boolean;
    response_actions: string[];
    analyst_notes: string;
  };
}

export interface DashboardMetrics {
  totalAlerts: number;
  criticalAlerts: number;
  blockedThreats: number;
  averageResponseTime: number;
  alertsBySource: Record<string, number>;
  alertsBySeverity: Record<string, number>;
  recentAlerts: SecurityLog[];
}