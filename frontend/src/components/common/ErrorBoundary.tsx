import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box textAlign="center" py={10} px={6}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Something went wrong.
          </Text>
          <Button colorScheme="teal" onClick={this.handleReset}>
            Reset
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };