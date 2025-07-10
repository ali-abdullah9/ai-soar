import { ReactNode } from 'react';

export interface WithChildren {
  children: ReactNode;
}

export type ColorModeType = 'light' | 'dark';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}