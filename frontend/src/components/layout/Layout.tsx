import type { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <Flex minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
    <Sidebar />
    <Box flex="1" ml={{ base: 0, md: '220px' }} transition="margin 0.2s">
      <Header />
      <Box as="main" px={{ base: 4, md: 8 }} py={6}>
        {children}
      </Box>
    </Box>
  </Flex>
);

export default Layout;