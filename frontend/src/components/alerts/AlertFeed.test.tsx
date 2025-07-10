import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertFeed from './AlertFeed';
import { vi } from 'vitest';

describe('AlertFeed Component', () => {
  it('renders the alert feed', () => {
    render(<AlertFeed />);
    expect(screen.getByText('Live Alerts')).toBeInTheDocument();
  });

  it('displays alerts with correct severity colors', async () => {
    const mockAlerts = [
      { id: '1', title: 'High Alert', description: 'Critical issue', severity: 'high' },
      { id: '2', title: 'Medium Alert', description: 'Warning', severity: 'medium' },
      { id: '3', title: 'Low Alert', description: 'Info', severity: 'low' },
    ];
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAlerts),
      })
    );

    render(<AlertFeed />);
    const highAlert = await screen.findByText('High Alert');
    const mediumAlert = await screen.findByText('Medium Alert');
    const lowAlert = await screen.findByText('Low Alert');

    expect(highAlert).toHaveStyle('background-color: red.100');
    expect(mediumAlert).toHaveStyle('background-color: yellow.100');
    expect(lowAlert).toHaveStyle('background-color: green.100');
  });

  it('filters alerts based on search query', async () => {
    const mockAlerts = [
      { id: '1', title: 'High Alert', description: 'Critical issue', severity: 'high' },
      { id: '2', title: 'Medium Alert', description: 'Warning', severity: 'medium' },
    ];
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAlerts),
      })
    );

    render(<AlertFeed />);
    const searchInput = screen.getByPlaceholderText('Search alerts...');
    fireEvent.change(searchInput, { target: { value: 'High' } });

    const highAlert = await screen.findByText('High Alert');
    expect(highAlert).toBeInTheDocument();
    expect(screen.queryByText('Medium Alert')).not.toBeInTheDocument();
  });

  it('opens modal with alert details on click', async () => {
    const mockAlerts = [
      { id: '1', title: 'High Alert', description: 'Critical issue', severity: 'high' },
    ];
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAlerts),
      })
    );

    render(<AlertFeed />);
    const highAlert = await screen.findByText('High Alert');
    fireEvent.click(highAlert);

    expect(screen.getByText('Critical issue')).toBeInTheDocument();
    expect(screen.getByText('Severity: high')).toBeInTheDocument();
  });
});
