import { FC, useCallback, useEffect, useState } from 'react';

import { Card, createStyles, Group, Loader, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { DatabasePaths } from 'constants/databasePaths';
import { DateFormats } from 'constants/dateFormats';
import { formatDate } from 'helpers/formatDate';
import { getFireStoreDataByFieldName } from 'integrations/firebase/database';
import { IOrder, ITable } from 'store/slices/bookings/types';

const useStyles = createStyles((theme) => ({
  orderCard: {
    '&:not(:last-child)': {
      marginBottom: theme.spacing.md,
    },
  },
}));

type Props = {
  order: IOrder;
};

export const BookingsOrderItem: FC<Props> = ({ order }) => {
  const [tableName, setTableName] = useState<string>('');
  const {
    start,
    finish,
    contact: { name, phone },
    tableId,
  } = order;
  const { t } = useTranslation();
  const { classes } = useStyles();
  const startDate = formatDate(start.toDate(), DateFormats.DayMonthYearTime);
  const finishDate = formatDate(finish.toDate(), DateFormats.DayMonthYearTime);
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
    <Card withBorder className={classes.orderCard}>
      <Group>
        <Text fw={700}>{t('orders.table')}: </Text>
        <Text>{tableName || <Loader size="xs" />}</Text>
      </Group>
      <Group>
        <Text fw={700}>{t('tables.start')}: </Text>
        <Text>{startDate}</Text>
      </Group>
      <Group>
        <Text fw={700}>{t('tables.end')}: </Text>
        <Text>{finishDate}</Text>
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
