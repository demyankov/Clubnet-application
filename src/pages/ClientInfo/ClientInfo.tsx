import { FC, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { ClientsItem } from 'components';
import { useClients } from 'store/store';

const ClientInfo: FC = () => {
  const { getClientByNickname } = useClients((state) => state);
  const { nickname } = useParams<{ nickname: string }>();

  useEffect(() => {
    if (nickname) {
      getClientByNickname(nickname);
    }
  }, [getClientByNickname, nickname]);

  return <ClientsItem />;
};

export default ClientInfo;
