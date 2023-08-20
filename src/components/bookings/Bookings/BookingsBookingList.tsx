import { FC, useCallback, useEffect, useState } from 'react';

import { LoadingOverlay, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';

import { BookingsBookingItem } from 'components';
import { DateFormats } from 'constants/dateFormats';
import { getWeekendDays, dateFormatting } from 'helpers';
import { useBookings } from 'store/store';

export const BookingsBookingList: FC = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(new Date());
  const {
    addressActions: { currentAddress },
    bookingActions: { bookings, getBookings, isBookingFetching, resetBookings },
  } = useBookings((state) => state);
  const { t, i18n } = useTranslation();
  const weekendDays = getWeekendDays(currentAddress!.workingHours);
  const fetchBookings = useCallback(async () => {
    const date = dateFormatting(currentDate!, DateFormats.DayMonthYear);

    await getBookings(currentAddress!.id, date);
  }, [currentDate, currentAddress, getBookings]);

  useEffect(() => {
    fetchBookings();

    return () => {
      resetBookings();
    };
  }, [fetchBookings, resetBookings]);

  return (
    <>
      <LoadingOverlay zIndex={1} visible={isBookingFetching} />

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
      {bookings.length
        ? bookings.map((booking) => (
            <BookingsBookingItem key={booking.id} booking={booking} />
          ))
        : !isBookingFetching && <Text ta="center">{t('bookings.noBookings')}</Text>}
    </>
  );
};
