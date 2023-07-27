import { FC, ReactNode } from 'react';

import { SimpleGrid } from '@mantine/core';

import { breakpointsCardContainer } from 'components/shared/config';

type Props = {
  children: ReactNode;
};

export const CardContainer: FC<Props> = ({ children }) => {
  return (
    <SimpleGrid cols={4} breakpoints={breakpointsCardContainer}>
      {children}
    </SimpleGrid>
  );
};
