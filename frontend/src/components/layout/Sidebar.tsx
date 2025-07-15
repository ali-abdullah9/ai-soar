'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Shield,
  Activity,
  BarChart3,
  AlertTriangle,
  Settings,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  Zap,
  Globe,
  Brain,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Main',
    items: [
      { icon: Activity, label: 'Dashboard', href: '/dashboard' },
      { icon: BarChart3, label: 'Analytics', href: '/analytics' },
      { icon: AlertTriangle, label: 'Threats', href: '/threats' },
    ],
  },
  {
    title: 'Security',
    items: [
      { icon: Shield, label: 'IDPS', href: '/security/idps' },
      { icon: Globe, label: 'WAF', href: '/security/waf' },
      { icon: Zap, label: 'SIEM', href: '/security/siem' },
      { icon: Brain, label: 'AI Models', href: '/ai-models' },
    ],
  },
  {
    title: 'System',
    items: [
      { icon: Users, label: 'Users', href: '/users' },
      { icon: FileText, label: 'Reports', href: '/reports' },
      { icon: Settings, label: 'Settings', href: '/settings' },
    ],
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="fixed left-0 top-0 h-full bg-cyber-gray border-r border-gray-800 z-40"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-soar-bright" />
              <div className="absolute inset-0 blur-lg bg-soar-bright/50" />
            </div>
            <span className="text-2xl font-bold text-gradient">SOAR</span>
          </Link>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-3 pb-6">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-soar-medium/20 text-soar-bright border border-soar-medium/30' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-soar-bright' : ''}`} />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-8 bg-soar-bright rounded-r-full"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Status */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">System Active</span>
            </div>
            <span className="text-xs text-gray-500">v2.0.1</span>
          </div>
        </div>
      )}
    </motion.aside>
  );
}