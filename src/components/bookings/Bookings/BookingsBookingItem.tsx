import { FC, useCallback, useEffect, useState } from 'react';

import { Card, createStyles, Group, Loader, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { DatabasePaths } from 'constants/databasePaths';
import { dateFormatting } from 'helpers';
import { getFireStoreDataByFieldName } from 'integrations/firebase/database';
import { IBooking, ITable } from 'store/slices/bookings/types';

const useStyles = createStyles((theme) => ({
  bookingCard: {
    '&:not(:last-child)': {
      marginBottom: theme.spacing.md,
    },
  },
}));

type Props = {
  booking: IBooking;
};

export const BookingsBookingItem: FC<Props> = ({ booking }) => {
  const [tableName, setTableName] = useState<string>('');
  const {
    start,
    finish,
    contact: { name, phone },
    tableId,
  } = booking;
  const { t } = useTranslation();
  const { classes } = useStyles();
  const getTableName = useCallback(async () => {
    const tableData = await getFireStoreDataByFieldName<ITable>(
      DatabasePaths.Tables,
      tableId,
    );

    if (tableData) {
      setTableName(tableData.name.toString());
    }
  }, [tableId]);

  useEffect(() => {
    getTableName();
  }, [getTableName]);

  return (
    <Card withBorder className={classes.bookingCard}>
      <Group>
        <Text fw={700}>{t('bookings.table')}: </Text>
        <Text>{tableName || <Loader size="xs" />}</Text>
      </Group>
      <Group>
        <Text fw={700}>{t('tables.start')}: </Text>
        <Text>{dateFormatting(start.toDate())}</Text>
      </Group>
      <Group>
        <Text fw={700}>{t('tables.end')}: </Text>
        <Text>{dateFormatting(finish.toDate())}</Text>
      </Group>
      <Group>
        <Text fw={700}>{t('tables.customerName')}: </Text>
        <Text>{name}</Text>
      </Group>
      <Group>
        <Text fw={700}>{t('common.phone')}: </Text>
        <Text>{phone}</Text>
      </Group>
    </Card>
  );
};
