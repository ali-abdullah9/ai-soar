import React, { Suspense, lazy } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import theme from './theme';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Settings = lazy(() => import('./pages/Settings'));

const App: React.FC = () => (
  <ChakraProvider theme={theme}>
    <ErrorBoundary>
      <Layout>
        <Box as="main" p={4}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </Box>
      </Layout>
    </ErrorBoundary>
  </ChakraProvider>
);

export default App;