import dayjs from 'dayjs';

import { IHourValue } from 'components/bookings/types';

export const generateHours = (): IHourValue[] => {
  const start = dayjs().hour(0).minute(0);
  const finish = dayjs().hour(23).minute(59);
  const hours: IHourValue[] = [];

  let hour = start;

  while (dayjs(hour).isBefore(finish)) {
    const value = hour.format('HH:mm');

    hours.push({ value, label: value, disabled: false });
    hour = hour.add(30, 'minute');
  }

  return hours;
};
