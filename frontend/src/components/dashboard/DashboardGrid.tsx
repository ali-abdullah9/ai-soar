import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import QuickStats from './QuickStats';

interface DashboardGridProps {
  statsData: Array<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactElement;
    color?: string;
  }>;

}

const DashboardGrid: React.FC<DashboardGridProps> = ({ statsData }) => {
  return (
    <Grid
      templateColumns={{
        base: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
      gap={6}
    >
      {statsData.map((stat, index) => (
        <GridItem key={index}>
          <QuickStats
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default DashboardGrid;