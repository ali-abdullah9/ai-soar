import { FC, useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  VStack,
  Text,
  useColorModeValue,
  Collapse,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FiHome,
  FiAlertCircle,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';

type NavItem = {
  label: string;
  icon: React.ElementType;
  path: string;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: FiHome, path: '/' },
  { label: 'Alerts', icon: FiAlertCircle, path: '/alerts' },
  { label: 'Settings', icon: FiSettings, path: '/settings' },
];

const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const bg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Collapse sidebar by default on mobile
  const isCollapsed = isMobile ? true : collapsed;

  return (
    <Box
      as="nav"
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      zIndex={20}
      bg={bg}
      borderRight="1px solid"
      borderColor={borderColor}
      w={isCollapsed ? '60px' : { base: '60px', md: '220px' }}
      transition="width 0.2s"
      boxShadow="md"
      display={{ base: 'none', md: 'block' }}
    >
      <Flex
        direction="column"
        h="full"
        justify="space-between"
        py={4}
        px={isCollapsed ? 2 : 4}
      >
        <VStack spacing={2} align="stretch" flex={1}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                {({ isActive: navIsActive }) => (
                  <Flex
                    align="center"
                    p={2}
                    borderRadius="md"
                    role="group"
                    cursor="pointer"
                    bg={navIsActive || isActive ? useColorModeValue('primary.100', 'primary.700') : 'transparent'}
                    color={navIsActive || isActive ? useColorModeValue('primary.700', 'primary.100') : undefined}
                    _hover={{
                      bg: useColorModeValue('primary.50', 'gray.700'),
                      color: useColorModeValue('primary.700', 'primary.100'),
                    }}
                    transition="all 0.15s"
                  >
                    <Box as={item.icon} fontSize="xl" mr={isCollapsed ? 0 : 3} />
                    <Collapse in={!isCollapsed} animateOpacity style={{ width: '100%' }}>
                      <Text fontWeight="medium">{item.label}</Text>
                    </Collapse>
                  </Flex>
                )}
              </NavLink>
            );
          })}
        </VStack>
        {/* Collapse/Expand Button */}
        <IconButton
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          icon={isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          size="sm"
          variant="ghost"
          alignSelf={isCollapsed ? 'center' : 'flex-end'}
          onClick={() => setCollapsed(c => !c)}
          mt={2}
        />
      </Flex>
    </Box>
  );
};

export default Sidebar;