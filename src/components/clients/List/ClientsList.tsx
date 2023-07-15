import { FC, useCallback, MouseEvent } from 'react';

import {
  Avatar,
  Badge,
  Box,
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

import { UpdateBalanceModal, ClientsFilter, UserBalance } from 'components';
import { ClientsModal } from 'components/clients';
import { RenderContentContainer } from 'components/shared';
import { Paths } from 'constants/paths';
import { Roles } from 'constants/userRoles';
import { isDarkTheme } from 'helpers';
import { useBalanceHistory, useClients } from 'store/store';

const useStyles = createStyles((theme) => ({
  clientContainer: {
    cursor: 'pointer',
  },
  container: {
    position: 'relative',
    minHeight: 'calc(100vh - 300.89px)',
  },
  balance: {
    width: '60px',
    minHeight: '40px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: isDarkTheme(theme.colorScheme)
        ? theme.colors.dark[8]
        : theme.colors.dark[0],
    },
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

  const { isBalanceFetching } = useBalanceHistory((state) => state);

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

  const handleBalanceUpdate = (
    e: MouseEvent<HTMLDivElement>,
    id: string,
    balance?: number,
  ): void => {
    e.stopPropagation();
    modals.open({
      modalId: 'updateBalanceModal',
      title: t('modals.modifyBalance'),
      children: <UpdateBalanceModal userId={id} balance={balance} />,
      centered: true,
    });
  };

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
          isFetching={isClientsFetching || isBalanceFetching}
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
                <th>{t('common.balance')}</th>
              </tr>
            </thead>
            <tbody>
              {clients?.map(({ id, name, nickName, phone, role, image, balance }) => (
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
                  <td>
                    <Box
                      className={classes.balance}
                      onClick={(e) => handleBalanceUpdate(e, id, balance)}
                    >
                      <UserBalance balance={balance} />
                    </Box>
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
