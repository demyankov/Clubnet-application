import { FC } from 'react';

import { useClients } from 'store/store';

export const ClientsItem: FC = () => {
  const { client } = useClients((state) => state);

  return <div>{client?.nickName}</div>;
};
