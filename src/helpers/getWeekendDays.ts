import { DayOfWeek } from '@mantine/dates';

import { weekdays } from 'constants/weekdays';
import { IWorkingHours } from 'store/slices/bookings/types';

export const getWeekendDays = (workingHours: IWorkingHours): DayOfWeek[] => {
  const res: DayOfWeek[] = [];

  weekdays.forEach((day, index) => {
    if (!workingHours[day].isAvailable) {
      res.push((index as DayOfWeek) === 6 ? 0 : ((index + 1) as DayOfWeek));
    }
  });

  return res;
};
