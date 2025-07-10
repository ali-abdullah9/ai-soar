// src/pages/Dashboard.tsx

import React from 'react';
import { Container, VStack, Box, Heading, Text, Divider, useColorModeValue } from '@chakra-ui/react';
import DashboardGrid from '../components/dashboard/DashboardGrid';
import { FiUsers, FiAlertTriangle, FiZap, FiActivity } from 'react-icons/fi';

const statsData = [
  { title: 'Active Users', value: '1,247', change: 5.2, icon: <FiUsers />, color: 'cyber.500' },
  { title: 'Security Alerts', value: '23', change: -12.3, icon: <FiAlertTriangle />, color: 'red.500' },
  { title: 'Automation Runs', value: '892', change: 8.1, icon: <FiZap />, color: 'green.500' },
  { title: 'System Health', value: '98.7%', change: 2.1, icon: <FiActivity />, color: 'blue.500' },
];

const Dashboard: React.FC = () => {
  return (
    <Container maxW="full" p={6}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Security Dashboard
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Monitor your security posture and automation workflows
          </Text>
        </Box>

        <Divider />

        <DashboardGrid statsData={statsData} />
      </VStack>
    </Container>
  );
};

export default Dashboard;
