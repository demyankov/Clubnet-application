import dayjs from 'dayjs';

import { IHourValue } from 'components/bookings/types';
import { getDayjsValue, getWeekDay } from 'helpers';
import { IBooking, IWorkingHours } from 'store/slices/bookings/types';

export const getStartValues = (
  day: Date,
  reset: () => void,
  workingHours: IWorkingHours,
  todaysBookings: IBooking[],
  hours: IHourValue[],
): IHourValue[] => {
  const res: IHourValue[] = [];

  if (!day) {
    reset();

    return res;
  }

  const { isAvailable, start, finish } = workingHours[getWeekDay(day)];
  let startValue = getDayjsValue(day, start);
  const finishValue = getDayjsValue(day, finish);
  const now = dayjs();

  if (now.isAfter(startValue)) {
    startValue = now;
  }

  if (!isAvailable) {
    reset();
  }

  // eslint-disable-next-line no-labels,no-restricted-syntax
  hasBookings: if (todaysBookings.length) {
    let currentBookingIndex = todaysBookings.findIndex((booking) => {
      const bookingStart = getDayjsValue(booking.start.toDate());

      return bookingStart.isAfter(startValue);
    });

    if (currentBookingIndex === -1) {
      // eslint-disable-next-line no-labels
      break hasBookings;
    }

    hours.forEach((hour) => {
      const hourValue = getDayjsValue(day, hour.value);
      const currentBooking = todaysBookings[currentBookingIndex];
      const bookingStart = currentBooking ? dayjs(currentBooking.start.toDate()) : null;
      const bookingFinish = currentBooking ? dayjs(currentBooking.finish.toDate()) : null;

      if (!currentBooking && hourValue.isBefore(finishValue)) {
        res.push(hour);
      }

      if (
        currentBooking &&
        (hourValue.isSame(startValue) || hourValue.isAfter(startValue)) &&
        hourValue.isBefore(bookingStart)
      ) {
        res.push(hour);
      }

      if (
        currentBooking &&
        (hourValue.isSame(bookingStart) || hourValue.isAfter(bookingStart)) &&
        hourValue.isBefore(bookingFinish)
      ) {
        res.push({ ...hour, disabled: true });
      }

      if (
        currentBooking &&
        hourValue.isSame(bookingFinish) &&
        hourValue.isBefore(finishValue)
      ) {
        const nextBooking = todaysBookings[currentBookingIndex + 1];
        const nextBookingStart = nextBooking ? dayjs(nextBooking.start.toDate()) : null;

        if (nextBookingStart && hourValue.isSame(nextBookingStart)) {
          res.push({ ...hour, disabled: true });
        } else {
          res.push(hour);
        }

        currentBookingIndex += 1;
      }
    });

    return res;
  }

  hours.forEach((hour) => {
    const hourValue = getDayjsValue(day, hour.value);

    if (
      (hourValue.isSame(startValue) || hourValue.isAfter(startValue)) &&
      hourValue.isBefore(finishValue)
    ) {
      res.push(hour);
    }
  });

  return res;
};
