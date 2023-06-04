import { FC } from 'react';

import { Box, Container } from '@mantine/core';

import { TournamentsList } from 'components/tournaments';

const Tournaments: FC = () => {
  return (
    <Box>
      <Container size="md">
        <TournamentsList />
      </Container>
    </Box>
  );
};

export default Tournaments;
