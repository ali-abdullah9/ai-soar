import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';
import '@testing-library/jest-dom';
import { expect } from 'vitest';
import { chakraWrapper } from '../../vitest.setup';

describe('useTheme Hook', () => {
  it('toggles the theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: chakraWrapper });

    act(() => {
      result.current.toggleColorMode();
    });

    expect(result.current.colorMode).toBe('dark');
  });
});
