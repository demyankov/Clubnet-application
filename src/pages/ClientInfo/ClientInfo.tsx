import { FC, useEffect } from 'react';

import { Container } from '@mantine/core';
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

  return (
    <Container size="md">
      <ClientsItem />
    </Container>
  );
};

export default ClientInfo;
