import { FC } from 'react';

import { Box, Container } from '@mantine/core';

import { TournamentsList } from 'components/tournaments';

const Tournaments: FC = () => {
  return (
    <Box pt="60px">
      <Container size="md">
        <TournamentsList />
      </Container>
    </Box>
  );
};

export default Tournaments;
