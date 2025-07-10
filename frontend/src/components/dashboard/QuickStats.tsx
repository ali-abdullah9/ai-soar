import React from 'react';
import { Card, CardBody, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Flex, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface QuickStatsProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactElement;
  color?: string;
}

const MotionBox = motion.div;

const QuickStats: React.FC<QuickStatsProps> = ({ title, value, change, icon, color = 'cyber.500' }) => {
  const cardBg = useColorModeValue('white', 'dark.800');
  const borderColor = useColorModeValue('gray.200', 'dark.700');

  return (
    <MotionBox
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        shadow="sm"
        _hover={{
          shadow: 'md',
          borderColor: color,
        }}
        transition="all 0.3s"
      >
        <CardBody>
          <Stat>
            <Flex align="center" justify="space-between">
              <div>
                <StatLabel color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm">
                  {title}
                </StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color={color}>
                  {value}
                </StatNumber>
                {change && (
                  <StatHelpText mb={0}>
                    <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
                    {Math.abs(change)}%
                  </StatHelpText>
                )}
              </div>
              <div style={{ color, fontSize: '24px' }}>
                {icon}
              </div>
            </Flex>
          </Stat>
        </CardBody>
      </Card>
    </MotionBox>
  );
};

export default QuickStats;