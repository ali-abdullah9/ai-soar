// src/pages/Dashboard.tsx

import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { API_BASE_URL, ENV } from '@utils/constants';

console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', ENV);

const stats = [
  { label: 'Active Threats', value: 12 },
  { label: 'Open Incidents', value: 5 },
  { label: 'Automations Run Today', value: 27 },
  { label: 'Users Online', value: 3 },
];

const Dashboard = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box>
      <Heading mb={6} size="lg">
        AI-SOAR Security Dashboard
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
        {stats.map(stat => (
          <Box
            key={stat.label}
            bg={cardBg}
            border="1px solid"
            borderColor={cardBorder}
            borderRadius="lg"
            p={6}
            boxShadow="md"
            textAlign="center"
            transition="box-shadow 0.2s"
            _hover={{ boxShadow: 'xl' }}
          >
            <Text fontSize="2xl" fontWeight="bold" color="primary.500">
              {stat.value}
            </Text>
            <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.300')}>
              {stat.label}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
