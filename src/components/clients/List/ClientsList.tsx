import { FC, useCallback } from 'react';

import {
  Avatar,
  Badge,
  Button,
  Center,
  createStyles,
  Group,
  Table,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ClientsFilter } from 'components';
import { ClientsModal } from 'components/clients/Modal/ClientsModal';
import { RenderContentContainer } from 'components/shared';
import { Paths } from 'constants/paths';
import { Roles } from 'constants/userRoles';
import { isDarkTheme } from 'helpers';
import { useClients } from 'store/store';

const useStyles = createStyles(() => ({
  clientContainer: {
    cursor: 'pointer',
  },
  container: {
    position: 'relative',
    minHeight: 'calc(100vh - 300.89px)',
  },
}));

const roleColors: Record<Roles, string> = {
  [Roles.USER]: 'blue',
  [Roles.ADMIN]: 'pink',
  [Roles.CAPTAIN]: 'cyan',
};

export const ClientsList: FC = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const { clients, isClientsFetching, totalCount, getMoreClients, isGetMoreFetching } =
    useClients((state) => state);

  const IsShowMoreButtonShown = totalCount > clients.length;

  const handleClientCreate = (): void => {
    modals.open({
      modalId: 'addClientsModal',
      title: t('clients.addClient'),
      children: <ClientsModal />,
      centered: true,
    });
  };
  const handleClientClick = useCallback(
    (nickname: string): void => {
      navigate(`${Paths.clients}/${nickname}`);
    },
    [navigate],
  );

  return (
    <>
      <Title mb="mb" order={2}>
        {t('clients.clients')}
      </Title>

      <Group mt="md" position="apart">
        <Text c="dimmed">
          {t('common.total')} {totalCount}
        </Text>

        <Button onClick={handleClientCreate}>{t('clients.addClient')}</Button>
      </Group>

      <ClientsFilter />
      <div className={classes.container}>
        <RenderContentContainer
          isFetching={isClientsFetching}
          isEmpty={!clients?.length}
          emptyTitle={t('common.emptyLit')}
        >
          <Table mb="xl" striped highlightOnHover mt="md">
            <thead>
              <tr>
                <th>{t('common.fullName')}</th>
                <th>{t('common.role')}</th>
                <th>{t('common.nickname')}</th>
                <th>{t('common.phone')}</th>
              </tr>
            </thead>

            <tbody>
              {clients?.map(({ id, name, nickName, phone, role, image }) => (
                <tr
                  className={classes.clientContainer}
                  onClick={() => handleClientClick(nickName!)}
                  key={id}
                >
                  <td>
                    <Group spacing="sm">
                      <Avatar size={30} src={image} radius={30} variant="gradient" />
                      <Text fz="sm" fw={500}>
                        {name}
                      </Text>
                    </Group>
                  </td>
                  <td>
                    <Badge
                      color={roleColors[role]}
                      variant={isDarkTheme(theme.colorScheme) ? 'light' : 'outline'}
                    >
                      {role}
                    </Badge>
                  </td>
                  <td>
                    <Text fz="sm" fw={500}>
                      {nickName}
                    </Text>
                  </td>
                  <td>
                    <Text fz="sm" c="dimmed">
                      {phone}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Center mb="xl">
            {IsShowMoreButtonShown && (
              <Button onClick={getMoreClients} loading={isGetMoreFetching}>
                {t('tournaments.showMore')}
              </Button>
            )}
          </Center>
        </RenderContentContainer>
      </div>
    </>
  );
};
