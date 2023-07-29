import dayjs from 'dayjs';

import { DateFormats } from 'constants/dateFormats';

export const formatDate = (date: Date, format: DateFormats): string => {
  return dayjs(date).format(format);
};
