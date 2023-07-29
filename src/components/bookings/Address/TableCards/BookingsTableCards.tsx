import { FC } from 'react';

import { Card, Grid, Text, UnstyledButton, createStyles } from '@mantine/core';
import { IconDeviceLaptop } from '@tabler/icons-react';

import { ITable } from 'store/slices/bookings/types';
import { useBookings } from 'store/store';

const useStyles = createStyles((theme) => ({
  btn: {
    transition: 'all .15s',

    '&:hover': {
      transform: 'scale(1.03)',
    },
  },

  table: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: `calc(100% - 24px - ${theme.spacing.sm})`,
  },

  icon: {
    display: 'inline-block',
    marginRight: theme.spacing.sm,
  },
}));

type Props = {
  tables: ITable[];
  openTable: () => void;
};

export const BookingsTableCards: FC<Props> = ({ tables, openTable }) => {
  const { classes } = useStyles();
  const { setCurrentTable } = useBookings((state) => state.tableActions);

  const handleOpenSettings = (table: ITable): void => {
    setCurrentTable(table);
    openTable();
  };

  return (
    <>
      {tables.map((table) => {
        return (
          <Grid.Col key={table.id} xs={6} sm={3}>
            <UnstyledButton
              w="100%"
              h={80}
              className={classes.btn}
              onClick={() => handleOpenSettings(table)}
            >
              <Card withBorder shadow="sm" h="100%">
                <IconDeviceLaptop className={classes.icon} />
                <Text size="md" className={classes.table}>
                  № {table.name}
                </Text>
              </Card>
            </UnstyledButton>
          </Grid.Col>
        );
      })}
    </>
  );
};
