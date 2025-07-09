import { FC, Suspense, lazy } from 'react';
import {
  Flex,
  Box,
  IconButton,
  Avatar,
  useColorModeValue,
  Text,
  HStack,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import ThemeToggle from '../common/ThemeToggle';

// Lazy load Framer Motion for animation
const MotionBox = lazy(() =>
  import('framer-motion').then(mod => ({ default: mod.motion.div }))
);

interface HeaderProps {
  onOpenSidebar?: () => void;
}

const Header: FC<HeaderProps> = ({ onOpenSidebar }) => {
  const bg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Suspense fallback={<Flex as="header" h="16" align="center" px={4} />}>
      <MotionBox
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 12 }}
        style={{ width: '100%' }}
      >
        <Flex
          as="header"
          w="100%"
          h="16"
          align="center"
          justify="space-between"
          px={{ base: 4, md: 8 }}
          bg={bg}
          borderBottom="1px solid"
          borderColor={borderColor}
          position="sticky"
          top={0}
          zIndex={10}
        >
          {/* Left: Hamburger for mobile, Logo */}
          <HStack spacing={4}>
            <Box display={{ base: 'block', md: 'none' }}>
              <IconButton
                aria-label="Open sidebar"
                icon={<HamburgerIcon />}
                variant="ghost"
                onClick={onOpenSidebar}
                fontSize="xl"
              />
            </Box>
            <Box
              as="a"
              href="/"
              fontWeight="bold"
              fontSize="xl"
              letterSpacing="tight"
              _hover={{
                color: useColorModeValue('primary.600', 'primary.300'),
                textDecoration: 'none',
                transform: 'scale(1.04)',
                transition: 'all 0.15s',
              }}
              transition="all 0.15s"
              aria-label="AI-SOAR Home"
            >
              {/* Logo Placeholder */}
              <Text as="span" color={useColorModeValue('primary.600', 'primary.300')}>
                AI
              </Text>
              <Text as="span" color={useColorModeValue('gray.700', 'whiteAlpha.900')}>
                -SOAR
              </Text>
            </Box>
          </HStack>

          {/* Right: Theme toggle, User info */}
          <HStack spacing={3}>
            <ThemeToggle />
            <Box
              as="button"
              _hover={{
                boxShadow: 'md',
                transform: 'translateY(-2px) scale(1.04)',
                transition: 'all 0.15s',
              }}
              transition="all 0.15s"
              display="flex"
              alignItems="center"
              px={2}
              py={1}
              borderRadius="md"
              bg={useColorModeValue('gray.100', 'gray.800')}
            >
              {/* User avatar/info placeholder */}
              <Avatar
                size="sm"
                name="User"
                src=""
                mr={{ base: 0, md: 2 }}
                bg={useColorModeValue('primary.500', 'primary.400')}
                color="white"
              />
              <Box display={{ base: 'none', md: 'block' }}>
                <Text fontSize="sm" fontWeight="medium">
                  User Name
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Analyst
                </Text>
              </Box>
            </Box>
          </HStack>
        </Flex>
      </MotionBox>
    </Suspense>
  );
};

export default Header;