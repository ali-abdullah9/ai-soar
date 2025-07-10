import React from 'react';
import { Box, Text, Heading } from '@chakra-ui/react';
import Layout from '../components/layout/Layout';
import AlertFeed from '../components/alerts/AlertFeed';

const Alerts: React.FC = () => {
  return (
    <Layout>
      <Box p={6}>
        <Heading mb={6} size="lg">
          Security Alerts
        </Heading>
        <Text fontSize="md" color="gray.600" mb={4}>
          This page will display threat alerts.
        </Text>
        <AlertFeed />
      </Box>
    </Layout>
  );
};

export default Alerts;