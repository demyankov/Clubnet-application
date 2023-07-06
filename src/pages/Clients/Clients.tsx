import { FC, useEffect } from 'react';

import { Box } from '@mantine/core';

import { ClientsList } from 'components';
import { useClients } from 'store/store';

const Clients: FC = () => {
  const { getClients } = useClients((state) => state);

  useEffect(() => {
    getClients();
  }, [getClients]);

  return (
    <Box pb="16px">
      <ClientsList />
    </Box>
  );
};

export default Clients;
