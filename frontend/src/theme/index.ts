import { extendTheme, type ThemeConfig, type StyleFunctionProps } from '@chakra-ui/react';
import colors from './colors';
import components from './components';

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    },
  }),
};

const theme = extendTheme({
  config,
  styles,
  colors,
  components,
});

export default theme;