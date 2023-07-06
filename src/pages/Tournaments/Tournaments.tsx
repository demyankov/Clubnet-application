import { FC } from 'react';

import { Box } from '@mantine/core';

import { TournamentsList } from 'components/tournaments';

const Tournaments: FC = () => {
  return (
    <Box pb="16px">
      <TournamentsList />
    </Box>
  );
};

export default Tournaments;
