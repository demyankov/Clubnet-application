import dayjs from 'dayjs';

import { IHourValue } from 'components';
import { getDayjsValue, getWorkingHour } from 'helpers';
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

  const { isAvailable, start, finish } = workingHours[getWorkingHour(day)];
  let startValue = getDayjsValue(day, start);
  const finishValue = getDayjsValue(day, finish);
  const now = dayjs();

  if (now.isAfter(startValue)) {
    startValue = now;
  }

  if (!isAvailable) {
    reset();
  }

  if (todaysOrders.length) {
    let currentOrderIndex: number = 0;

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
