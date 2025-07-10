import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
  it('renders the sidebar', () => {
    render(<Sidebar />);
    expect(screen.getByLabelText('Toggle Sidebar')).toBeInTheDocument();
  });

  it('toggles the sidebar on button click', () => {
    render(<Sidebar />);
    const toggleButton = screen.getByLabelText('Toggle Sidebar');
    fireEvent.click(toggleButton);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
