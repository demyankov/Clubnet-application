import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';

import { IOrder } from 'store/slices/bookings/types';

dayjs.extend(dayOfYear);

export const getTodaysOrders = (orders: IOrder[], day: Date): IOrder[] => {
  const res: IOrder[] = [];

  if (orders.length) {
    const currentYear = dayjs(day).year();
    const currentDayOfYear = dayjs(day).dayOfYear();

    orders.forEach((order) => {
      const orderDate = order.start.toDate();
      const orderYear = dayjs(orderDate).year();
      const orderDayOfYear = dayjs(orderDate).dayOfYear();

      if (orderYear === currentYear && orderDayOfYear === currentDayOfYear) {
        res.push(order);
      }
    });
  }

  return res;
};
