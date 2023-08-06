import dayjs from 'dayjs';

import { IHourValue } from 'components/bookings/types';
import { getDayjsValue, getWeekDay } from 'helpers';
import { IOrder, IWorkingHours } from 'store/slices/bookings/types';

export const getStartValues = (
  day: Date,
  reset: () => void,
  workingHours: IWorkingHours,
  todaysOrders: IOrder[],
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
  hasOrders: if (todaysOrders.length) {
    let currentOrderIndex = todaysOrders.findIndex((order) => {
      const orderStart = getDayjsValue(order.start.toDate());

      return orderStart.isAfter(startValue);
    });

    if (currentOrderIndex === -1) {
      // eslint-disable-next-line no-labels
      break hasOrders;
    }

    hours.forEach((hour) => {
      const hourValue = getDayjsValue(day, hour.value);
      const currentOrder = todaysOrders[currentOrderIndex];
      const orderStart = currentOrder ? dayjs(currentOrder.start.toDate()) : null;
      const orderFinish = currentOrder ? dayjs(currentOrder.finish.toDate()) : null;

      if (!currentOrder && hourValue.isBefore(finishValue)) {
        res.push(hour);
      }

      if (
        currentOrder &&
        (hourValue.isSame(startValue) || hourValue.isAfter(startValue)) &&
        hourValue.isBefore(orderStart)
      ) {
        res.push(hour);
      }

      if (
        currentOrder &&
        (hourValue.isSame(orderStart) || hourValue.isAfter(orderStart)) &&
        hourValue.isBefore(orderFinish)
      ) {
        res.push({ ...hour, disabled: true });
      }

      if (
        currentOrder &&
        hourValue.isSame(orderFinish) &&
        hourValue.isBefore(finishValue)
      ) {
        const nextOrder = todaysOrders[currentOrderIndex + 1];
        const nextOrderStart = nextOrder ? dayjs(nextOrder.start.toDate()) : null;

        if (nextOrderStart && hourValue.isSame(nextOrderStart)) {
          res.push({ ...hour, disabled: true });
        } else {
          res.push(hour);
        }

        currentOrderIndex += 1;
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
