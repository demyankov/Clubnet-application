import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import i18next from 'i18next';

export const dateFormatting = (date?: string): string => {
  dayjs.extend(localizedFormat);
  dayjs.locale(i18next.language === 'en' ? 'en' : 'ru');

  return dayjs(date).format('ddd, DD MMM YYYY, HH:mm');
};
