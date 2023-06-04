import { notifications } from '@mantine/notifications';
import { t } from 'i18next';

export const errorHandler = (error: Error): void => {
  if (error.message) {
    notifications.show({
      title: t('notifications.errorHeader'),
      message: error.message,
      color: 'red',
    });
  } else {
    notifications.show({
      title: t('notifications.errorHeader'),
      message: `Error: ${error}`,
      color: 'red',
    });
  }
};
