import { IHourValue } from 'components/bookings/types';
import { getDayjsValue, getWeekDay } from 'helpers';
import { IBooking, IWorkingHours } from 'store/slices/bookings/types';

export const getFinishValues = (
  day: Date,
  reset: () => void,
  workingHours: IWorkingHours,
  todaysBookings: IBooking[],
  startValues: IHourValue[],
  start: string,
  hours: IHourValue[],
): IHourValue[] => {
  const res: IHourValue[] = [];

  if (!day) {
    reset();

    return res;
  }

  const { finish } = workingHours[getWeekDay(day)];

  if (todaysBookings.length) {
    const startIndex = startValues.findIndex((hour) => hour.value === start);

    for (let i = startIndex + 1; i < startValues.length; i += 1) {
      const hour = startValues[i];

      if (hour.disabled) {
        res.push({ ...hour, disabled: false });

        return res;
      }

      res.push(hour);
    }
    res.push({ value: finish, label: finish, disabled: false });

    return res;
  }

  hours.forEach((hour) => {
    const hourValue = getDayjsValue(day, hour.value);
    const startValue = getDayjsValue(day, start);
    const finishValue = getDayjsValue(day, finish);

    if (
      hourValue.isAfter(startValue) &&
      (hourValue.isBefore(finishValue) || hourValue.isSame(finishValue))
    ) {
      res.push(hour);
    }
  });

  return res;
};
