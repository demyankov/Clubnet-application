import { FC, useCallback } from 'react';

import { Button, createStyles, Group, Table, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ClientsFilter } from 'components';
import { RenderContentContainer } from 'components/shared';
import { Paths } from 'constants/paths';
import { useClients } from 'store/store';

const useStyles = createStyles(() => ({
  clientContainer: {
    cursor: 'pointer',
  },
}));

export const ClientsList: FC = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { clients, isClientsFetching } = useClients((state) => state);

  const handleClientCreate = (): void => {};

  const handleClientClick = useCallback(
    (nickname: string): void => {
      navigate(`${Paths.clients}/${nickname}`);
    },
    [navigate],
  );

  return (
    <>
      <Title mt="md" order={2}>
        {t('clients.clients')}
      </Title>

      <Group mt="md" position="apart">
        {/* TODO: add total */}
        <Text c="dimmed">{t('common.total')} 0</Text>

        <Button onClick={handleClientCreate}>{t('clients.addClient')}</Button>
      </Group>

      <ClientsFilter />

      <RenderContentContainer
        isFetching={isClientsFetching}
        isEmpty={!clients?.length}
        emptyTitle={t('common.emptyLit')}
      >
        <Table striped highlightOnHover withBorder withColumnBorders mt="md">
          <thead>
            <tr>
              <th>{t('common.fio')}</th>
              <th>{t('common.nickname')}</th>
              <th>{t('common.phone')}</th>
            </tr>
          </thead>

          <tbody>
            {clients?.map(({ id, name, nickName, phone }) => (
              <tr
                className={classes.clientContainer}
                onClick={() => handleClientClick(nickName)}
                key={id}
              >
                <td>{name}</td>
                <td>{nickName}</td>
                <td>{phone}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </RenderContentContainer>
    </>
  );
};
