import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Spinner, Input, HStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Alert } from '../../types/common.types';

const MotionBox = motion(Box);

const AlertFeed: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/alerts'); // Replace with actual API endpoint
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = alerts.filter((alert) =>
    alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    onOpen();
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="md" boxShadow="sm" bg="white">
      {loading && <Spinner size="xl" label="Loading alerts..." />}
      <Text fontSize="lg" fontWeight="bold" mb={4}>Live Alerts</Text>
      <HStack mb={4}>
        <Input
          placeholder="Search alerts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search alerts"
        />
      </HStack>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={4} align="stretch">
            {filteredAlerts.map((alert) => (
              <Box
                key={alert.id}
                p={3}
                borderWidth={1}
                borderRadius="md"
                bg={alert.severity === 'high' ? 'red.100' : alert.severity === 'medium' ? 'yellow.100' : 'green.100'}
                onClick={() => handleAlertClick(alert)}
                cursor="pointer"
                role="button"
                aria-label={`View details for alert ${alert.title}`}
              >
                <Text fontWeight="bold">{alert.title}</Text>
                <Text>{alert.description}</Text>
              </Box>
            ))}
          </VStack>
        </MotionBox>
      )}

      {selectedAlert && (
        <Modal isOpen={isOpen} onClose={onClose} lazy>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedAlert.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{selectedAlert.description}</Text>
              <Text mt={4} fontWeight="bold">Severity: {selectedAlert.severity}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default AlertFeed;
