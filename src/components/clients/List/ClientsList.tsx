import { FC, MouseEvent, useCallback, useState } from 'react';

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
import { BsCaretDownSquare, BsCaretUpSquare } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

import {
  BalanceWithIcon,
  ClientsFilter,
  ClientsModal,
  RenderContentContainer,
  UpdateBalanceModal,
} from 'components';
import { TABLE_HEADERS } from 'components/clients/config';
import { ISortFields, useSortedClients } from 'components/clients/hooks/useSortedClients';
import { Paths } from 'constants/paths';
import { SortData } from 'constants/sortData';
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
    display: 'inline-block',
    padding: '10px',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: isDarkTheme(theme.colorScheme)
        ? theme.colors.dark[8]
        : theme.colors.dark[0],
    },
  },
  tableContainer: {
    tableLayout: 'fixed',
    '& th:nth-of-type(1)': {
      width: '25%',
    },
  },
  tableHeader: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  sortButton: {
    marginLeft: '5px',
  },
}));

const roleColors: Record<Roles, string> = {
  [Roles.USER]: 'blue',
  [Roles.ADMIN]: 'pink',
  [Roles.CAPTAIN]: 'cyan',
  [Roles.MANAGER]: 'yellow',
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
      title: t('balance.modifyBalance'),
      children: <UpdateBalanceModal userId={id} balance={balance} />,
      centered: true,
    });
  };

  const [sort, setSort] = useState<{ field: ISortFields; direction: SortData }>({
    field: 'name',
    direction: SortData.Increase,
  });
  const toggleSort = (field: ISortFields): void => {
    setSort((prev) => ({
      ...prev,
      field,
      direction:
        prev.direction === SortData.Increase ? SortData.Descending : SortData.Increase,
    }));
  };
  const handleShowMore = useCallback(() => {
    const { field } = sort;

    getMoreClients();
    setSort((prev) => ({
      ...prev,
      field,
    }));
  }, [getMoreClients, sort]);

  const sortedClients = useSortedClients(clients, sort);

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
          <Table
            className={classes.tableContainer}
            mb="xl"
            striped
            highlightOnHover
            mt="md"
          >
            <thead>
              <tr>
                {TABLE_HEADERS.map(({ field, label }) => (
                  <th key={field} onClick={() => toggleSort(field as ISortFields)}>
                    {t(label)}
                    {sort.field === field && sort.direction === SortData.Increase ? (
                      <BsCaretDownSquare className={classes.sortButton} size={13} />
                    ) : (
                      <BsCaretUpSquare className={classes.sortButton} size={13} />
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sortedClients.map(
                ({ id, nickName, image, name, role, phone, balance }) => (
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
                        <BalanceWithIcon balance={balance} />
                      </Box>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </Table>

          <Center mb="xl">
            {IsShowMoreButtonShown && (
              <Button onClick={handleShowMore} loading={isGetMoreFetching}>
                {t('tournaments.showMore')}
              </Button>
            )}
          </Center>
        </RenderContentContainer>
      </div>
    </>
  );
};
