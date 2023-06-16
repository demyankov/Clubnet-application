import { FC } from 'react';

import { Container } from '@mantine/core';

import { TournamentsList } from 'components/tournaments';

const Tournaments: FC = () => {
  return (
    <Container size="md">
      <TournamentsList />
    </Container>
  );
};

export default Tournaments;
