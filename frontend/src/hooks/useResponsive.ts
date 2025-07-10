import { useBreakpointValue } from '@chakra-ui/react';

interface UseResponsiveResult {
  isMobile: boolean;
  isDesktop: boolean;
}

const useResponsive = (): UseResponsiveResult => {
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
  const isDesktop = useBreakpointValue({ base: false, md: true }) ?? false;

  return { isMobile, isDesktop };
};

export { useResponsive };