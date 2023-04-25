import { notifications } from '@mantine/notifications';

import { TF } from './types';

export const errorNotification = (t: TF, message: string): void => {
  notifications.show({
    title: t('notifications.error-header'),
    message: t(message),
    color: 'red',
  });
};
