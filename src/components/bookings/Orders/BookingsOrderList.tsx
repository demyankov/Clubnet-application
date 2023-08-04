import { FC, useCallback, useEffect, useState } from 'react';

import { LoadingOverlay, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';

import { BookingsOrderItem } from 'components';
import { DateFormats } from 'constants/dateFormats';
import { getWeekendDays, dateFormatting } from 'helpers';
import { useBookings } from 'store/store';

export const BookingsOrderList: FC = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(new Date());
  const {
    addressActions: { currentAddress },
    orderActions: { orders, getOrders, isOrderFetching, resetOrders },
  } = useBookings((state) => state);
  const { t, i18n } = useTranslation();
  const weekendDays = getWeekendDays(currentAddress!.workingHours);
  const fetchOrders = useCallback(async () => {
    const date = dateFormatting(currentDate!, DateFormats.DayMonthYear);

    await getOrders(currentAddress!.id, date);
  }, [currentDate, currentAddress, getOrders]);

  useEffect(() => {
    fetchOrders();

    return () => {
      resetOrders();
    };
  }, [fetchOrders, resetOrders]);

  return (
    <>
      <LoadingOverlay zIndex={220} visible={isOrderFetching} />

      <DateInput
        valueFormat={DateFormats.MonthDayYear}
        hideOutsideDates
        minDate={new Date()}
        value={currentDate}
        onChange={setCurrentDate}
        locale={i18n.language}
        weekendDays={weekendDays}
        my="md"
      />
      {orders.length
        ? orders.map((order) => <BookingsOrderItem key={order.id} order={order} />)
        : !isOrderFetching && <Text ta="center">{t('orders.noOrders')}</Text>}
    </>
  );
};
