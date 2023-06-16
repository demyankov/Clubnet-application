import { FC, useEffect } from 'react';

import { Container } from '@mantine/core';

import { ClientsList } from 'components';
import { useClients } from 'store/store';

const Clients: FC = () => {
  const { getClients } = useClients((state) => state);

  useEffect(() => {
    getClients([]);
  }, [getClients]);

  return (
    <Container size="md">
      <ClientsList />
    </Container>
  );
};

export default Clients;
