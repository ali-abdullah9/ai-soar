import React from 'react';
import { Flex, Box, useColorModeValue } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useDisclosure } from '@chakra-ui/react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const sidebarBg = useColorModeValue('gray.100', 'gray.800');

  return (
    <Flex direction="column" minH="100vh" bg={bgColor} color={useColorModeValue('gray.800', 'white')}>
      {/* Header */}
      <Header onSidebarOpen={onOpen} />

      <Flex flex="1" direction="row">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} onClose={onClose} bg={sidebarBg} />

        {/* Main Content Area */}
        <Box flex="1" p={6} overflow="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;