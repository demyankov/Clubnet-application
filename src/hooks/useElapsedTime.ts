import { useTranslation } from 'react-i18next';

import { calculateElapsedTimeFromTimestamp } from 'helpers';

export const useElapsedTime = (timestampSeconds: number): string => {
  const { t } = useTranslation();

  const { days, hours, minutes, seconds } =
    calculateElapsedTimeFromTimestamp(timestampSeconds);

  let time;

  if (days > 0) {
    time = `${days} ${t('profile.daysAgo')}`;
  } else if (hours > 0) {
    time = `${hours} ${t('profile.hoursAgo')}`;
  } else if (minutes > 0) {
    time = `${minutes} ${t('profile.minutes')}`;
  } else {
    time = `${seconds} ${t('profile.seconds')}`;
  }

  return time;
};
