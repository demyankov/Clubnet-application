import dayjs from 'dayjs';
import 'dayjs/locale/en';

import { WeekDays } from 'store/slices/bookings/types';

export const getWeekDay = (day: Date): WeekDays => {
  return dayjs(day).locale('en').format('ddd') as WeekDays;
};
