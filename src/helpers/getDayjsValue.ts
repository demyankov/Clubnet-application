import dayjs, { Dayjs } from 'dayjs';

export const getDayjsValue = (day: Date, strValue: string): Dayjs => {
  const [strHours, strMinutes] = strValue.split(':');

  return dayjs(day)
    .hour(Number(strHours))
    .minute(Number(strMinutes))
    .second(0)
    .millisecond(0);
};
