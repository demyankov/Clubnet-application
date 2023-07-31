import { FC } from 'react';

import { Badge, Box } from '@mantine/core';

type Props = {
  totalCount: number;
};

export const BadgeTotalCount: FC<Props> = ({ totalCount }) => {
  return (
    <Box>
      {!!totalCount && (
        <Badge w={16} h={16} variant="filled" size="xs" p={0}>
          {totalCount}
        </Badge>
      )}
    </Box>
  );
};
