import { FC } from 'react';

import { Box, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { getDayjsValue, dateFormatting } from 'helpers';

type Props = {
  tableName: number;
  day: Date;
  start: string;
  finish: string;
  name: string;
  phone: string;
};
export const BookingsOrderSuccessModal: FC<Props> = ({
  tableName,
  day,
  start,
  finish,
  name,
  phone,
}) => {
  const { t } = useTranslation();
  const startDate = dateFormatting(getDayjsValue(day, start).toDate());
  const finishDate = dateFormatting(getDayjsValue(day, finish).toDate());

  return (
    <>
      <Text mb="sm">{t('tables.orderDetails')}</Text>
      <Box mb="sm">
        <Group>
          <Text fw={700}>{t('orders.table')}: </Text>
          <Text>{tableName}</Text>
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
      </Box>
      <Text>{t('tables.orderConfirmation')}</Text>
    </>
  );
};
