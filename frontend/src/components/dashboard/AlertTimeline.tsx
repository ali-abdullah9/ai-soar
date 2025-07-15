"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SecurityLog } from "@/lib/types";
import { format } from "date-fns";
import {
  Clock,
  Shield,
  Globe,
  Bug,
  Monitor,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
  LucideIcon,
} from "lucide-react";

interface AlertTimelineProps {
  logs: SecurityLog[];
}

const typeIcons: Record<string, LucideIcon> = {
  IDPS: Shield,
  "H-WAF": Globe,
  "N-WAF": Globe,
  SIEM: Monitor,
  EDR: Monitor,
  AV: Bug,
  AM: Bug,
};

const severityColors = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-soar-bright",
  info: "bg-gray-500",
};

export default function AlertTimeline({ logs }: AlertTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [timeRange, setTimeRange] = useState("1h");

  // Group logs by time intervals
  const groupedLogs = logs.reduce((acc, log) => {
    const hour = format(new Date(log.timestamp), "HH:00");
    if (!acc[hour]) acc[hour] = [];
    acc[hour].push(log);
    return acc;
  }, {} as Record<string, SecurityLog[]>);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="cyber-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-soar-bright" />
          <h2 className="text-xl font-semibold text-white">Attack Timeline</h2>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 p-1 glass-morphism rounded-lg">
          {["1h", "6h", "24h", "7d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                timeRange === range
                  ? "bg-soar-medium text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-soar-bright via-soar-medium to-transparent" />

        {/* Time Groups */}
        {Object.entries(groupedLogs)
          .sort(([a], [b]) => b.localeCompare(a))
          .slice(0, 10)
          .map(([hour, hourLogs], groupIndex) => (
            <motion.div
              key={hour}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="mb-8"
            >
              {/* Time Label */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-cyber-gray border-2 border-soar-medium">
                  <span className="text-sm font-bold text-soar-bright">
                    {hour}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {hourLogs.length} events
                </div>
              </div>

              {/* Events in this hour */}
              <div className="ml-20 space-y-3">
                {hourLogs.slice(0, 5).map((log) => {
                  const Icon = typeIcons[log.source_type];
                  const isExpanded = expandedItems.has(log.id);

                  return (
                    <motion.div
                      key={log.id}
                      layout
                      className="glass-morphism rounded-lg p-4 border border-gray-800 hover:border-soar-medium/50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Severity Indicator */}
                          <div
                            className={`w-2 h-2 mt-2 rounded-full ${
                              severityColors[log.event.severity]
                            }`}
                          />

                          {/* Icon */}
                          <div className="p-2 rounded-lg bg-white/5">
                            <Icon className="w-4 h-4 text-soar-bright" />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-white">
                                {log.threat.name}
                              </h4>
                              {log.threat.technique && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                                  <Target className="w-3 h-3" />
                                  {log.threat.technique.mitre_attack_id}
                                </div>
                              )}
                            </div>

                            <p className="text-sm text-gray-400 mt-1">
                              {log.source_product} •{" "}
                              {format(new Date(log.timestamp), "HH:mm:ss")}
                            </p>

                            {/* Expanded Details */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-3 space-y-2 overflow-hidden"
                                >
                                  {log.network && (
                                    <div className="text-sm text-gray-400">
                                      <span className="text-gray-500">
                                        Network:
                                      </span>{" "}
                                      {log.network.source_ip} →{" "}
                                      {log.network.destination_ip}
                                    </div>
                                  )}

                                  {log.user && (
                                    <div className="text-sm text-gray-400">
                                      <span className="text-gray-500">
                                        User:
                                      </span>{" "}
                                      {log.user.name} ({log.user.department})
                                    </div>
                                  )}

                                  {log.soar?.automated_response && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                                        Auto-remediated
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {log.soar.response_actions.join(", ")}
                                      </div>
                                    </div>
                                  )}

                                  {log.threat.technique && (
                                    <a
                                      href={`https://attack.mitre.org/techniques/${log.threat.technique.mitre_attack_id}/`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-soar-bright hover:underline"
                                    >
                                      View MITRE ATT&CK details
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Expand Button */}
                        <button
                          onClick={() => toggleExpand(log.id)}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}

                {hourLogs.length > 5 && (
                  <div className="text-center">
                    <button className="text-sm text-soar-bright hover:underline">
                      View {hourLogs.length - 5} more events
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
