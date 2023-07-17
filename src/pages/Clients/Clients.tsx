import { FC, useEffect } from 'react';

import { Box } from '@mantine/core';

import { ClientsList } from 'components';
import { useBalanceHistory, useClients } from 'store/store';

const Clients: FC = () => {
  const { getClients } = useClients((state) => state);
  const { balanceId } = useBalanceHistory((state) => state);

  useEffect(() => {
    getClients();
  }, [getClients, balanceId]);

  return (
    <Box pb="16px">
      <ClientsList />
    </Box>
  );
};

export default Clients;
