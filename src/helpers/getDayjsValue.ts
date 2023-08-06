import dayjs, { Dayjs } from 'dayjs';

export const getDayjsValue = (day: Date, stringValue?: string): Dayjs => {
  if (!stringValue) {
    return dayjs(day);
  }
  const [stringHours, stringMinutes] = stringValue.split(':');

  return dayjs(day)
    .hour(Number(stringHours))
    .minute(Number(stringMinutes))
    .second(0)
    .millisecond(0);
};
