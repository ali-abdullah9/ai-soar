// lib/store.ts - Updated to remove mock data references

// This file is now mostly replaced by realLogsService.ts
// You can either delete this file or keep it for any other state management needs

// The main store functionality has been moved to realLogsService.ts
// which provides:
// - useLogStore() - main store with real data
// - useFilteredLogs() - filtered logs selector
// - useRealLogs() - React hook for real logs

// If you have any other global state needs (like UI state, settings, etc.)
// you can add them here:

import { create } from 'zustand';

interface UIStore {
  sidebarCollapsed: boolean;
  theme: 'dark' | 'light';
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    timestamp: Date;
  }>;
  
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  addNotification: (notification: Omit<UIStore['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  theme: 'dark',
  notifications: [],

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  setTheme: (theme) => set({ theme }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
      }
    ]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
}));