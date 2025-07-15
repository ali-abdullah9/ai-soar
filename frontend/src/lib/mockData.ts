// frontend/src/lib/mockData.ts
import { SecurityLog } from './types';

// Helper to generate timestamps
const generateTimestamp = (minutesAgo: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};
// Define proper types for random selection
type SourceType = SecurityLog['source_type'];
type Severity = SecurityLog['event']['severity'];
type Action = SecurityLog['event']['action'];
type EventCategory = SecurityLog['event']['category'];
export const mockLogs: SecurityLog[] = [
  // IDPS Logs
  {
    id: 'log-001',
    timestamp: generateTimestamp(5),
    source_type: 'IDPS',
    source_product: 'Suricata',
    event: {
      category: 'intrusion',
      type: 'alert',
      action: 'blocked',
      severity: 'critical',
      confidence: 0.95
    },
    threat: {
      name: 'SQL Injection Attempt',
      category: 'web-attack',
      technique: {
        mitre_attack_id: 'T1190',
        mitre_attack_name: 'Exploit Public-Facing Application'
      }
    },
    network: {
      source_ip: '192.168.1.100',
      destination_ip: '10.0.0.50',
      source_port: 45632,
      destination_port: 443,
      protocol: 'TCP',
      direction: 'inbound'
    },
    http: {
      method: 'POST',
      uri: '/api/users?id=1\' OR \'1\'=\'1',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status_code: 403,
      request_body: 'username=admin&password=\' OR \'1\'=\'1'
    },
    soar: {
      correlation_id: 'incident-001',
      automated_response: true,
      response_actions: ['blocked_ip', 'alert_sent'],
      analyst_notes: 'Automated block applied'
    }
  },
  
  // H-WAF Logs
  {
    id: 'log-002',
    timestamp: generateTimestamp(8),
    source_type: 'H-WAF',
    source_product: 'ModSecurity',
    event: {
      category: 'web-attack',
      type: 'block',
      action: 'blocked',
      severity: 'high',
      confidence: 0.88
    },
    threat: {
      name: 'Cross-Site Scripting (XSS)',
      category: 'web-attack',
      technique: {
        mitre_attack_id: 'T1059',
        mitre_attack_name: 'Command and Scripting Interpreter'
      }
    },
    network: {
      source_ip: '203.0.113.45',
      destination_ip: '10.0.0.80',
      source_port: 52341,
      destination_port: 80,
      protocol: 'TCP',
      direction: 'inbound'
    },
    http: {
      method: 'POST',
      uri: '/comments/new',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
      status_code: 403,
      request_body: '<script>alert("XSS")</script>'
    }
  },

  // N-WAF Logs
  {
    id: 'log-003',
    timestamp: generateTimestamp(12),
    source_type: 'N-WAF',
    source_product: 'Cloudflare',
    event: {
      category: 'network',
      type: 'alert',
      action: 'blocked',
      severity: 'critical',
      confidence: 0.99
    },
    threat: {
      name: 'DDoS Attack',
      category: 'ddos',
      technique: {
        mitre_attack_id: 'T1498',
        mitre_attack_name: 'Network Denial of Service'
      }
    },
    network: {
      source_ip: '198.51.100.0',
      destination_ip: '10.0.0.100',
      source_port: 0,
      destination_port: 443,
      protocol: 'TCP',
      direction: 'inbound'
    }
  },

  // SIEM Logs
  {
    id: 'log-004',
    timestamp: generateTimestamp(15),
    source_type: 'SIEM',
    source_product: 'Wazuh',
    event: {
      category: 'authentication',
      type: 'alert',
      action: 'alerted',
      severity: 'high',
      confidence: 0.82
    },
    threat: {
      name: 'Brute Force Attack',
      category: 'authentication',
      technique: {
        mitre_attack_id: 'T1110',
        mitre_attack_name: 'Brute Force'
      }
    },
    network: {
      source_ip: '192.168.1.200',
      destination_ip: '10.0.0.10',
      source_port: 22,
      destination_port: 22,
      protocol: 'TCP',
      direction: 'inbound'
    },
    user: {
      name: 'root',
      email: 'admin@company.com',
      department: 'IT',
      risk_score: 85
    }
  },

  // EDR Logs
  {
    id: 'log-005',
    timestamp: generateTimestamp(20),
    source_type: 'EDR',
    source_product: 'CrowdStrike',
    event: {
      category: 'malware',
      type: 'detect',
      action: 'quarantined',
      severity: 'critical',
      confidence: 0.97
    },
    threat: {
      name: 'Ransomware Detection',
      category: 'malware',
      technique: {
        mitre_attack_id: 'T1486',
        mitre_attack_name: 'Data Encrypted for Impact'
      }
    },
    user: {
      name: 'john_doe',
      email: 'john.doe@company.com',
      department: 'Finance',
      risk_score: 95
    },
    process: {
      name: 'encrypt.exe',
      pid: 4532,
      parent_pid: 1204,
      command_line: 'C:\\Users\\john_doe\\Downloads\\encrypt.exe --all-files'
    },
    file: {
      path: 'C:\\Users\\john_doe\\Downloads\\encrypt.exe',
      hash: {
        md5: 'a1b2c3d4e5f6g7h8i9j0',
        sha256: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
      },
      size: 2048576
    }
  },

  // Antivirus Logs
  {
    id: 'log-006',
    timestamp: generateTimestamp(25),
    source_type: 'AV',
    source_product: 'ClamAV',
    event: {
      category: 'malware',
      type: 'detect',
      action: 'quarantined',
      severity: 'medium',
      confidence: 0.75
    },
    threat: {
      name: 'Trojan.Win32.Generic',
      category: 'malware'
    },
    file: {
      path: '/Users/jane_smith/Downloads/suspicious_file.zip',
      hash: {
        md5: 'f1e2d3c4b5a6978',
        sha256: '123abc456def789123abc456def789123abc456def789123abc456def789'
      },
      size: 524288
    },
    user: {
      name: 'jane_smith',
      email: 'jane.smith@company.com',
      department: 'HR',
      risk_score: 45
    }
  },

  // Anti-malware Logs
  {
    id: 'log-007',
    timestamp: generateTimestamp(30),
    source_type: 'AM',
    source_product: 'Windows Defender',
    event: {
      category: 'malware',
      type: 'prevent',
      action: 'blocked',
      severity: 'high',
      confidence: 0.91
    },
    threat: {
      name: 'Emotet Malware',
      category: 'malware',
      technique: {
        mitre_attack_id: 'T1566',
        mitre_attack_name: 'Phishing'
      }
    },
    file: {
      path: 'C:\\Users\\admin\\AppData\\Local\\Temp\\invoice.doc',
      hash: {
        md5: '9876543210fedcba',
        sha256: 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210'
      },
      size: 315392
    }
  },

  // Add more varied logs...
  {
    id: 'log-008',
    timestamp: generateTimestamp(35),
    source_type: 'IDPS',
    source_product: 'Snort',
    event: {
      category: 'intrusion',
      type: 'alert',
      action: 'alerted',
      severity: 'low',
      confidence: 0.65
    },
    threat: {
      name: 'Port Scan Detected',
      category: 'reconnaissance',
      technique: {
        mitre_attack_id: 'T1046',
        mitre_attack_name: 'Network Service Scanning'
      }
    },
    network: {
      source_ip: '192.168.1.150',
      destination_ip: '10.0.0.0/24',
      source_port: 0,
      destination_port: 0,
      protocol: 'TCP',
      direction: 'inbound'
    }
  },

  // Continue adding more mock logs for each source type...
];

// Generate additional logs with proper typing
const sources: SourceType[] = ['IDPS', 'H-WAF', 'N-WAF', 'SIEM', 'EDR', 'AV', 'AM'];
const severities: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];
const actions: Action[] = ['blocked', 'alerted', 'quarantined'];
const categories: EventCategory[] = ['intrusion', 'malware', 'web-attack', 'network', 'authentication'];

for (let i = 0; i < 50; i++) {
  mockLogs.push({
    id: `log-gen-${i}`,
    timestamp: generateTimestamp(40 + i * 5),
    source_type: sources[Math.floor(Math.random() * sources.length)],
    source_product: 'Generic Product',
    event: {
      category: categories[Math.floor(Math.random() * categories.length)],
      type: 'alert',
      action: actions[Math.floor(Math.random() * actions.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      confidence: 0.5 + Math.random() * 0.5
    },
    threat: {
      name: `Threat ${i}`,
      category: 'generic'
    }
  });
}