import React, { useEffect } from 'react';
import { IconButton, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

// Lazy load Framer Motion
const MotionIconButton = motion(IconButton);

const ThemeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colorMode === 'light' ? '#f7f9fc' : '#1a202c');
    }
  }, [colorMode]);

  return (
    <MotionIconButton
      aria-label="Toggle theme"
      role="button"
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      variant="ghost"
      size="lg"
    />
  );
};

export default ThemeToggle;