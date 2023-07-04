import { FC } from 'react';

import { Box } from '@mantine/core';

import { TournamentsList } from 'components/tournaments';

const Tournaments: FC = () => {
  return (
    <Box>
      <TournamentsList />
    </Box>
  );
};

export default Tournaments;
