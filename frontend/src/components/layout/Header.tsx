import React, { FC, Suspense, lazy } from 'react';
import {
  Box,
  Flex,
  HStack,
  Heading,
  IconButton,
  Avatar,
  Text,
  Hide,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiMenu, FiShield, FiUser } from 'react-icons/fi';
import ThemeToggle from '../common/ThemeToggle';

// Lazy load Framer Motion for animation
const MotionBox = lazy(() =>
  import('framer-motion').then(mod => ({ default: mod.motion.div }))
);

interface HeaderProps {
  onSidebarOpen: () => void;
}

const Header: FC<HeaderProps> = ({ onSidebarOpen }) => {
  const headerBg = useColorModeValue('white', 'dark.800');
  const borderColor = useColorModeValue('gray.200', 'dark.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Suspense fallback={<Flex as="header" h="16" align="center" px={4} />}>
      <MotionBox
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 12 }}
        style={{ width: '100%' }}
      >
        <Box
          as="header"
          bg={headerBg}
          borderBottomWidth="1px"
          borderBottomColor={borderColor}
          px={4}
          py={3}
          position="sticky"
          top={0}
          zIndex={10}
          backdropFilter="blur(10px)"
        >
          <Flex align="center" justify="space-between">
            <HStack spacing={4} align="center">
              <Hide above="lg">
                <IconButton
                  aria-label="Open sidebar"
                  icon={<FiMenu />}
                  onClick={onSidebarOpen}
                  variant="ghost"
                  size="md"
                />
              </Hide>
              <HStack spacing={2} align="center">
                <Box color="cyber.500" fontSize="24px">
                  <FiShield />
                </Box>
                <Heading size="lg" color="cyber.500" fontWeight="bold" lineHeight="1">
                  AI-SOAR
                </Heading>
              </HStack>
            </HStack>

            <HStack spacing={4} align="center">
              <HStack spacing={2} align="center">
                <Box bg="green.400" rounded="full" w="8px" h="8px" />
                <Text fontSize="sm" color={textColor}>
                  System Online
                </Text>
              </HStack>
              <Avatar icon={<FiUser />} bg="cyber.500" size="sm" />
              <ThemeToggle />
            </HStack>
          </Flex>
        </Box>
      </MotionBox>
    </Suspense>
  );
};

export default Header;