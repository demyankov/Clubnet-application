import { FC, useEffect } from 'react';

import { ClientsList } from 'components';
import { useClients } from 'store/store';

const Clients: FC = () => {
  const { getClients } = useClients((state) => state);

  useEffect(() => {
    getClients();
  }, [getClients]);

  return <ClientsList />;
};

export default Clients;
