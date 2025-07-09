import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import colors from './colors';
import components from './components';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const styles = {
  global: (props: Record<string, any>) => ({
    body: {
      bg: mode('gray.50', 'gray.900')(props),
      color: mode('gray.800', 'whiteAlpha.900')(props),
      transition: 'background-color 0.2s ease-in-out',
    },
  }),
};

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

const fonts = {
  heading: `'Inter', sans-serif`,
  body: `'Inter', sans-serif`,
};

const theme = extendTheme({
  config,
  colors,
  components,
  styles,
  breakpoints,
  fonts,
});

export default theme;