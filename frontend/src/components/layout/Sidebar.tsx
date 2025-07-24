'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Activity,
  BarChart3,
  AlertTriangle,
  Zap,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Network,
  Lock,
  Menu,
  X
} from 'lucide-react';

interface MenuItem {
  id: string;
  icon: any;
  label: string;
  href: string;
  description: string;
  badge?: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      icon: Activity,
      label: 'SOC Overview',
      href: '/dashboard',
      description: 'Real-time monitoring & KPIs',
      badge: 'Live'
    },
    {
      id: 'threats',
      icon: AlertTriangle,
      label: 'Active Threats',
      href: '/threats',
      description: 'Incident management & hunting'
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Threat Intelligence', 
      href: '/analytics',
      description: 'Deep analysis & patterns'
    },
    {
      id: 'playbooks',
      icon: Zap,
      label: 'Response Playbooks',
      href: '/playbooks',
      description: 'Automated workflows'
    },
    {
      id: 'ai-models',
      icon: Brain,
      label: 'AI Detection',
      href: '/ai-models',
      description: 'ML models & training'
    },
    {
      id: 'network',
      icon: Network,
      label: 'Network Security',
      href: '/network',
      description: 'Firewall & traffic analysis'
    },
    {
      id: 'compliance',
      icon: Lock,
      label: 'Compliance',
      href: '/compliance',
      description: 'Audit & regulations'
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Configuration',
      href: '/settings',
      description: 'System preferences'
    }
  ];

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-r border-cyan-500/20 z-50 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/30">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3"
                >
                  <div className="relative">
                    <Shield className="w-8 h-8 text-cyan-400" />
                    <motion.div 
                      className="absolute inset-0 blur-lg bg-cyan-400/50"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      SOAR
                    </span>
                    <div className="text-xs text-gray-500">AI Defense</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                        ${isActive 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-r-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {/* Icon with glow effect */}
                      <div className="relative">
                        <Icon className={`w-5 h-5 transition-colors ${
                          isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'
                        }`} />
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 blur-md bg-cyan-400/50"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                      
                      {/* Label and Description */}
                      <AnimatePresence mode="wait">
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex-1 min-w-0"
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0">
                                <div className="font-medium truncate">{item.label}</div>
                                <div className="text-xs text-gray-500 truncate mt-0.5">
                                  {item.description}
                                </div>
                              </div>
                              {item.badge && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-2 px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full border border-green-500/30"
                                >
                                  {item.badge}
                                </motion.span>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* System Status Footer */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-6 border-t border-gray-700/30"
            >
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-green-400">All Systems Operational</span>
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  AI engines: <span className="text-green-400">Online</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>v2.1.0</span>
                  <span>Uptime: 99.9%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}