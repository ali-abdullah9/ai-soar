import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const icon = useColorModeValue(<MoonIcon />, <SunIcon />);
  const label = `Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`;

  return (
    <IconButton
      aria-label={label}
      icon={icon}
      onClick={toggleColorMode}
      variant="ghost"
      size="md"
      fontSize="xl"
    />
  );
};

export default ThemeToggle;