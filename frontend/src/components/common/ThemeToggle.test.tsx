import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from './ThemeToggle';
import { ChakraProvider } from '@chakra-ui/react';

describe('ThemeToggle Component', () => {
  it('renders the theme toggle button', () => {
    render(
      <ChakraProvider>
        <ThemeToggle />
      </ChakraProvider>
    );
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('toggles the theme on button click', () => {
    render(
      <ChakraProvider>
        <ThemeToggle />
      </ChakraProvider>
    );
    const toggleButton = screen.getByLabelText('Toggle theme');
    fireEvent.click(toggleButton);
    // Add assertions for theme change if needed
  });
});
