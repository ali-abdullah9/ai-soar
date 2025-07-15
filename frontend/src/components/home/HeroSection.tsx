'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { Shield, Activity, Lock, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-cyber-black to-cyber-gray">
      {/* Cyber Grid Background */}
      <div 
        className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-20"
        style={{ backgroundPosition: '0 0, 25px 25px' }}
      />

      {/* Animated Scan Lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="scan-line animate-scan" />
        <div className="scan-line animate-scan" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2"
              >
                <Shield className="w-6 h-6 text-soar-bright" />
                <span className="text-soar-bright font-medium">AI-Powered Security</span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold">
                <span className="block text-white">Next-Gen</span>
                <span className="block text-gradient animate-glow">SOAR Platform</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-lg">
                Orchestrate, automate, and respond to security threats with 
                AI-driven intelligence. Protect your infrastructure in real-time.
              </p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Activity, label: 'Response Time', value: '< 30s' },
                { icon: Lock, label: 'Threats Blocked', value: '99.9%' },
                { icon: Zap, label: 'Automation Rate', value: '85%' },
                { icon: Shield, label: 'AI Accuracy', value: '95%' },
              ].map((stat, index) => (
                <div key={index} className="cyber-card p-4 group hover:border-soar-bright/50 transition-all">
                  <stat.icon className="w-5 h-5 text-soar-medium mb-2 group-hover:text-soar-bright transition-colors" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 pt-4"
            >
              <Link href="/dashboard">
                <button className="px-8 py-4 bg-gradient-to-r from-soar-dark to-soar-medium text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-soar-medium/50 transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  View Dashboard
                </button>
              </Link>
              <Link href="/demo">
                <button className="px-8 py-4 glass-morphism border border-soar-medium/30 text-soar-bright font-semibold rounded-lg hover:bg-soar-medium/10 transition-all duration-200">
                  Watch Demo
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - 3D Spline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[600px] lg:h-[700px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-soar-dark/20 to-soar-bright/20 blur-3xl" />
            <div className="relative h-full ">
              {isLoaded && (
                <Spline 
                  scene="https://prod.spline.design/TlLhJFnAt8jEfGxC/scene.splinecode"
                  className="w-full h-full"
                />
              )}
              {/* Loading State */}
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-4 border-soar-bright/30 border-t-soar-bright rounded-full animate-spin" />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyber-gray to-transparent" />
    </section>
  );
}