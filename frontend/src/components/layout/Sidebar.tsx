import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  useColorModeValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Show,
  Hide,
  HStack,
  Heading,
} from '@chakra-ui/react';
import {
  FiHome,
  FiEye,
  FiAlertTriangle,
  FiZap,
  FiUsers,
  FiServer,
  FiSettings,
  FiShield,
} from 'react-icons/fi';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SidebarContent: React.FC<SidebarProps> = ({ onClose }) => {
  const sidebarBg = useColorModeValue('white', 'dark.800');
  const borderColor = useColorModeValue('gray.200', 'dark.700');
  const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.100');

  const menuItems = [
    { icon: <FiHome />, label: 'Dashboard', active: true },
    { icon: <FiEye />, label: 'Monitoring' },
    { icon: <FiAlertTriangle />, label: 'Alerts' },
    { icon: <FiZap />, label: 'Automation' },
    { icon: <FiUsers />, label: 'Users' },
    { icon: <FiServer />, label: 'Assets' },
    { icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <Box
      bg={sidebarBg}
      borderRightWidth="1px"
      borderRightColor={borderColor}
      w="240px"
      h="full"
      overflowY="auto"
    >
      <VStack spacing={1} align="stretch" p={4}>
        <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2} px={3}>
          MAIN MENU
        </Text>
        {menuItems.map((item, index) => (
          <Button
            key={index}
            leftIcon={item.icon}
            variant={item.active ? 'solid' : 'ghost'}
            colorScheme={item.active ? 'cyber' : 'gray'}
            justifyContent="flex-start"
            size="sm"
            onClick={onClose}
            _hover={{ bg: hoverBg }}
          >
            {item.label}
          </Button>
        ))}
      </VStack>
    </Box>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <Show above="lg">
        <SidebarContent />
      </Show>
      <Hide above="lg">
        <Drawer isOpen={isOpen || false} placement="left" onClose={onClose || (() => {})}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <HStack spacing={2}>
                <Box color="cyber.500" fontSize="24px">
                  <FiShield />
                </Box>
                <Heading size="md" color="cyber.500">
                  AI-SOAR
                </Heading>
              </HStack>
            </DrawerHeader>
            <DrawerBody p={0}>
              <SidebarContent onClose={onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Hide>
    </>
  );
};

export default Sidebar;