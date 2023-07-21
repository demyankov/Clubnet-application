import { FC, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { ClientsEdit } from 'components/clients/Edit/ClientsEdit';
import { useClients } from 'store/store';

const ClientEdit: FC = () => {
  const { getClientByNickname } = useClients((state) => state);
  const { nickname } = useParams<{ nickname: string }>();

  useEffect(() => {
    if (nickname) {
      getClientByNickname(nickname);
    }
  }, [getClientByNickname, nickname]);

  return <ClientsEdit />;
};

export default ClientEdit;
