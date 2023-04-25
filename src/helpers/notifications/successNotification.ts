import { notifications } from '@mantine/notifications';

import { TF } from './types';

export const successNotification = (t: TF, message: string): void => {
  notifications.show({
    title: t('notifications.success-header'),
    message: t(message),
    color: 'teal',
  });
};
