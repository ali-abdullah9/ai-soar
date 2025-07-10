import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

// Mock window.matchMedia for Chakra UI's media query usage in tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Ensure ChakraProvider is globally available for tests
export const chakraWrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(ChakraProvider, null, children);
};

// Add any global setup for Chakra UI or React here if needed.
