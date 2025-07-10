import React from 'react';
import { Box, Text, Heading } from '@chakra-ui/react';
import Layout from '../components/layout/Layout';

const Settings: React.FC = () => {
  return (
    <Layout>
      <Box p={6}>
        <Heading mb={6} size="lg">
          System Settings
        </Heading>
        <Text fontSize="md" color="gray.600">
          Manage your application preferences and configurations here.
        </Text>
      </Box>
    </Layout>
  );
};

export default Settings;