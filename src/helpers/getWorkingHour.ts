import dayjs from 'dayjs';

import { WeekDays } from 'store/slices/bookings/types';

export const getWorkingHour = (day: Date): WeekDays => {
  return dayjs(day).format('ddd') as WeekDays;
};
