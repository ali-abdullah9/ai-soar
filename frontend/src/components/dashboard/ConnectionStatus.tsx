// frontend/src/components/dashboard/ConnectionStatus.tsx
'use client';

import { useLogStore } from '@/lib/store';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConnectionStatus() {
  const { isConnected, connectionError } = useLogStore();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 z-50"
      >
        {isConnected ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-green-500/30">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Connected</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-red-500/30">
            <WifiOff className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">Disconnected</span>
            {connectionError && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-red-400" />
                <span className="text-xs text-red-400">{connectionError}</span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}