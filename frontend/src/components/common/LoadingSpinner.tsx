import React from 'react';
import { Spinner, Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Lazy load Framer Motion
const MotionBox = motion(Box);

interface LoadingSpinnerProps {
  size?: string;
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'xl', label }) => {
  return (
    <MotionBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      height="100vh"
    >
      <Spinner size={size} />
      {label && <Text mt={4}>{label}</Text>}
    </MotionBox>
  );
};

export default LoadingSpinner;