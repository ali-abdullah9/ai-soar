"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AlertTimeline from "@/components/dashboard/AlertTimeline";
import SourceDistribution from "@/components/dashboard/SourceDistribution";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import { useLogStore, useFilteredLogs } from "@/lib/store";
import { Shield } from "lucide-react";
import MetricsCards from "@/components/dashboard/MetricsCards";
import LogStream from "@/components/dashboard/LogStream";
import ThreatMap from "@/components/dashboard/ThreatMap";
import SeverityDistribution from "@/components/dashboard/SeverityDistribution";

export default function DashboardPage() {
  const { metrics } = useLogStore();
  const filteredLogs = useFilteredLogs();
  const [timeRange, setTimeRange] = useState("1h");

  return (
    <div className="min-h-screen bg-cyber-black">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-10" />
      <div className="fixed inset-0 bg-gradient-to-br from-soar-darkest/50 via-transparent to-soar-dark/30" />

      {/* Dashboard Header */}
      <div className="relative z-10 px-6 pt-24 pb-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Shield className="w-10 h-10 text-soar-bright" />
                <div className="absolute inset-0 blur-xl bg-soar-bright/50" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Security Operations Center
                </h1>
                <p className="text-gray-400">
                  Real-time threat monitoring and response
                </p>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-2 p-1 glass-morphism rounded-lg">
              {["1h", "24h", "7d", "30d"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    timeRange === range
                      ? "bg-soar-medium text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Metrics Cards */}
          <MetricsCards metrics={metrics} />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-12 gap-6 mt-8">
            {/* Left Column - Log Stream */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-12 lg:col-span-7"
            >
              <LogStream logs={filteredLogs} />
            </motion.div>

            {/* Right Column - Visualizations */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <SeverityDistribution data={metrics?.alertsBySeverity || {}} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <SourceDistribution data={metrics?.alertsBySource || {}} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ThreatMap logs={filteredLogs} />
              </motion.div>
            </div>

            {/* Bottom Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="col-span-12"
            >
              <ActivityHeatmap logs={filteredLogs} />
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="col-span-12"
            >
              <AlertTimeline logs={filteredLogs} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}