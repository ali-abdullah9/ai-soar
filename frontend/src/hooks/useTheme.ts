import { useColorMode } from '@chakra-ui/react';
import React from 'react';

interface UseThemeResult {
  colorMode: 'light' | 'dark';
  toggleColorMode: () => void;
}

const useTheme = (): UseThemeResult => {
  const { colorMode, toggleColorMode } = useColorMode();

  // Add custom logic for theme persistence
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== colorMode) {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  React.useEffect(() => {
    localStorage.setItem('theme', colorMode);
  }, [colorMode]);

  return { colorMode, toggleColorMode };
};

export { useTheme };